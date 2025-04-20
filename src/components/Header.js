import React from 'react';
import { motion } from 'framer-motion';

const Header = ({ 
  status, 
  onClearConversation
}) => {
  return (
    <motion.header 
      className="px-2 sm:px-4 py-2 sm:py-3 flex justify-between items-center bg-black/30 backdrop-blur-lg border-b border-white/10 z-20"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <h1 className="text-base sm:text-lg md:text-xl font-bold flex items-center">
          <motion.span 
            className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400"
            initial={{ filter: "blur(0px)" }}
            whileHover={{ filter: "blur(0.5px)" }}
            transition={{ duration: 0.3 }}
          >
            Feel
          </motion.span>
          <motion.span 
            className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-blue-400"
            initial={{ filter: "blur(0px)" }}
            whileHover={{ filter: "blur(0.5px)" }}
            transition={{ duration: 0.3 }}
          >
            Mate
          </motion.span>
          <motion.span 
            className="ml-1 text-sm sm:text-base"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatDelay: 4
            }}
          >
            ✨
          </motion.span>
        </h1>
        <div className="ml-1.5 text-[0.55rem] sm:text-[0.6rem] bg-white/10 px-1 sm:px-1.5 py-0.5 rounded-full backdrop-blur-sm">
          <span className="text-gray-400">AI Voice Assistant</span>
        </div>
      </motion.div>
      
      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          onClick={onClearConversation}
          className="px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 
                    border border-white/10 backdrop-blur-sm transition-all duration-300
                    flex items-center text-[0.65rem] sm:text-xs"
        >
          <span className="mr-0.5">🗑️</span>
          <span className="hidden xs:inline">Reset</span>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header; 