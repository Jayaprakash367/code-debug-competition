import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';

const Terms = () => {
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
            <h1 className="text-3xl font-bold">Terms of Service & Privacy Policy</h1>
            <div className="flex items-center space-x-4">
              <button onClick={toggleDarkMode} className="p-2 rounded bg-gray-200 dark:bg-gray-700">
                {isDark ? '☀️' : '🌙'}
              </button>
              <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Back to Home</Link>
            </div>
          </header>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                By participating in the Code Debugging Competition, you agree to abide by these terms and conditions.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>You must be at least 13 years old to participate.</li>
                <li>All code submissions remain the property of the participants.</li>
                <li>The organizers reserve the right to disqualify any team for violations.</li>
                <li>Participants are responsible for the security of their accounts.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We collect and process personal information in accordance with data protection laws.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Team names and participant information are stored for competition purposes.</li>
                <li>Code submissions and execution data are logged for verification.</li>
                <li>Personal data is not shared with third parties without consent.</li>
                <li>Participants can request deletion of their data after the competition.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Code Execution</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Code is executed in a sandboxed environment for security.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Execution is limited to prevent abuse.</li>
                <li>No network access or file system operations are allowed.</li>
                <li>Timeout limits are enforced to prevent infinite loops.</li>
                <li>All code is deleted after execution.</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
