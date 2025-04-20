import { useState, useEffect, useCallback, useRef } from 'react';
// Menonaktifkan import konversi via API
// import { convertSpeechToText } from '../services/ai';

// Selalu gunakan Web Speech API, abaikan konfigurasi
// const USE_EXTERNAL_API = process.env.REACT_APP_USE_EXTERNAL_STT === 'true';
const USE_EXTERNAL_API = false;

const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const finalTranscriptRef = useRef('');

  // Fungsi untuk menghentikan rekaman
  const stopListening = useCallback(() => {
    // Hentikan Web Speech API jika sedang digunakan
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      // Jangan set recognitionRef.current = null sehingga kita bisa mengaksesnya setelah stop
    }
    
    // Hentikan Media Recorder jika menggunakan API eksternal
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    setIsListening(false);
    
    // Jika menggunakan Web Speech API, proses transkripsi memerlukan waktu
    // Set isProcessing ke true untuk menunjukkan bahwa proses sedang berlangsung
    if (!USE_EXTERNAL_API) {
      setIsProcessing(true);
      
      // Perkenalkan jeda kecil agar recognitionRef sempat memproses finish event
      setTimeout(() => {
        // Gunakan transkripsi terakhir yang telah dikumpulkan
        setTranscript(finalTranscriptRef.current);
        setIsProcessing(false);
        
        console.log('Final transcript:', finalTranscriptRef.current);
      }, 1000);
    }
  }, []);
  
  // Fungsi untuk memulai rekaman dengan Web Speech API (browser)
  const startListeningWithWebAPI = useCallback(() => {
    setTranscript('');
    setError(null);
    finalTranscriptRef.current = '';
    
    try {
      // Periksa apakah SpeechRecognition tersedia
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition;
      
      if (!SpeechRecognition) {
        throw new Error('Speech recognition tidak didukung di browser ini.');
      }

      // Inisialisasi speech recognition
      recognitionRef.current = new SpeechRecognition();
      
      // Konfigurasi speech recognition
      recognitionRef.current.continuous = true;       // Rekam terus menerus
      recognitionRef.current.interimResults = true;   // Menampilkan hasil sementara
      
      // Coba bahasa Indonesia dan Inggris
      try {
        // Prioritaskan bahasa yang diinginkan
        const selectedLanguage = 'id-ID';  // Bahasa Indonesia
        
        // Alternatif bahasa jika utama tidak tersedia
        const alternativeLanguages = ['id', 'id-ID', 'en-US', 'en-GB', 'en'];
        
        try {
          recognitionRef.current.lang = selectedLanguage;
          console.log(`Menggunakan bahasa: ${selectedLanguage}`);
        } catch (langError) {
          console.warn(`Bahasa ${selectedLanguage} tidak didukung, mencoba alternatif...`, langError);
          
          // Coba bahasa alternatif
          for (const lang of alternativeLanguages) {
            try {
              recognitionRef.current.lang = lang;
              console.log(`Menggunakan bahasa alternatif: ${lang}`);
              break;
            } catch (altLangError) {
              console.warn(`Bahasa ${lang} tidak didukung`, altLangError);
            }
          }
        }
      } catch (langError) {
        console.warn('Mengatur bahasa gagal, menggunakan default browser:', langError);
      }
      
      recognitionRef.current.maxAlternatives = 1;     // Jumlah alternatif teks yang mungkin
      
      // Handler untuk hasil transkripsi
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        
        // Iterasi hasil transkripsi
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          
          if (result.isFinal) {
            finalTranscriptRef.current += transcript + ' ';
            console.log('Transkripsi final ditambahkan:', transcript);
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Tampilkan hasil sementara dan hasil final
        const displayText = finalTranscriptRef.current + interimTranscript;
        console.log('Display transcript:', displayText);
        setTranscript(displayText);
      };

      // Handler saat proses transkripsi selesai
      recognitionRef.current.onend = () => {
        console.log('Sesi pengenalan suara berakhir, status listening:', isListening);
        
        // Jika masih dalam mode listening, mulai lagi rekaman
        if (isListening) {
          try {
            console.log('Memulai ulang pengenalan suara...');
            recognitionRef.current.start();
          } catch (restartError) {
            console.error('Gagal memulai ulang pengenalan suara:', restartError);
            setIsListening(false);
          }
        }
      };

      // Handler untuk error
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(event.error);
        
        // Jika error adalah no-speech, jangan hentikan listening
        if (event.error !== 'no-speech') {
          stopListening();
        }
      };

      // Mulai rekaman
      console.log('Memulai pengenalan suara...');
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      setError(error.message);
      console.error('Speech recognition error:', error);
    }
  }, [isListening, stopListening]);
  
  // Nonaktifkan API eksternal, selalu gunakan Web Speech API
  const startListening = startListeningWithWebAPI;

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return {
    transcript,
    isListening,
    isProcessing,
    error,
    startListening,
    stopListening,
  };
};

export default useSpeechRecognition; 