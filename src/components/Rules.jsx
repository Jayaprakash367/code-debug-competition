import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';

const Rules = () => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Competition Rules</h1>
            <div className="flex items-center space-x-4">
              <button onClick={toggleDarkMode} className="p-2 rounded bg-gray-200 dark:bg-gray-700">
                {isDark ? '☀️' : '🌙'}
              </button>
              <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Back to Home</Link>
            </div>
          </header>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">General Rules</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Teams must register with a unique team name.</li>
                <li>Each team can have multiple participants.</li>
                <li>All submissions must be original work.</li>
                <li>No external help or collaboration between teams is allowed.</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Challenge Guidelines</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Challenges are available in C, C++, Java, and Python.</li>
                <li>You must fix the buggy code to produce the expected output.</li>
                <li>Code execution is limited to 5 seconds per run.</li>
                <li>Submissions are checked automatically against expected output.</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Submission Rules</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Each challenge can be submitted multiple times.</li>
                <li>Only the first correct submission counts for scoring.</li>
                <li>Time taken is recorded from when you start the challenge.</li>
                <li>Points are awarded based on challenge difficulty.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Disqualification</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Attempting to cheat or manipulate the system.</li>
                <li>Sharing solutions with other teams.</li>
                <li>Using unauthorized tools or resources.</li>
                <li>Violating the code execution sandbox rules.</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Rules;
