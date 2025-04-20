import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './Header';
import ConversationView from './ConversationView';
import RecordButton from './RecordButton';
import AudioWave from './AudioWave';
import { useConversation } from '../contexts/ConversationContext';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useSpeechSynthesis from '../hooks/useSpeechSynthesis';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceChat = () => {
  // Status for the UI
  const [status, setStatus] = useState('idle');
  
  // Custom hooks
  const { processMessage, clearConversation, useAPI, toggleAPIUsage } = useConversation();
  const { transcript, isListening, isProcessing: isProcessingSpeech, error: speechError, startListening, stopListening } = useSpeechRecognition();
  const { speak, isSpeaking, stop: stopSpeaking, error: synthesisError } = useSpeechSynthesis();

  // Tambahkan flag untuk mencegah pengiriman request berulang
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  const lastProcessedTranscript = useRef('');
  const [useTTS, setUseTTS] = useState(true);

  // Fungsi untuk toggle Text-to-Speech
  const toggleTTS = useCallback(() => {
    setUseTTS(prev => !prev);
    console.log(`Text-to-Speech ${!useTTS ? 'diaktifkan' : 'dinonaktifkan'}`);
  }, [useTTS]);

  // When transcript changes, update UI and process API results
  useEffect(() => {
    // Cek jika ada transcript dan belum diproses
    if (transcript && transcript.trim() !== '' && 
        !isProcessingRequest && 
        lastProcessedTranscript.current !== transcript &&
        // Hanya proses jika pengguna telah selesai berbicara atau jika menggunakan API eksternal
        (!isListening && !isProcessingSpeech)) {
      
      // Pastikan transcript cukup panjang untuk diproses (minimal 2 kata)
      const words = transcript.trim().split(/\s+/);
      if (words.length < 2) {
        return;
      }
      
      setStatus('processing');
      setIsProcessingRequest(true);
      lastProcessedTranscript.current = transcript;
      
      // Proses async tanpa API atau dengan API tergantung setting
      (async () => {
        try {
          // Berikan jeda singkat sebelum memproses
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Proses pesan dan dapatkan respons
          const response = await processMessage(transcript);
          
          // Tambahkan jeda sebelum menggunakan TTS
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Jika TTS diaktifkan, gunakan Text-to-Speech API
          if (useTTS) {
            try {
              await speak(response);
            } catch (ttsError) {
              console.error('Gagal mengonversi teks ke audio:', ttsError);
            }
          }
        } catch (error) {
          console.error('Error dalam pemrosesan:', error);
          setStatus('error');
        } finally {
          // Reset flag processing ketika semua proses selesai
          setTimeout(() => {
            setIsProcessingRequest(false);
            if (!isSpeaking) {
              setStatus('idle');
            }
          }, 500);
        }
      })();
    }
  }, [transcript, isListening, isProcessingSpeech, processMessage, speak, isProcessingRequest, isSpeaking, useTTS]);

  // When errors occur, update status
  useEffect(() => {
    if (speechError || synthesisError) {
      setStatus('error');
      setIsProcessingRequest(false); // Reset flag jika terjadi error
      console.error('Error:', speechError || synthesisError);
    }
  }, [speechError, synthesisError]);

  // Update status based on current state
  useEffect(() => {
    if (isListening) {
      setStatus('listening');
    } else if (isProcessingSpeech) {
      setStatus('processing');
    } else if (isSpeaking) {
      setStatus('speaking');
    } else if (!isProcessingRequest) {
      setStatus('idle');
    }
  }, [isListening, isSpeaking, isProcessingSpeech, isProcessingRequest]);

  // Handle starting the listening process
  const handleStartListening = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
    }
    
    // Reset flags dan state
    setIsProcessingRequest(false);
    lastProcessedTranscript.current = '';
    
    startListening();
  }, [isSpeaking, stopSpeaking, startListening]);

  // Handle processing the transcript after stopping recording
  const handleStopListening = useCallback(async () => {
    stopListening();
    setStatus('processing');
    
    // Berikan jeda singkat agar proses transkripsi selesai
    setTimeout(() => {
      if (!transcript || transcript.trim() === '') {
        setStatus('idle');
        setIsProcessingRequest(false);
      }
    }, 2000);
  }, [stopListening, transcript]);

  // Handle clearing the conversation
  const handleClearConversation = useCallback(() => {
    clearConversation();
    if (isListening) {
      stopListening();
    }
    if (isSpeaking) {
      stopSpeaking();
    }
    setStatus('idle');
  }, [clearConversation, isListening, stopListening, isSpeaking, stopSpeaking]);

  // Status text based on current status
  const getStatusText = () => {
    switch (status) {
      case 'listening':
        return 'Mendengarkan...';
      case 'processing':
        return 'Memproses...';
      case 'speaking':
        return 'Berbicara...';
      case 'error':
        return 'Terjadi kesalahan';
      default:
        return 'Tekan tombol untuk berbicara';
    }
  };

  // Status color based on current status
  const getStatusColor = () => {
    switch (status) {
      case 'listening':
        return 'text-green-400';
      case 'speaking':
        return 'text-blue-400'; 
      case 'processing':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-purple-300';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/20 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-48 sm:w-64 h-48 sm:h-64 bg-indigo-600/20 rounded-full filter blur-3xl"></div>
      </div>
      
      <Header 
        status={status} 
        onClearConversation={handleClearConversation}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Conversation view */}
        <div className="flex-1 overflow-hidden relative">
          <ConversationView />
        </div>
        
        {/* Control panel */}
        <motion.div 
          className="p-3 sm:p-4 flex flex-col items-center justify-center bg-black/40 backdrop-blur-lg border-t border-white/10 shadow-2xl"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Status indicator */}
          <div className="mb-2 text-center">
            <div className={`text-xs sm:text-sm font-medium ${getStatusColor()} transition-colors duration-300`}>
              {getStatusText()}
            </div>
          </div>
          
          {/* Audio visualization wave */}
          <div className="mb-3 sm:mb-4 w-full max-w-md">
            <AudioWave 
              isActive={isListening || isSpeaking} 
              type={isListening ? 'listening' : 'speaking'} 
            />
          </div>
          
          {/* Record button */}
          <div className="mb-2 sm:mb-3 transform transition-transform hover:scale-105">
            <RecordButton 
              isListening={isListening}
              onStartListening={handleStartListening}
              onStopListening={handleStopListening}
              disabled={status === 'processing' || status === 'error'}
            />
          </div>
          
          {/* Transcript display with animation */}
          <AnimatePresence>
            {isListening && transcript && (
              <motion.div 
                className="mt-2 p-2 sm:p-3 bg-white/10 backdrop-blur-md rounded-lg max-w-xl w-full text-center 
                          shadow-lg border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xs sm:text-sm text-gray-200 font-light">{transcript}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default VoiceChat; 