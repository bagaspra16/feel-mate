# Petunjuk Membuat Favicon untuk FeelMate

File `favicon.svg` telah dibuat dengan logo aplikasi FeelMate. Untuk menghasilkan semua file favicon yang diperlukan, ikuti langkah-langkah berikut:

## Metode 1: Menggunakan Script

1. Pastikan Anda memiliki `imagemagick` (atau `inkscape`) terinstal di sistem Anda
2. Jalankan script `create-favicons.sh` di direktori public:
   ```bash
   cd public
   chmod +x create-favicons.sh
   ./create-favicons.sh
   ```

## Metode 2: Menggunakan Layanan Online

1. Unggah `favicon.svg` ke layanan seperti [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Ikuti instruksi situs untuk membuat paket favicon
3. Unduh dan ekstrak ke direktori `public/`
4. Perbarui HTML sesuai dengan petunjuk dari situs

## Metode 3: Konversi Manual

Anda dapat mengkonversi file SVG ke format yang diperlukan secara manual:

1. Konversi ke PNG dengan ukuran 16x16, 32x32, 192x192, 512x512
2. Konversi ke favicon.ico (gabungan 16x16, 32x32, 48x48)
3. Buat safari-pinned-tab.svg

## Catatan

File-file favicon yang perlu Anda hasilkan:

- favicon.ico
- favicon-16x16.png
- favicon-32x32.png
- apple-touch-icon.png
- android-chrome-192x192.png
- android-chrome-512x512.png
- safari-pinned-tab.svg
- mstile-150x150.png

Semua referensi ke file-file ini sudah ditambahkan di `index.html`, `manifest.json`, dan file konfigurasi terkait lainnya. 