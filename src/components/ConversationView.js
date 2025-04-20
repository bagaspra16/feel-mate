import React, { useRef, useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import { useConversation } from '../contexts/ConversationContext';
import { motion, AnimatePresence } from 'framer-motion';

const ConversationView = () => {
  const { conversation } = useConversation();
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  // Check scroll position to show/hide scroll-to-bottom button
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 80;
      setShowScrollButton(isScrolledUp);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If no messages, show a welcome message
  if (conversation.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-3 text-center bg-gradient-to-b from-transparent to-black/20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md"
        >
          <div className="text-3xl sm:text-4xl mb-3">👋</div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Selamat Datang di FeelMate
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mb-3">
            Asisten AI yang siap mendengarkan dan berbicara dengan Anda. Klik tombol mikrofon untuk mulai mengobrol!
          </p>
          <div className="p-3 sm:p-4 bg-white/10 rounded-xl backdrop-blur-sm shadow-xl border border-white/10">
            <p className="text-xs sm:text-sm text-gray-200">
              Anda dapat bertanya, berbagi cerita, atau sekadar mengobrol santai. 
              Saya akan mendengarkan dan merespon dengan senang hati.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      ref={scrollContainerRef}
      className="flex flex-col p-2 sm:p-4 overflow-y-auto h-full scrollbar scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800/30 hover:scrollbar-thumb-purple-500"
    >
      <div className="flex-1 pb-2">
        {conversation.map((message, index) => (
          <ChatMessage 
            key={message.id} 
            message={message}
            isLast={index === conversation.length - 1} 
          />
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </div>
      
      {/* Scroll indicator - subtle hint showing scrollable area */}
      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 h-16 w-1 opacity-20 bg-gradient-to-b from-transparent via-purple-400 to-transparent pointer-events-none"></div>
      
      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-24 sm:bottom-28 right-3 sm:right-5 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg z-10 transition-colors duration-200"
            onClick={scrollToBottom}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConversationView; 