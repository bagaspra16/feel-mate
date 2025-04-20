import { useState, useCallback, useRef } from 'react';
import { convertTextToSpeech } from '../services/ai';

// Periksa apakah akan menggunakan API eksternal atau Web Speech API
const USE_EXTERNAL_API = process.env.REACT_APP_USE_EXTERNAL_TTS === 'true';

const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const audioRef = useRef(null);

  // Get available voices for Web Speech API
  const getVoices = useCallback(() => {
    if (!USE_EXTERNAL_API) {
      const synth = synthRef.current;
      const voicesList = synth.getVoices();
      
      setVoices(voicesList);
      
      // Set default voice (preferably a female voice if available)
      const femaleVoice = voicesList.find(
        voice => voice.name.includes('female') || voice.name.includes('Female')
      );
      setSelectedVoice(femaleVoice || voicesList[0]);
      
      return voicesList;
    }
    return [];
  }, []);

  // Initialize speech synthesis if using Web Speech API
  useState(() => {
    if (!USE_EXTERNAL_API && typeof window !== 'undefined' && window.speechSynthesis) {
      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = getVoices;
      }
      
      getVoices();
    } else if (!USE_EXTERNAL_API) {
      setError('Speech synthesis is not supported in this browser.');
    }
  }, [getVoices]);

  // Speak text using Web Speech API
  const speakWithWebAPI = useCallback((text) => {
    setError(null);
    
    return new Promise((resolve, reject) => {
      try {
        if (!text) {
          resolve();
          return;
        }
        
        // Cancel any ongoing speech
        const synth = synthRef.current;
        synth.cancel();
        
        // Create utterance
        utteranceRef.current = new SpeechSynthesisUtterance(text);
        
        // Set voice
        if (selectedVoice) {
          utteranceRef.current.voice = selectedVoice;
        }
        
        // Configure utterance
        utteranceRef.current.rate = 1.0;
        utteranceRef.current.pitch = 1.0;
        utteranceRef.current.volume = 1.0;
        
        // Add event listeners
        utteranceRef.current.onstart = () => setIsSpeaking(true);
        utteranceRef.current.onend = () => {
          setIsSpeaking(false);
          resolve(); // Resolve promise when speech ends
        };
        utteranceRef.current.onerror = (event) => {
          const errorMsg = event.error || 'Speech synthesis error';
          setError(errorMsg);
          setIsSpeaking(false);
          reject(new Error(errorMsg)); // Reject promise on error
        };
        
        // Speak
        synth.speak(utteranceRef.current);
      } catch (error) {
        const errorMsg = error.message || 'Speech synthesis error';
        setError(errorMsg);
        setIsSpeaking(false);
        console.error('Speech synthesis error:', error);
        reject(new Error(errorMsg)); // Reject promise on error
      }
    });
  }, [selectedVoice]);
  
  // Speak text using external API
  const speakWithExternalAPI = useCallback(async (text) => {
    setError(null);
    
    return new Promise(async (resolve, reject) => {
      try {
        if (!text) {
          resolve();
          return;
        }
        
        // Hentikan audio yang sedang diputar
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        
        setIsSpeaking(true);
        console.log('Starting text-to-speech conversion with external API...');
        
        // Gunakan API eksternal untuk konversi text-to-speech
        try {
          // Tambahkan jeda kecil sebelum memanggil API
          await new Promise(sleep => setTimeout(sleep, 500));
          
          const audioUrl = await convertTextToSpeech(text, 'en-US');
          console.log('Received audio URL from API:', audioUrl);
          
          if (!audioUrl) {
            throw new Error('No audio URL received from API');
          }
          
          // Tambahkan jeda kecil sebelum memuat audio
          await new Promise(sleep => setTimeout(sleep, 500));
          
          // Putar audio
          console.log('Creating audio element with URL:', audioUrl);
          audioRef.current = new Audio(audioUrl);
          
          // Tambahkan event listener
          audioRef.current.onloadeddata = () => {
            console.log('Audio loaded successfully, starting playback');
          };
          
          audioRef.current.onended = () => {
            console.log('Audio playback ended');
            setIsSpeaking(false);
            audioRef.current = null;
            resolve(); // Resolve the promise when audio ends
          };
          
          audioRef.current.onerror = (event) => {
            console.error('Audio playback error:', event);
            const errorMsg = 'Audio playback error: ' + (event.target.error ? event.target.error.message : 'Unknown error');
            setError(errorMsg);
            setIsSpeaking(false);
            reject(new Error(errorMsg)); // Reject the promise on error
          };
          
          // Mulai pemutaran
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Audio playback started successfully');
              })
              .catch(playError => {
                console.error('Error starting audio playback:', playError);
                const errorMsg = 'Error starting audio playback: ' + playError.message;
                setError(errorMsg);
                setIsSpeaking(false);
                reject(new Error(errorMsg)); // Reject the promise on error
              });
          }
        } catch (ttsError) {
          console.error('Error getting audio from TTS API:', ttsError);
          
          // Fallback: gunakan Web Speech API jika TTS API gagal
          if (typeof window !== 'undefined' && window.speechSynthesis) {
            console.log('Falling back to Web Speech API...');
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            // Create utterance
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Add event listeners
            utterance.onstart = () => console.log('Fallback speech started');
            utterance.onend = () => {
              console.log('Fallback speech ended');
              setIsSpeaking(false);
              resolve(); // Resolve the promise when fallback speech ends
            };
            utterance.onerror = (event) => {
              console.error('Fallback speech error:', event);
              const errorMsg = 'Fallback speech error: ' + event.error;
              setError(errorMsg);
              setIsSpeaking(false);
              reject(new Error(errorMsg)); // Reject the promise on error
            };
            
            // Speak
            window.speechSynthesis.speak(utterance);
          } else {
            reject(ttsError); // Re-throw if no fallback available
          }
        }
      } catch (error) {
        const errorMsg = error.message || 'Text-to-speech conversion error';
        setError(errorMsg);
        setIsSpeaking(false);
        console.error('Text-to-speech conversion error:', error);
        reject(new Error(errorMsg)); // Reject the promise on error
      }
    });
  }, []);

  // Pilih metode berdasarkan konfigurasi
  const speak = USE_EXTERNAL_API ? speakWithExternalAPI : speakWithWebAPI;

  // Stop speaking
  const stop = useCallback(() => {
    if (USE_EXTERNAL_API) {
      // Hentikan audio yang sedang diputar
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    } else {
      // Hentikan Web Speech API
      const synth = synthRef.current;
      synth.cancel();
    }
    
    setIsSpeaking(false);
  }, []);

  // Change voice (hanya untuk Web Speech API)
  const changeVoice = useCallback((voice) => {
    if (!USE_EXTERNAL_API) {
      setSelectedVoice(voice);
    }
  }, []);

  return {
    isSpeaking,
    error,
    voices,
    selectedVoice,
    speak,
    stop,
    changeVoice
  };
};

export default useSpeechSynthesis; 