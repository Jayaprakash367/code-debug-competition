import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { useState } from 'react';

const Landing = () => {
  const { isDark, isAnimating, toggleDarkMode } = useDarkMode();
  const [isHovered, setIsHovered] = useState(false);

  const codeSymbols = ['{', '}', '<', '>', ';', '()', '[]', 'if', 'for', 'function'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 relative overflow-visible px-4">
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleDarkMode}
          className={`bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white p-2 rounded-full backdrop-blur-sm border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 transition-colors ${isAnimating ? 'animate-blink' : ''}`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Modern Abstract Coding Animation Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isDark ? 0.3 : 0.4 }}
        transition={{ duration: 1.5 }}
      >
        <div className="w-full h-full relative">
          {/* Floating Code Elements with Rotation and Scale */}
          {codeSymbols.map((symbol, index) => (
            <motion.div
              key={index}
              className="absolute text-4xl font-mono text-blue-800/80 dark:text-blue-200/90"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${20 + Math.random() * 40}px`,
              }}
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5],
                rotate: [0, 360, 0],
                y: [-20, 20, -20],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: index * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {symbol}
            </motion.div>
          ))}

          {/* Connecting Lines for Code Flow - Transitioning Paths */}
          <svg className="absolute inset-0 w-full h-full opacity-40 dark:opacity-30">
            {Array.from({ length: 5 }, (_, i) => (
              <motion.line
                key={i}
                x1={Math.random() * 100} y1={Math.random() * 100}
                x2={Math.random() * 100} y2={Math.random() * 100}
                stroke="hsl(262, 100%, 20%)"
                strokeWidth="3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: [0, 1, 0],
                  x2: Math.random() * 100,
                  y2: Math.random() * 100,
                }}
                transition={{
                  duration: 4,
                  delay: i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </svg>

          {/* Central Node - Scaling and Pulsing */}
          <motion.div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-purple-800 to-blue-800 rounded-full opacity-50 dark:opacity-40"
            initial={{ scale: 0 }}
            animate={{
              scale: [1, 1.2, 1],
              boxShadow: [
                "0 0 30px rgba(147, 51, 234, 0.7)",
                "0 0 50px rgba(147, 51, 234, 1)",
                "0 0 30px rgba(147, 51, 234, 0.7)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Orbiting Elements */}
          {[0, 1, 2].map((ring, index) => (
            <motion.div
              key={index}
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-800 dark:bg-blue-200 rounded-full"
              style={{
                width: `${10 + index * 15}px`,
                height: `${10 + index * 15}px`,
              }}
              animate={{
                rotate: 360,
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                rotate: { duration: 10 + index * 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto relative z-10"
      >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 pb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.5] bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-300 bg-clip-text text-transparent mb-4">
              Code Debugging
            </h1>
            <h2 className="text-5xl md:text-7xl font-bold leading-[1.5] bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-300 dark:to-indigo-300 bg-clip-text text-transparent">
              Competition
            </h2>
          </motion.div>
        
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl mb-8 text-gray-700 dark:text-gray-300"
        >
          Test your debugging skills and fix the buggy code!
        </motion.p>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-8"
        >
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 text-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Start Competition
          </Link>
        </motion.div>
      </motion.div>
      
    </div>
  );
};

export default Landing;
