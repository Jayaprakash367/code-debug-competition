import { motion } from 'framer-motion';
import { useEffect } from 'react';

const SuccessModal = ({ challenge, timeTaken, points, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-green-400 to-green-600 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        
        <h2 className="text-3xl font-bold text-white mb-2">Challenge Complete!</h2>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white bg-opacity-20 p-4 rounded-lg mb-4"
        >
          <p className="text-white text-lg font-semibold mb-2">{challenge.name}</p>
          <div className="text-white space-y-1">
            <p>⏱️ Time Taken: <span className="font-bold">{timeTaken}s</span></p>
            <p>⭐ Points Earned: <span className="font-bold">+{points}</span></p>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="bg-white text-green-600 px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-all"
        >
          Continue to Dashboard
        </motion.button>

        <p className="text-white text-sm mt-4 opacity-75">Redirecting in 3 seconds...</p>
      </motion.div>
    </div>
  );
};

export default SuccessModal;
