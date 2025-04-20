import React from 'react';

const RecordButton = ({ isListening, onStartListening, onStopListening, disabled }) => {
  const handleButtonClick = () => {
    if (disabled) return;
    
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  // Tambahkan kelas tampilan yang berbeda tergantung status
  const getButtonClasses = () => {
    let baseClasses = `
      relative flex items-center justify-center 
      w-14 h-14 sm:w-16 sm:h-16 rounded-full transition-all duration-300
      focus:outline-none shadow-lg
    `;
    
    if (disabled) {
      return `${baseClasses} bg-gray-600 cursor-not-allowed opacity-50`;
    }
    
    if (isListening) {
      return `${baseClasses} bg-red-500 hover:bg-red-600 scale-105`;
    }
    
    return `${baseClasses} bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 pulse-animation`;
  };

  return (
    <button
      className={getButtonClasses()}
      onClick={handleButtonClick}
      disabled={disabled}
      aria-label={isListening ? 'Stop recording' : 'Start recording'}
    >
      {/* Inner circle with microphone icon */}
      <div className={`
        absolute inset-0 flex items-center justify-center 
        w-full h-full rounded-full
        ${isListening ? 'recording-animation' : ''}
      `}>
        <div className="relative z-10">
          {/* Microphone icon */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`w-5 h-5 sm:w-6 sm:h-6 text-white ${isListening ? 'pulse-opacity' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isListening ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
              />
            )}
          </svg>
        </div>
      </div>

      {/* Ripple effect when recording */}
      {isListening && (
        <>
          <span className="absolute inset-0 rounded-full animate-ping-slow bg-red-500 opacity-30"></span>
          <span className="absolute inset-0 rounded-full animate-ping-slower bg-red-500 opacity-20"></span>
        </>
      )}
    </button>
  );
};

export default RecordButton; 