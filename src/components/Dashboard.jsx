import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const { teamName, logout } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [submissionsRes, challengesRes] = await Promise.all([
        axios.get('/api/submissions', { withCredentials: true }),
        axios.get('/api/challenges', { withCredentials: true })
      ]);
      setSubmissions(submissionsRes.data);
      setChallenges(challengesRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {teamName}!</h1>
        <div className="flex items-center space-x-4">
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Start Competition</Link>
          <button onClick={toggleDarkMode} className="p-2 rounded bg-gray-200 dark:bg-gray-700">
            {isDark ? '☀️' : '🌙'}
          </button>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-4">Your Submissions</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Challenge</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Time Taken</th>
                <th className="px-4 py-2 text-left">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-t border-gray-200 dark:border-gray-600">
                  <td className="px-4 py-2">{submission.challenge_name}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded ${submission.status === 'correct' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{submission.time_taken}s</td>
                  <td className="px-4 py-2">{new Date(submission.submitted_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-4">Available Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold mb-2">{challenge.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{challenge.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">Language: {challenge.language.toUpperCase()}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Points: {challenge.points}</p>
              <Link
                to={`/workspace?challenge=${challenge.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 block text-center"
              >
                Start Challenge
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
