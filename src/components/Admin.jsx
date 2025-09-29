import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';

const Admin = () => {
  const [teams, setTeams] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('challenges');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    language: 'C',
    buggy_code: '',
    expected_output: '',
    points: 10
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { teamName, logout } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    if (teamName !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [teamName, navigate]);

  const fetchData = async () => {
    try {
      const [teamsRes, challengesRes] = await Promise.all([
        axios.get('/api/admin/teams', { withCredentials: true }),
        axios.get('/api/admin/challenges', { withCredentials: true })
      ]);
      setTeams(teamsRes.data);
      setChallenges(challengesRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await axios.put(`/api/admin/challenges/${editingId}`, formData, { withCredentials: true });
        setSuccess('Challenge updated successfully');
      } else {
        await axios.post('/api/admin/challenges', formData, { withCredentials: true });
        setSuccess('Challenge added successfully');
      }
      setFormData({ name: '', description: '', language: 'C', buggy_code: '', expected_output: '', points: 10 });
      setEditingId(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (challenge) => {
    setFormData(challenge);
    setEditingId(challenge.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this challenge?')) return;
    try {
      await axios.delete(`/api/admin/challenges/${id}`, { withCredentials: true });
      setSuccess('Challenge deleted successfully');
      fetchData();
    } catch (err) {
      setError('Deletion failed');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="p-2 rounded bg-gray-200 dark:bg-gray-700">
            {isDark ? '☀️' : '🌙'}
          </button>
          <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
        </div>
      </header>

      <div className="flex mb-8">
        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-4 py-2 rounded-t-lg ${activeTab === 'challenges' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Challenges
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2 rounded-t-lg ${activeTab === 'teams' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          Teams
        </button>
      </div>

      {activeTab === 'challenges' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4">Manage Challenges</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                name="name"
                placeholder="Challenge Name"
                value={formData.name}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-gray-100"
                required
              />
              <input
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-gray-100"
              />
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="C">C</option>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
              </select>
              <input
                name="points"
                type="number"
                placeholder="Points"
                value={formData.points}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-gray-100"
                required
              />
              <textarea
                name="buggy_code"
                placeholder="Buggy Code"
                value={formData.buggy_code}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-gray-100 md:col-span-2"
                rows="4"
                required
              />
              <textarea
                name="expected_output"
                placeholder="Expected Output"
                value={formData.expected_output}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-gray-100 md:col-span-2"
                rows="2"
                required
              />
              <button
                type="submit"
                className="md:col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              >
                {editingId ? 'Update Challenge' : 'Add Challenge'}
              </button>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Language</th>
                  <th className="px-4 py-2 text-left">Points</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {challenges.map((challenge) => (
                  <tr key={challenge.id} className="border-t border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-2">{challenge.name}</td>
                    <td className="px-4 py-2">{challenge.language}</td>
                    <td className="px-4 py-2">{challenge.points}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(challenge)}
                        className="bg-yellow-600 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(challenge.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === 'teams' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">All Teams</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Team Name</th>
                    <th className="px-4 py-2 text-left">Participants</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team.id} className="border-t border-gray-200 dark:border-gray-600">
                      <td className="px-4 py-2">{team.team_name}</td>
                      <td className="px-4 py-2">{team.participants || 'None'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Admin;
