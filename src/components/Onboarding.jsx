import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { useState } from 'react';

const Onboarding = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleProceed = () => {
    if (!acceptedRules || !acceptedTerms) {
      setError('Please accept both the Rules and Terms & Privacy Policy to proceed.');
      return;
    }
    // Store acceptance in localStorage
    localStorage.setItem('acceptedRules', 'true');
    localStorage.setItem('acceptedTerms', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Competition Onboarding</h1>
            <div className="flex items-center space-x-4">
              <button onClick={toggleDarkMode} className="p-2 rounded bg-gray-200 dark:bg-gray-700">
                {isDark ? '☀️' : '🌙'}
              </button>
              <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Back to Home</Link>
            </div>
          </header>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Competition Rules</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div>
                  <h3 className="text-xl font-medium mb-2">General Rules</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Teams must register with a unique team name.</li>
                    <li>Each team can have multiple participants.</li>
                    <li>All submissions must be original work.</li>
                    <li>No external help or collaboration between teams is allowed.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Challenge Guidelines</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Challenges are available in C, C++, Java, and Python.</li>
                    <li>You must fix the buggy code to produce the expected output.</li>
                    <li>Code execution is limited to 5 seconds per run.</li>
                    <li>Submissions are checked automatically against expected output.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Submission Rules</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Each challenge can be submitted multiple times.</li>
                    <li>Only the first correct submission counts for scoring.</li>
                    <li>Time taken is recorded from when you start the challenge.</li>
                    <li>Points are awarded based on challenge difficulty.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Disqualification</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Attempting to cheat or manipulate the system.</li>
                    <li>Sharing solutions with other teams.</li>
                    <li>Using unauthorized tools or resources.</li>
                    <li>Violating the code execution sandbox rules.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Terms of Service & Privacy Policy</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div>
                  <h3 className="text-xl font-medium mb-2">Terms of Service</h3>
                  <p className="mb-2">By participating in the Code Debugging Competition, you agree to abide by these terms and conditions.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>You must be at least 13 years old to participate.</li>
                    <li>All code submissions remain the property of the participants.</li>
                    <li>The organizers reserve the right to disqualify any team for violations.</li>
                    <li>Participants are responsible for the security of their accounts.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Privacy Policy</h3>
                  <p className="mb-2">We collect and process personal information in accordance with data protection laws.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Team names and participant information are stored for competition purposes.</li>
                    <li>Code submissions and execution data are logged for verification.</li>
                    <li>Personal data is not shared with third parties without consent.</li>
                    <li>Participants can request deletion of their data after the competition.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Code Execution</h3>
                  <p className="mb-2">Code is executed in a sandboxed environment for security.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Execution is limited to prevent abuse.</li>
                    <li>No network access or file system operations are allowed.</li>
                    <li>Timeout limits are enforced to prevent infinite loops.</li>
                    <li>All code is deleted after execution.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Acceptance</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rules"
                    checked={acceptedRules}
                    onChange={(e) => setAcceptedRules(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="rules" className="text-gray-700 dark:text-gray-300">
                    I have read and accept the Competition Rules.
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                    I have read and accept the Terms of Service & Privacy Policy.
                  </label>
                </div>
              </div>
              {error && <p className="text-red-500 mt-4">{error}</p>}
              <button
                onClick={handleProceed}
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Proceed to Competition
              </button>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
