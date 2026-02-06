# Code Debug Competition Platform

A complete web application for a code debugging competition where teams can solve challenges in multiple programming languages.

## Features

✅ **10+ Coding Challenges** - Multiple programming tasks in C, C++, Python, and Java
✅ **Multi-Language Support** - Code in C, C++, Java, or Python
✅ **Real-time Code Execution** - Execute code and see instant output
✅ **Automatic Scoring** - Output comparison with expected results
✅ **Success Modal** - Celebratory message when challenges are completed
✅ **Team Registration** - Register teams with participants
✅ **Submission Tracking** - View all submissions and their status
✅ **Timer** - Track time taken to solve challenges
✅ **Dark Mode** - Toggle between light and dark themes
✅ **Security Features** - Paste detection and tab-switch warnings

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Python, C, C++, Java installed (for code execution)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Seed the database with challenges:**
```bash
npm run seed
```

3. **Start development environment:**
```bash
npm run dev
```

This starts both servers:
- Frontend (Vite): http://localhost:5173
- Backend (Express): http://localhost:3001

## How to Use

### 1. **Register Your Team**
- Go to http://localhost:5173
- Click "Register"
- Enter your team name
- Optionally add participant names
- Complete registration

### 2. **View Challenges**
- After registration, you'll see the dashboard
- "Available Challenges" section shows all coding tasks
- Each challenge shows:
  - Challenge name
  - Description
  - Programming language
  - Points available

### 3. **Solve a Challenge**
- Click "Start Challenge" on any task
- The workspace opens with:
  - Challenge description and expected output
  - Code editor with the buggy code
  - Language selector
  - Output terminal

### 4. **Execute Code**
- Select your programming language
- Modify the buggy code
- Click "Execute" to run your code
- View output in the terminal on the right

### 5. **Submit Solution**
- Once your output matches the expected output
- Click "Submit" to submit your solution
- Success modal appears with points earned
- Redirects back to dashboard

### 6. **Track Submissions**
- Dashboard shows:
  - All your submissions
  - Challenge names
  - Status (correct/incorrect)
  - Time taken for each submission
  - Submission timestamps

## Challenge List

The platform includes 10 challenges across multiple languages:

1. **Sum of Numbers in C** - Loop and arithmetic (10 pts)
2. **Print Hello World in Python** - Syntax fixing (5 pts)
3. **Array Print in C++** - Off-by-one error fix (15 pts)
4. **Factorial in Python** - Recursion fix (20 pts)
5. **Loop Output in Java** - Output formatting (8 pts)
6. **Even Numbers in C** - Conditional loops (12 pts)
7. **String Concatenation in Python** - String operations (7 pts)
8. **Reverse Number in C++** - Number manipulation (18 pts)
9. **Multiplication Table in Python** - Loop iteration (10 pts)
10. **Sum Array in Java** - Array processing (12 pts)

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Admin.jsx              # Admin dashboard
│   │   ├── Dashboard.jsx          # Main dashboard
│   │   ├── Workspace.jsx          # Code editor workspace
│   │   ├── SuccessModal.jsx       # Success notification
│   │   ├── Landing.jsx            # Landing page
│   │   ├── Register.jsx           # Registration page
│   │   ├── Onboarding.jsx         # Onboarding page
│   │   ├── Rules.jsx              # Competition rules
│   │   ├── Terms.jsx              # Terms of service
│   │   └── Disqualified.jsx       # Disqualification page
│   ├── context/
│   │   ├── AuthContext.jsx        # Authentication state
│   │   └── DarkModeContext.jsx    # Dark mode state
│   ├── App.jsx                    # Main app component
│   └── main.jsx                   # Entry point
├── server.js                      # Express backend server
├── db.js                          # SQLite database setup
├── test_insert.js                 # Database seeding script
├── vite.config.js                 # Vite configuration
└── tailwind.config.js             # Tailwind CSS configuration
```

## API Endpoints

### Authentication
- `POST /register` - Register a team
- `POST /logout` - Logout user
- `GET /check-auth` - Check authentication status

### Challenges
- `GET /challenges` - Get all challenges
- `POST /execute` - Execute code and get output
- `POST /submit` - Submit solution

### Submissions
- `GET /submissions` - Get user submissions

### Admin (requires admin account)
- `GET /admin/teams` - Get all teams
- `GET /admin/challenges` - Get all challenges
- `POST /admin/challenges` - Create challenge
- `PUT /admin/challenges/:id` - Update challenge
- `DELETE /admin/challenges/:id` - Delete challenge

## Database Schema

### teams
```sql
id (INTEGER PRIMARY KEY)
team_name (TEXT UNIQUE)
participants (TEXT)
```

### challenges
```sql
id (INTEGER PRIMARY KEY)
name (TEXT)
description (TEXT)
language (TEXT)
buggy_code (TEXT)
expected_output (TEXT)
points (INTEGER)
```

### submissions
```sql
id (INTEGER PRIMARY KEY)
team_id (INTEGER)
challenge_id (INTEGER)
submitted_code (TEXT)
status (TEXT: 'correct' | 'incorrect')
output (TEXT)
time_taken (INTEGER)
submitted_at (DATETIME)
```

### participants
```sql
id (INTEGER PRIMARY KEY)
team_id (INTEGER)
name (TEXT)
```

## Scoring

Each challenge awards points upon successful completion:
- Easy challenges: 5-10 points
- Medium challenges: 12-20 points
- Hard challenges: 25+ points

## Admin Features

Login with team name "admin" to access:
- View all registered teams and participants
- Create new challenges
- Edit existing challenges
- Delete challenges

## Troubleshooting

**Challenges not showing?**
```bash
npm run seed
```
Reseed the database to populate challenges.

**Code execution fails?**
- Ensure Python, GCC, G++, and Java are installed
- Check that the code syntax is correct

**API calls fail?**
- Verify both servers are running (frontend and backend)
- Check browser console for error messages

## Features in Action

1. **Real-time Code Execution**
   - Write or fix buggy code
   - Execute instantly
   - See output in terminal

2. **Automatic Output Comparison**
   - System compares your output with expected
   - Shows success when they match

3. **Fraud Prevention**
   - Detects and warns on tab switches
   - Detects suspicious copy-paste attempts
   - Automatic disqualification on violations

4. **Responsive Design**
   - Mobile-friendly interface
   - Works on desktop, tablet, mobile

## Technologies Used

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Express.js, SQLite3
- **Code Editor**: Monaco Editor
- **HTTP Client**: Axios

## Development Commands

```bash
# Install dependencies
npm install

# Seed database
npm run seed

# Start development servers
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend

# Build for production
npm build

# Preview production build
npm run preview
```

## License

This project is part of the Code Debug Competition. All rights reserved.

## Support

For issues or questions, check the console for error messages or verify:
1. Both servers are running
2. Database is seeded with challenges
3. All dependencies are installed
4. Required compilers (gcc, g++, java, python) are installed
