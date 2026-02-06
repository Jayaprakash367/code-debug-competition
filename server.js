import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(session({
  secret: 'debug-competition-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (req.session.teamId) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Middleware to check admin
const requireAdmin = (req, res, next) => {
  if (req.session.teamName === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
};

// Register
app.post('/register', (req, res) => {
  const { teamName, participants } = req.body;
  if (!teamName) {
    return res.status(400).json({ error: 'Team name is required' });
  }

  db.get('SELECT id FROM teams WHERE team_name = ?', [teamName], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (row) return res.status(400).json({ error: 'Team name already exists' });

    db.run('INSERT INTO teams (team_name, participants) VALUES (?, ?)', [teamName, participants || ''], function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });

      const teamId = this.lastID;
      if (participants) {
        const names = participants.split(',').map(name => name.trim());
        names.forEach(name => {
          db.run('INSERT INTO participants (team_id, name) VALUES (?, ?)', [teamId, name]);
        });
      }

      req.session.teamId = teamId;
      req.session.teamName = teamName;
      res.json({ message: 'Registration successful', teamId, teamName });
    });
  });
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logged out' });
  });
});

// Check auth
app.get('/check-auth', (req, res) => {
  if (req.session.teamId) {
    res.json({ authenticated: true, teamId: req.session.teamId, teamName: req.session.teamName });
  } else {
    res.json({ authenticated: false });
  }
});

// Get challenges
app.get('/challenges', (req, res) => {
  console.log('GET /challenges called');
  console.log('Session:', req.session);
  console.log('Team ID:', req.session.teamId);
  
  if (!req.session.teamId) {
    console.log('No team ID in session, returning unauthorized');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  db.all('SELECT id, name, description, language, points FROM challenges', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    console.log(`Returning ${rows.length} challenges`);
    res.json(rows);
  });
});

// Execute code
app.post('/execute', (req, res) => {
  const { code, language } = req.body;
  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  if (code.length > 10000) {
    return res.status(400).json({ error: 'Code too long' });
  }

  const tempDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const fileName = `temp_${Date.now()}`;
  let filePath, compileCmd, runCmd;

  switch (language.toLowerCase()) {
    case 'c':
      filePath = path.join(tempDir, `${fileName}.c`);
      compileCmd = ['gcc', filePath, '-o', path.join(tempDir, fileName)];
      runCmd = [path.join(tempDir, fileName)];
      break;
    case 'c++':
      filePath = path.join(tempDir, `${fileName}.cpp`);
      compileCmd = ['g++', filePath, '-o', path.join(tempDir, fileName)];
      runCmd = [path.join(tempDir, fileName)];
      break;
    case 'java':
      filePath = path.join(tempDir, `${fileName}.java`);
      compileCmd = ['javac', filePath];
      runCmd = ['java', '-cp', tempDir, fileName];
      break;
    case 'python':
      filePath = path.join(tempDir, `${fileName}.py`);
      compileCmd = null;
      runCmd = ['python', filePath];
      break;
    default:
      return res.status(400).json({ error: 'Unsupported language' });
  }

  fs.writeFileSync(filePath, code);

  let output = '';
  let error = '';
  let responseSent = false;

  const sendResponse = () => {
    if (!responseSent) {
      responseSent = true;
      res.json({ output: output.trim(), error: error.trim() });
    }
  };

  const cleanup = () => {
    try {
      fs.unlinkSync(filePath);
      if (language !== 'python') {
        const exePath = path.join(tempDir, fileName + (language === 'java' ? '.class' : ''));
        if (fs.existsSync(exePath)) fs.unlinkSync(exePath);
      }
    } catch (e) {
      console.error('Cleanup error:', e.message);
    }
    sendResponse();
  };

  const runExecution = () => {
    console.log(`Executing: ${runCmd[0]} ${runCmd.slice(1).join(' ')}`);
    const child = spawn(runCmd[0], runCmd.slice(1), { cwd: tempDir, shell: true });
    let timeout = setTimeout(() => {
      child.kill();
      error = 'Execution timeout (5 seconds exceeded)';
      cleanup();
    }, 5000);

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      error += data.toString();
    });

    child.on('error', (err) => {
      clearTimeout(timeout);
      console.error('Execution error:', err);
      error = `Runtime error: ${err.message}`;
      cleanup();
    });

    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code !== 0 && !error) {
        error = `Process exited with code ${code}`;
      }
      cleanup();
    });
  };

  if (compileCmd) {
    console.log(`Compiling: ${compileCmd[0]} ${compileCmd.slice(1).join(' ')}`);
    const compile = spawn(compileCmd[0], compileCmd.slice(1), { cwd: tempDir, shell: true });
    let compileOutput = '';
    let compileError = '';

    compile.stdout.on('data', (data) => {
      compileOutput += data.toString();
    });

    compile.stderr.on('data', (data) => {
      compileError += data.toString();
    });

    compile.on('error', (err) => {
      console.error('Compiler error:', err);
      error = `Compiler not found: ${compileCmd[0]}. Make sure ${compileCmd[0]} is installed and in PATH.`;
      cleanup();
    });

    compile.on('close', (code) => {
      if (code !== 0) {
        error = compileError || compileOutput || `Compilation failed (exit code ${code})`;
        console.error('Compilation failed:', error);
        cleanup();
      } else {
        console.log('Compilation successful, running code...');
        runExecution();
      }
    });
  } else {
    runExecution();
  }
});

// Submit solution
app.post('/submit', requireAuth, (req, res) => {
  const { challengeId, code, output, timeTaken } = req.body;
  if (!challengeId || !code || output === undefined || !timeTaken) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.get('SELECT expected_output FROM challenges WHERE id = ?', [challengeId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Challenge not found' });

    const status = output.trim() === row.expected_output.trim() ? 'correct' : 'incorrect';

    db.run('INSERT INTO submissions (team_id, challenge_id, submitted_code, status, output, time_taken) VALUES (?, ?, ?, ?, ?, ?)',
      [req.session.teamId, challengeId, code, status, output, timeTaken], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Submission successful', status });
      });
  });
});

// Get submissions
app.get('/submissions', requireAuth, (req, res) => {
  db.all(`
    SELECT s.*, c.name as challenge_name
    FROM submissions s
    JOIN challenges c ON s.challenge_id = c.id
    WHERE s.team_id = ?
    ORDER BY s.submitted_at DESC
  `, [req.session.teamId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Admin routes
app.get('/admin/teams', requireAuth, requireAdmin, (req, res) => {
  db.all('SELECT * FROM teams', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

app.get('/admin/challenges', requireAuth, requireAdmin, (req, res) => {
  db.all('SELECT * FROM challenges', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

app.post('/admin/challenges', requireAuth, requireAdmin, (req, res) => {
  const { name, description, language, buggy_code, expected_output, points } = req.body;
  db.run('INSERT INTO challenges (name, description, language, buggy_code, expected_output, points) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, language, buggy_code, expected_output, points], function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ id: this.lastID });
    });
});

app.put('/admin/challenges/:id', requireAuth, requireAdmin, (req, res) => {
  const { name, description, language, buggy_code, expected_output, points } = req.body;
  db.run('UPDATE challenges SET name = ?, description = ?, language = ?, buggy_code = ?, expected_output = ?, points = ? WHERE id = ?',
    [name, description, language, buggy_code, expected_output, points, req.params.id], function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ changes: this.changes });
    });
});

app.delete('/admin/challenges/:id', requireAuth, requireAdmin, (req, res) => {
  db.run('DELETE FROM challenges WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ changes: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
