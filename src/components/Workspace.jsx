import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Disqualified from './Disqualified';

const Workspace = () => {
  const [searchParams] = useSearchParams();
  const challengeId = searchParams.get('challenge');
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('c');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [warningReason, setWarningReason] = useState('');
  const [countdown, setCountdown] = useState(3);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId]);

  useEffect(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimer(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !isDisqualified) {
        if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
        setWarningReason('Tab switch or browser minimize detected');
        setIsWarningVisible(true);
        setCountdown(3);
        warningTimeoutRef.current = setTimeout(() => {
          disqualify();
        }, 3000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, [isDisqualified]);

  useEffect(() => {
    const handlePaste = (e) => {
      if (editorContainerRef.current && editorContainerRef.current.contains(e.target)) {
        const pastedText = e.clipboardData.getData('text');
        e.preventDefault();
        if (pastedText.length > 100) {
          // Suspicious large paste, immediate disqualify
          setWarningReason('Suspicious paste from external source detected');
          disqualify();
        } else {
          // Small paste, show warning
          if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
          setWarningReason('Paste detected - external copying is prohibited');
          setIsWarningVisible(true);
          setCountdown(3);
          warningTimeoutRef.current = setTimeout(() => {
            disqualify();
          }, 3000);
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, [isDisqualified]);

  const disqualify = () => {
    if (isDisqualified) return;
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    clearInterval(timerRef.current);
    setIsDisqualified(true);
    // Optionally log to backend
    // axios.post('/api/disqualify', { reason: warningReason, challengeId }, { withCredentials: true }).catch(console.error);
  };

  // Countdown effect
  useEffect(() => {
    if (isWarningVisible && countdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            disqualify();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isWarningVisible, countdown]);

  // Disable editor during warning
  useEffect(() => {
    if (isWarningVisible && editorRef.current) {
      editorRef.current.updateOptions({ readOnly: true });
    } else if (editorRef.current && !isDisqualified) {
      editorRef.current.updateOptions({ readOnly: false });
    }
  }, [isWarningVisible, isDisqualified]);

  const fetchChallenge = async () => {
    try {
      const challengesRes = await axios.get('/api/challenges', { withCredentials: true });
      const challengeData = challengesRes.data.find(c => c.id == challengeId);
      if (challengeData) {
        setChallenge(challengeData);
        setCode(challengeData.buggy_code);
        setLanguage(challengeData.language.toLowerCase());
      }
    } catch (error) {
      console.error('Failed to fetch challenge:', error);
    }
  };

  const handleExecute = async () => {
    if (isDisqualified || isWarningVisible) return;
    setLoading(true);
    setOutput('');
    setError('');
    try {
      const response = await axios.post('/api/execute', { code, language }, { withCredentials: true });
      setOutput(response.data.output);
      if (response.data.error) {
        setError(response.data.error);
      }
    } catch (err) {
      setError('Execution failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (isDisqualified || isWarningVisible) return;
    if (!output.trim()) {
      alert('Please execute the code first');
      return;
    }

    try {
      const response = await axios.post('/api/submit', {
        challengeId,
        code,
        output,
        timeTaken: timer
      }, { withCredentials: true });

      alert(`Submission ${response.data.status}!`);
      if (response.data.status === 'correct') {
        navigate('/dashboard');
      }
    } catch (err) {
      alert('Submission failed');
    }
  };

  if (isDisqualified) {
    return <Disqualified reason={warningReason} />;
  }

  if (!challenge) {
    return <div className="flex justify-center items-center min-h-screen">Loading challenge...</div>;
  }

  return (
    <div className="min-h-screen p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{challenge.name}</h1>
        <div className="flex items-center space-x-4">
          <span>Time: {timer}s</span>
          <button onClick={() => navigate('/dashboard')} className="bg-gray-600 text-white px-4 py-2 rounded">Back to Dashboard</button>
        </div>
      </header>

      {isWarningVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4 text-center"
          >
            <h2 className="text-xl font-bold text-red-600 mb-4">Warning!</h2>
            <p className="mb-4">{warningReason}</p>
            <p className="text-lg mb-4">You will be disqualified in <span className="text-red-600 font-bold">{countdown}</span> seconds.</p>
            <button
              onClick={() => {
                if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
                if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
                setIsWarningVisible(false);
                setWarningReason('');
                setCountdown(3);
              }}
              disabled={false} // Allow dismiss for now, but auto will trigger
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Dismiss Warning
            </button>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isWarningVisible}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50"
            >
              <option value="c">C</option>
              <option value="c++">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>
          <div ref={editorContainerRef}>
            <Editor
              height="400px"
              language={language}
              value={code}
              onChange={setCode}
              onMount={(editor) => { editorRef.current = editor; }}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                readOnly: isWarningVisible,
              }}
            />
          </div>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={handleExecute}
              disabled={loading || isWarningVisible}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Executing...' : 'Execute'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isWarningVisible}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold mb-2">Output</h3>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-auto">
            {output}
            {error && <div className="text-red-400 mt-2">{error}</div>}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Workspace;
