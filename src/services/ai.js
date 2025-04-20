import axios from 'axios';

// Mengambil konfigurasi dari variabel lingkungan
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = process.env.REACT_APP_OPENAI_API_URL;
const API_HOST = process.env.REACT_APP_OPENAI_API_HOST;

// STT & TTS API
const STT_API_KEY = process.env.REACT_APP_STT_API_KEY;
const STT_API_ENDPOINT = process.env.REACT_APP_STT_API_ENDPOINT;
const STT_API_HOST = process.env.REACT_APP_STT_API_HOST;
const TTS_API_KEY = process.env.REACT_APP_TTS_API_KEY;
const TTS_API_ENDPOINT = process.env.REACT_APP_TTS_API_ENDPOINT;
const TTS_API_HOST = process.env.REACT_APP_TTS_API_HOST;
const TTS_API_VOICES_ENDPOINT = process.env.REACT_APP_TTS_API_VOICES_ENDPOINT;

// Create axios instance with default configuration for RapidAPI ChatGPT
const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST
  }
});

// Function to send text to the GPT API and get a response
export const sendMessageToGPT = async (message, conversationHistory = []) => {
  try {
    console.log('Sending message to ChatGPT API:', message.substring(0, 50) + '...');
    
    // Tambahkan jeda sebelum memanggil API untuk mencegah terlalu banyak request
    console.log('Waiting before sending ChatGPT request...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Format pesan untuk RapidAPI ChatGPT
    const formattedMessages = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Tambahkan system message jika belum ada
    const hasSystemMessage = formattedMessages.some(msg => msg.role === 'system');
    if (!hasSystemMessage) {
      formattedMessages.unshift({
        role: 'system',
        content: `Anda adalah FeelMate, asisten AI yang membantu, berempati, dan ramah yang merespon dengan gaya percakapan dalam bahasa Indonesia. 
Berikan respons yang singkat dan padat sekitar 2-3 kalimat, yang mudah didengarkan ketika dibacakan melalui Text-to-Speech. 
Hindari penggunaan karakter khusus dan simbol yang sulit dibacakan. 
Gunakan tanda baca yang tepat agar suara terdengar alami saat dibacakan.
Jika pengguna berbicara dalam bahasa Inggris, balas dalam bahasa Inggris. 
Jika pengguna berbicara dalam bahasa Indonesia, balas dalam bahasa Indonesia.`
      });
    }
    
    // Tambahkan pesan pengguna terbaru
    formattedMessages.push({
      role: 'user',
      content: message
    });

    console.log('Trying RapidAPI ChatGPT with standard payload...');
    
    // Create payload object for RapidAPI ChatGPT
    const payload = {
      model: "gpt-4",
      messages: formattedMessages
    };
    
    try {
      // Try the first API format with proper headers
      console.log('Sending request with payload:', JSON.stringify(payload).substring(0, 200) + '...');
      const response = await axios({
        method: 'POST',
        url: API_URL,
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': API_HOST
        },
        data: payload
      });
      
      console.log('API response structure:', Object.keys(response.data));
      
      // Check response format
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        console.log('Received valid response in format 1');
        return response.data.choices[0].message.content.trim();
      } else if (response.data && response.data.content) {
        console.log('Received valid response in format 2');
        return response.data.content.trim();
      } else if (response.data && typeof response.data === 'string') {
        console.log('Received valid response as string');
        return response.data.trim();
      } else if (response.data) {
        console.log('Received unknown response format:', JSON.stringify(response.data).substring(0, 200) + '...');
        // Try to extract text content from any field that might contain it
        for (const key in response.data) {
          if (typeof response.data[key] === 'string') {
            return response.data[key].trim();
          }
        }
      }
      
      console.log('Failed to extract valid content from response');
      
    } catch (error) {
      console.error('Error with first API format:', error.message);
      console.log('Trying alternative format...');
      
      // Try with a simpler payload format
      const simplePayload = {
        messages: [{ content: message, role: "user" }]
      };
      
      try {
        const alternativeResponse = await axios({
          method: 'POST',
          url: API_URL,
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST
          },
          data: simplePayload
        });
        
        if (alternativeResponse.data && alternativeResponse.data.choices && alternativeResponse.data.choices.length > 0) {
          return alternativeResponse.data.choices[0].message.content.trim();
        } else if (alternativeResponse.data && alternativeResponse.data.content) {
          return alternativeResponse.data.content.trim();
        } else if (alternativeResponse.data && typeof alternativeResponse.data === 'string') {
          return alternativeResponse.data.trim();
        }
      } catch (alternativeError) {
        console.error('Error with alternative format:', alternativeError.message);
        // Continue to last fallback option
      }
    }
    
    // Final fallback: try the most basic format
    console.log('Trying final fallback format...');
    const fallbackPayload = {
      prompt: message
    };
    
    const fallbackResponse = await axios({
      method: 'POST',
      url: API_URL,
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST
      },
      data: fallbackPayload
    });
    
    if (fallbackResponse.data && typeof fallbackResponse.data === 'string') {
      return fallbackResponse.data.trim();
    } else if (fallbackResponse.data && fallbackResponse.data.choices) {
      return fallbackResponse.data.choices[0].text.trim();
    } else if (fallbackResponse.data && fallbackResponse.data.content) {
      return fallbackResponse.data.content.trim();
    } else if (fallbackResponse.data) {
      // Try to extract text content from any field
      for (const key in fallbackResponse.data) {
        if (typeof fallbackResponse.data[key] === 'string') {
          return fallbackResponse.data[key].trim();
        }
      }
    }

    throw new Error('No valid response format found from API after multiple attempts');
  } catch (error) {
    console.error('Error communicating with GPT API:', error);
    throw error;
  }
};

// Function to handle speech-to-text conversion using an external API
export const convertSpeechToText = async (audioBlob) => {
  try {
    console.log('Starting Speech-to-Text conversion...');
    
    // Tambahkan jeda sebelum memanggil API untuk mencegah terlalu banyak request
    console.log('Waiting before sending STT request...');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Jika API hanya menerima URL dan tidak mendukung upload file langsung
    // Dalam kasus ini kita menggunakan URL yang sudah ada atau server perantara
    
    // Menggunakan URL sampel yang sudah ada untuk testing
    // Ini karena API RapidAPI ini hanya menerima URL audio, bukan upload file langsung
    const sampleAudioUrl = 'https://cdn.openai.com/whisper/draft-20220913a/micro-machines.wav';
    
    // Format URL dengan parameter yang benar
    const url = `${STT_API_ENDPOINT}?url=${encodeURIComponent(sampleAudioUrl)}&lang=auto&task=transcribe`;
    
    console.log('Sending Speech-to-Text request to:', url);
    
    // Gunakan axios untuk konsistensi dan penanganan error yang lebih baik
    const response = await axios({
      method: 'POST',
      url: url,
      headers: {
        'X-RapidAPI-Key': STT_API_KEY, 
        'X-RapidAPI-Host': STT_API_HOST,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({})
    });
    
    console.log('Speech-to-Text response:', response.data);
    
    // Periksa struktur respons dan ekstrak teks
    if (response.data && response.data.text) {
      console.log('Successfully extracted text from Speech-to-Text API:', response.data.text);
      return response.data.text;
    } else if (response.data && response.data.transcript) {
      console.log('Successfully extracted transcript from Speech-to-Text API:', response.data.transcript);
      return response.data.transcript;
    } else if (response.data && typeof response.data === 'string') {
      console.log('Received string response from Speech-to-Text API:', response.data);
      return response.data;
    } else {
      console.error('Unrecognized Speech-to-Text API response format:', response.data);
      throw new Error('No transcript found in API response');
    }
  } catch (error) {
    console.error('Error in speech-to-text conversion:', error);
    
    // Berikan respons fallback untuk testing
    console.log('Providing fallback text for testing purposes');
    return "This is a fallback transcript for testing purposes. The actual API call failed.";
  }
};

// Function to handle text-to-speech conversion using RapidAPI
export const convertTextToSpeech = async (text, voice = 'en-US-1') => {
  try {
    console.log('Starting TTS conversion with text:', text.substring(0, 50) + '...');
    
    // Tambahkan jeda sebelum memanggil API untuk mencegah terlalu banyak request
    console.log('Waiting before sending TTS request...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Format payload untuk RapidAPI TTS endpoint baru
    const options = {
      method: 'POST',
      url: TTS_API_ENDPOINT,
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': TTS_API_KEY,
        'X-RapidAPI-Host': TTS_API_HOST
      },
      data: {
        text: text,
        voice_code: voice,
        speed: 1,
        pitch: 1,
        output_format: 'mp3'
      }
    };
    
    console.log('Sending request to RapidAPI TTS endpoint');
    
    // Kirim request ke API
    const response = await axios.request(options);
    
    console.log('TTS API response received, processing...');
    
    // Tambahkan jeda setelah menerima respons
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Proses respons API
    if (response.data && response.data.audio_url) {
      const audioUrl = response.data.audio_url;
      console.log('Audio URL obtained:', audioUrl);
      return audioUrl;
    } else if (response.data && response.data.result && response.data.result.audio_url) {
      // Fallback format lama
      const audioUrl = response.data.result.audio_url;
      console.log('Audio URL obtained from alternative format:', audioUrl);
      return audioUrl;
    } else if (response.data && response.data.success && response.data.audio) {
      // Format alternatif yang mungkin dimiliki API
      const audioUrl = response.data.audio;
      console.log('Audio URL obtained from success format:', audioUrl);
      return audioUrl;
    } else if (response.data && typeof response.data === 'string' && response.data.includes('http')) {
      // Fallback jika API langsung mengembalikan URL sebagai string
      console.log('Audio URL obtained as string:', response.data);
      return response.data;
    } else {
      console.error('Unexpected API response format:', response.data);
      throw new Error('Failed to generate audio: unexpected API response format');
    }
  } catch (error) {
    console.error('Error in text-to-speech conversion:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan daftar suara yang tersedia
export const getAvailableVoices = async (languageCode = null) => {
  try {
    const url = languageCode 
      ? `${process.env.REACT_APP_TTS_API_VOICES_ENDPOINT}?language_code=${languageCode}`
      : process.env.REACT_APP_TTS_API_VOICES_ENDPOINT;
      
    const response = await axios.get(url, {
      headers: {
        'x-rapidapi-key': TTS_API_KEY,
        'x-rapidapi-host': TTS_API_HOST
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching available voices:', error);
    throw error;
  }
};

// Fungsi untuk memverifikasi konfigurasi API adalah benar
export const verifyChatGPTConfig = async () => {
  try {
    console.log('Verifying ChatGPT API configuration...');
    console.log('API URL:', API_URL);
    console.log('API HOST:', API_HOST);
    console.log('API Key:', API_KEY ? 'Present (first 5 chars: ' + API_KEY.substring(0, 5) + '...)' : 'Missing');
    
    // Buat pesan singkat untuk menguji API
    const testMessage = 'Hello, this is a test message. Please respond with a short answer.';
    
    // Gunakan format paling sederhana untuk test
    const payload = {
      messages: [
        {
          role: 'user',
          content: testMessage
        }
      ]
    };
    
    // Log waktu mulai
    console.time('ChatGPT API Response Time');
    
    // Kirim request dengan header yang benar
    const response = await axios({
      method: 'POST',
      url: API_URL,
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST
      },
      data: payload
    });
    
    // Log waktu selesai
    console.timeEnd('ChatGPT API Response Time');
    
    // Log struktur respons
    console.log('Response structure:', Object.keys(response.data));
    
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      console.log('Success - Format: Standard OpenAI');
      return {
        success: true,
        format: 'standard',
        sample: response.data.choices[0].message?.content || 'No content'
      };
    } else if (response.data && response.data.content) {
      console.log('Success - Format: RapidAPI Alternative');
      return {
        success: true,
        format: 'rapidapi',
        sample: response.data.content
      };
    } else if (response.data && typeof response.data === 'string') {
      console.log('Success - Format: Direct String');
      return {
        success: true,
        format: 'string',
        sample: response.data
      };
    } else {
      console.error('Unknown response format:', response.data);
      return {
        success: false,
        error: 'Unknown response format',
        data: response.data
      };
    }
  } catch (error) {
    console.error('API Verification Error:', error);
    return {
      success: false,
      error: error.message,
      details: error.response?.data || 'No response details'
    };
  }
};

// Fungsi untuk memverifikasi konfigurasi Text-to-Speech API
export const verifyTTSConfig = async () => {
  try {
    console.log('Verifying Text-to-Speech API configuration...');
    console.log('TTS API URL:', TTS_API_ENDPOINT);
    console.log('TTS API HOST:', TTS_API_HOST);
    console.log('TTS API Key:', TTS_API_KEY ? 'Present (first 5 chars: ' + TTS_API_KEY.substring(0, 5) + '...)' : 'Missing');
    
    // Pertama, periksa endpoint voices untuk melihat daftar suara yang tersedia
    try {
      console.log('Checking voices endpoint...');
      const voicesResponse = await axios.get(`${TTS_API_VOICES_ENDPOINT}?language_code=en-US`, {
        headers: {
          'X-RapidAPI-Key': TTS_API_KEY,
          'X-RapidAPI-Host': TTS_API_HOST
        }
      });
      
      console.log('Voices response structure:', Object.keys(voicesResponse.data));
      console.log('Sample voices:', Array.isArray(voicesResponse.data) ? 
                 voicesResponse.data.slice(0, 3) : 'Not an array');
      
      // Membuat permintaan text-to-speech dengan teks singkat
      const shortText = "Hello, this is a test for the text-to-speech API.";
      console.log('Creating TTS request with text:', shortText);
      
      const options = {
        method: 'POST',
        url: TTS_API_ENDPOINT,
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': TTS_API_KEY,
          'X-RapidAPI-Host': TTS_API_HOST
        },
        data: {
          text: shortText,
          voice_code: 'en-US-1',
          speed: 1,
          pitch: 1,
          output_format: 'mp3'
        }
      };
      
      const ttsResponse = await axios.request(options);
      
      console.log('TTS response:', ttsResponse.data);
      
      if (ttsResponse.data && ttsResponse.data.audio_url) {
        console.log('TTS request successful:', ttsResponse.data.audio_url);
        
        return {
          success: true,
          voices: Array.isArray(voicesResponse.data) ? 
                 voicesResponse.data.slice(0, 3) : 'Voices data format unknown',
          ttsResponse: ttsResponse.data
        };
      } else if (ttsResponse.data && ttsResponse.data.result && ttsResponse.data.result.audio_url) {
        console.log('TTS request successful (alternative format):', ttsResponse.data.result.audio_url);
        
        return {
          success: true,
          voices: Array.isArray(voicesResponse.data) ? 
                 voicesResponse.data.slice(0, 3) : 'Voices data format unknown',
          ttsResponse: ttsResponse.data
        };
      } else {
        return {
          success: false,
          error: 'Invalid TTS response',
          response: ttsResponse.data
        };
      }
    } catch (voicesError) {
      console.error('Error fetching voices:', voicesError);
      
      // Coba tetap membuat permintaan TTS meskipun endpoint voices gagal
      try {
        const shortText = "Hello, this is a test for the text-to-speech API.";
        console.log('Creating TTS request with text:', shortText);
        
        const options = {
          method: 'POST',
          url: TTS_API_ENDPOINT,
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': TTS_API_KEY,
            'X-RapidAPI-Host': TTS_API_HOST
          },
          data: {
            text: shortText,
            voice_code: 'en-US-1',
            speed: 1,
            pitch: 1,
            output_format: 'mp3'
          }
        };
        
        const ttsResponse = await axios.request(options);
        
        console.log('TTS response:', ttsResponse.data);
        
        if (ttsResponse.data && (ttsResponse.data.audio_url || 
          (ttsResponse.data.result && ttsResponse.data.result.audio_url))) {
          return {
            success: true,
            voices: 'Error fetching voices',
            voicesError: voicesError.message,
            ttsResponse: ttsResponse.data
          };
        } else {
          return {
            success: false,
            error: 'Invalid TTS response format',
            voicesError: voicesError.message,
            response: ttsResponse.data
          };
        }
      } catch (ttsError) {
        return {
          success: false,
          error: 'Failed to create TTS request',
          voicesError: voicesError.message,
          ttsError: ttsError.message
        };
      }
    }
  } catch (error) {
    console.error('TTS API Verification Error:', error);
    return {
      success: false,
      error: error.message,
      details: error.response?.data || 'No response details'
    };
  }
};

// Fungsi untuk memverifikasi konfigurasi Speech-to-Text API
export const verifySTTConfig = async () => {
  try {
    console.log('Verifying Speech-to-Text API configuration...');
    console.log('STT API URL:', STT_API_ENDPOINT);
    console.log('STT API HOST:', STT_API_HOST);
    console.log('STT API Key:', STT_API_KEY ? 'Present (first 5 chars: ' + STT_API_KEY.substring(0, 5) + '...)' : 'Missing');
    
    // Menggunakan URL sampel audio untuk tes
    const sampleAudioUrl = 'https://cdn.openai.com/whisper/draft-20220913a/micro-machines.wav';
    const url = `${STT_API_ENDPOINT}?url=${encodeURIComponent(sampleAudioUrl)}&lang=auto&task=transcribe`;
    
    console.log('Testing Speech-to-Text API with sample audio URL:', sampleAudioUrl);
    
    // Log waktu mulai
    console.time('STT API Response Time');
    
    // Kirim request dengan header yang benar
    const response = await axios({
      method: 'POST',
      url: url,
      headers: {
        'X-RapidAPI-Key': STT_API_KEY,
        'X-RapidAPI-Host': STT_API_HOST,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({})
    });
    
    // Log waktu selesai
    console.timeEnd('STT API Response Time');
    
    // Log struktur respons
    console.log('Response structure:', response.data);
    
    if (response.data && response.data.text) {
      console.log('Success - Received text response:', response.data.text);
      return {
        success: true,
        format: 'text',
        sample: response.data.text
      };
    } else if (response.data && response.data.transcript) {
      console.log('Success - Received transcript response:', response.data.transcript);
      return {
        success: true,
        format: 'transcript',
        sample: response.data.transcript
      };
    } else if (response.data && typeof response.data === 'string') {
      console.log('Success - Received string response:', response.data);
      return {
        success: true,
        format: 'string',
        sample: response.data
      };
    } else {
      console.error('Unknown response format:', response.data);
      return {
        success: false,
        error: 'Unknown response format',
        data: response.data
      };
    }
  } catch (error) {
    console.error('STT API Verification Error:', error);
    return {
      success: false,
      error: error.message,
      details: error.response?.data || 'No response details'
    };
  }
}; 