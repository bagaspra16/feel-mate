# FeelMate - AI Voice Assistant

<div align="center">  
  <h3>Asisten Suara AI dengan Antarmuka Modern</h3>
</div>

## 📝 Deskripsi

FeelMate adalah aplikasi asisten suara AI yang menggabungkan teknologi Speech-to-Text, AI Conversation, dan Text-to-Speech dalam satu pengalaman yang mulus. Dibangun dengan React dan didesain dengan antarmuka yang modern dan responsif, FeelMate memungkinkan pengguna untuk berbicara dengan AI dan mendapatkan respon baik dalam bentuk teks maupun suara.

## ✨ Fitur

- **Antarmuka Responsif** - Tampilan yang optimal di perangkat desktop maupun mobile
- **Konversi Suara ke Teks** - Rekam suara dan konversikan menjadi teks secara real-time
- **AI Chat** - Berinteraksi dengan model AI untuk mendapatkan respons yang cerdas
- **Konversi Teks ke Suara** - Dengarkan respons AI dengan suara yang alami
- **Riwayat Percakapan** - Lihat dan scroll riwayat percakapan dengan mudah
- **Visualisasi Audio** - Efek visual menarik yang merespons aktivitas suara
- **Animasi Modern** - Transisi dan animasi halus menggunakan Framer Motion

## 🛠️ Teknologi

- [React](https://reactjs.org/) - Library JavaScript untuk membangun UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS untuk styling
- [Framer Motion](https://www.framer.com/motion/) - Library untuk animasi
- [RapidAPI](https://rapidapi.com/) - Marketplace API untuk AI, STT, dan TTS
- [Axios](https://axios-http.com/) - HTTP Client untuk permintaan API

## 🚀 Instalasi

### Prasyarat

- Node.js (versi 14.x atau lebih baru)
- npm atau yarn

### Langkah-langkah

1. **Clone repository**
   ```bash
   git clone https://github.com/bagaspra16/feel-mate.git
   cd feel-mate
   ```

2. **Instal dependensi**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Siapkan variabel lingkungan**
   - Salin file `.env.example` menjadi `.env`
   - Isi variabel dengan API keys Anda (lihat bagian Konfigurasi)

4. **Jalankan aplikasi dalam mode development**
   ```bash
   npm start
   # atau
   yarn start
   ```

5. **Build untuk production**
   ```bash
   npm run build
   # atau
   yarn build
   ```

## ⚙️ Konfigurasi

Buat file `.env` di root project dengan variabel-variabel berikut:

```
# OpenAI/ChatGPT API
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_OPENAI_API_URL=your_openai_api_endpoint_here
REACT_APP_OPENAI_API_HOST=your_openai_api_host_here

# Speech-to-Text API
REACT_APP_STT_API_KEY=your_stt_api_key_here
REACT_APP_STT_API_ENDPOINT=your_stt_api_endpoint_here
REACT_APP_STT_API_HOST=your_stt_api_host_here

# Text-to-Speech API
REACT_APP_TTS_API_KEY=your_tts_api_key_here
REACT_APP_TTS_API_ENDPOINT=your_tts_api_endpoint_here
REACT_APP_TTS_API_HOST=your_tts_api_host_here
REACT_APP_TTS_API_VOICES_ENDPOINT=your_tts_api_voices_endpoint_here
REACT_APP_TTS_API_LANGUAGES_ENDPOINT=your_tts_api_languages_endpoint_here

# Konfigurasi API
REACT_APP_USE_EXTERNAL_STT=false
REACT_APP_USE_EXTERNAL_TTS=true
```

## 📱 Penggunaan

1. Buka aplikasi di browser
2. Klik tombol mikrofon untuk mulai merekam suara
3. Bicara dengan jelas ke mikrofon
4. Klik tombol stop untuk mengakhiri rekaman
5. Tunggu AI memproses dan memberikan respons
6. Dengarkan respons audio atau baca teks respons
7. Gunakan tombol scroll untuk melihat riwayat percakapan
8. Klik tombol "Hapus Percakapan" untuk memulai percakapan baru

## 👨‍💻 Pengembang

- [bagaspra16](https://bagaspra16-portfolio.vercel.app/)

---

<div align="center">
  <sub>Dibuat dengan ❤️ untuk keperluan demonstrasi teknologi AI</sub>
</div>