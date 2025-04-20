import React from 'react';
import { FaUser, FaRobot } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ChatMessage = ({ message, isLast }) => {
  const isUser = message.role === 'user';
  
  // Format timestamp
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={`flex mb-3 ${isUser ? 'justify-end' : 'justify-start'} w-full`}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.25 }}
    >
      <div
        className={`flex max-w-[92%] xs:max-w-[85%] md:max-w-[75%] ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tl-lg rounded-bl-lg rounded-tr-lg'
            : 'bg-gradient-to-br from-gray-800/80 to-gray-900/90 text-white backdrop-blur-md rounded-tr-lg rounded-br-lg rounded-tl-lg'
        } p-2 shadow-md border ${isUser ? 'border-blue-500/30' : 'border-purple-500/20'} hover:shadow-lg transition-shadow duration-200`}
      >
        <div className={`flex-shrink-0 ${isUser ? 'order-last ml-1.5' : 'mr-1.5'}`}>
          {isUser ? (
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-400/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-blue-400/30">
              <FaUser className="text-blue-300 text-[0.6rem] sm:text-xs" />
            </div>
          ) : (
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-500/20 backdrop-blur-sm flex items-center justify-center shadow-inner border border-purple-400/30">
              <FaRobot className="text-purple-300 text-[0.6rem] sm:text-xs" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="mb-0.5 text-[0.6rem] font-medium text-opacity-70 flex justify-between">
            <span>{isUser ? 'Anda' : 'FeelMate'}</span>
            <span className="opacity-50 ml-2">{formattedTime}</span>
          </div>
          <p className="text-xs leading-normal whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage; 