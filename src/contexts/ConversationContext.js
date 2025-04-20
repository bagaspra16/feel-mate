import React, { createContext, useContext, useState, useCallback } from 'react';
// Mengaktifkan kembali import API GPT
import { sendMessageToGPT } from '../services/ai';

// Create context
const ConversationContext = createContext();

// Context provider component
export const ConversationProvider = ({ children }) => {
  const [conversation, setConversation] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // Flag untuk menandakan apakah API digunakan - diaktifkan secara default
  const [useAPI, setUseAPI] = useState(true);

  // Add a user message to the conversation
  const addUserMessage = useCallback((message) => {
    if (!message.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    
    setConversation(prev => [...prev, userMessage]);
    return userMessage;
  }, []);

  // Add an AI response to the conversation
  const addAIResponse = useCallback((message) => {
    const aiMessage = {
      id: Date.now(),
      role: 'assistant',
      content: message,
      timestamp: new Date().toISOString(),
    };
    
    setConversation(prev => [...prev, aiMessage]);
    return aiMessage;
  }, []);

  // Process a user message and get AI response
  const processMessage = useCallback(async (message) => {
    try {
      if (isProcessing) {
        console.log('Sudah ada permintaan yang sedang diproses, menunggu...');
        return;
      }

      setError(null);
      setIsProcessing(true);
      
      // Add user message to conversation
      const userMessage = addUserMessage(message);
      if (!userMessage) {
        throw new Error('Gagal menambahkan pesan pengguna');
      }
      
      // Jika tidak menggunakan API, kembalikan input pengguna sebagai echo
      if (!useAPI) {
        console.log('API dinonaktifkan, hanya menampilkan input pengguna:', message);
        
        // Echo response (untuk testing tanpa API)
        const echoResponse = `[API dinonaktifkan] Saya menerima input suara Anda: "${message}"`;
        
        // Add echo response to conversation
        const aiMessage = addAIResponse(echoResponse);
        if (!aiMessage) {
          throw new Error('Gagal menambahkan respons echo');
        }
        
        return echoResponse;
      }
      
      // Kode untuk API GPT diaktifkan kembali
      // Format conversation history for API
      const conversationHistory = conversation.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Send message to AI - hanya gunakan history terakhir untuk mencegah error token yang terlalu panjang
      // RapidAPI mungkin memiliki batas konteks yang lebih kecil
      const maxHistoryItems = 6; // Batasi jumlah item sejarah percakapan
      const limitedHistory = conversationHistory.slice(-maxHistoryItems);
      
      // Tentukan waktu maksimum untuk menunggu respons (timeout)
      const timeout = 30000; // 30 detik
      
      // Buat promise race antara request API dan timeout
      let response;
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Waktu permintaan habis setelah 30 detik')), timeout)
        );
        
        console.log('Mengirimkan permintaan ke ChatGPT API...');
        // Send message to AI
        response = await Promise.race([
          sendMessageToGPT(message, limitedHistory),
          timeoutPromise
        ]);
        console.log('Respons diterima dari ChatGPT API:', response.substring(0, 100) + '...');
      } catch (apiError) {
        console.error('Error dalam permintaan API:', apiError);
        // Coba sekali lagi dengan konteks kosong jika terjadi kesalahan
        console.log('Mencoba kembali tanpa konteks percakapan...');
        response = await sendMessageToGPT(message, []);
      }
      
      // Pastikan respons adalah string yang valid
      if (!response || typeof response !== 'string') {
        console.error('Respons tidak valid:', response);
        response = 'Maaf, saya tidak dapat memproses permintaan Anda saat ini. Silakan coba lagi nanti.';
      }
      
      // Add AI response to conversation
      const aiMessage = addAIResponse(response);
      if (!aiMessage) {
        throw new Error('Gagal menambahkan respons AI');
      }
      
      return response;
      
    } catch (err) {
      const errorMessage = err.message || 'Gagal mendapatkan respons';
      console.error('Error dalam memproses pesan:', err);
      
      // Tambahkan pesan error sebagai respons AI dalam percakapan
      const fallbackResponse = 'Maaf, terjadi kesalahan: ' + errorMessage + '. Silakan coba lagi.';
      addAIResponse(fallbackResponse);
      
      setError(errorMessage);
      return fallbackResponse;
    } finally {
      setIsProcessing(false);
    }
  }, [conversation, addUserMessage, addAIResponse, isProcessing, useAPI]);

  // Toggle API usage
  const toggleAPIUsage = useCallback(() => {
    setUseAPI(prev => !prev);
    console.log(`API ${!useAPI ? 'diaktifkan' : 'dinonaktifkan'}`);
  }, [useAPI]);

  // Clear conversation history
  const clearConversation = useCallback(() => {
    setConversation([]);
    setError(null);
  }, []);

  // Context value
  const value = {
    conversation,
    isProcessing,
    error,
    useAPI,
    addUserMessage,
    addAIResponse,
    processMessage,
    clearConversation,
    toggleAPIUsage
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};

// Custom hook to use the conversation context
export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};

export default ConversationContext; 