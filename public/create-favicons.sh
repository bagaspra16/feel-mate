#!/bin/bash

# Script untuk mengkonversi favicon.svg ke berbagai format
# Diperlukan: inkscape dan imagemagick

echo "Membuat favicons dari SVG..."

# 1. Konversi SVG ke PNG dengan berbagai ukuran
echo "Mengkonversi SVG ke PNG..."

# Anda bisa menggunakan inkscape atau imagemagick
# Dengan inkscape:
# inkscape -w 16 -h 16 favicon.svg -o favicon-16x16.png
# inkscape -w 32 -h 32 favicon.svg -o favicon-32x32.png
# inkscape -w 192 -h 192 favicon.svg -o android-chrome-192x192.png
# inkscape -w 512 -h 512 favicon.svg -o android-chrome-512x512.png
# inkscape -w 180 -h 180 favicon.svg -o apple-touch-icon.png
# inkscape -w 150 -h 150 favicon.svg -o mstile-150x150.png

# Dengan imagemagick:
convert favicon.svg -resize 16x16 favicon-16x16.png
convert favicon.svg -resize 32x32 favicon-32x32.png
convert favicon.svg -resize 192x192 android-chrome-192x192.png
convert favicon.svg -resize 512x512 android-chrome-512x512.png
convert favicon.svg -resize 180x180 apple-touch-icon.png
convert favicon.svg -resize 150x150 mstile-150x150.png

# 2. Buat favicon.ico (kombinasi dari 16x16, 32x32, 48x48)
echo "Membuat favicon.ico..."
convert favicon-16x16.png favicon-32x32.png favicon.ico

# 3. Buat safari-pinned-tab.svg
echo "Menyalin SVG untuk safari-pinned-tab..."
cp favicon.svg safari-pinned-tab.svg

echo "Favicon telah dibuat! Silakan cek direktori public."
echo "Jangan lupa untuk memperbarui file HTML dan manifests dengan referensi yang benar." 