import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Disqualified = ({ reason }) => {
  const { authenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 dark:bg-red-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center text-red-800 dark:text-red-200"
      >
        <h1 className="text-4xl font-bold mb-4">Disqualified</h1>
        <p className="text-xl mb-4">Your team has been disqualified from the competition.</p>
        {reason && <p className="text-lg mb-8 italic">Reason: {reason}</p>}
        {authenticated ? (
          <Link
            to="/dashboard"
            className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-red-700 transition-colors"
          >
            Return to Dashboard
          </Link>
        ) : (
          <Link
            to="/"
            className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-red-700 transition-colors"
          >
            Return to Home
          </Link>
        )}
      </motion.div>
    </div>
  );
};

export default Disqualified;
