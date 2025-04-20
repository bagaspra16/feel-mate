#!/bin/bash

# Script untuk membuat file favicon sementara berbasis SVG dengan base64
echo "Membuat favicons placeholder dari base64 SVG..."

# SVG favicon dalam format base64
SVG_BASE64="PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHJ4PSIxMjgiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcikiIC8+CiAgCiAgPCEtLSBNaWNyb3Bob25lIEljb24gLS0+CiAgPHBhdGggZD0iTTI1NiAzNTJDMzAwLjgxNiAzNTIgMzM3IDMxNS44MTYgMzM3IDI3MVYxNjBDMzM3IDExNS4xODQgMzAwLjgxNiA3OSAyNTYgNzlDMjExLjE4NCA3OSAxNzUgMTE1LjE4NCAxNzUgMTYwVjI3MUMxNzUgMzE1LjgxNiAyMTEuMTg0IDM1MiAyNTYgMzUyWiIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwLjg1IiAvPgogIAogIDwhLS0gU291bmQgV2F2ZXMgLS0+CiAgPHBhdGggZD0iTTM2OCAyMTJWMjcwQzM2OCAzMzUuNzY4IDMxNC43NjggMzg5IDI0OSAzODlDMTgzLjIzMiAzODkgMTMwIDMzNS43NjggMTMwIDI3MFYyMTJIMTA2VjI3MEMxMDYgMzQ2LjIxNSAxNjQuMDY2IDQwOC41OTkgMjM5IDQxNC42NTlWNDY0SDIwNkMxOTcuMTYzIDQ2NCAxOTAgNDcxLjE2MyAxOTAgNDgwSDMwOEMzMDggNDcxLjE2MyAzMDAuODM3IDQ2NCAyOTIgNDY0SDI3M1Y0MTQuNjU5QzM0Ny45MzQgNDA4LjU5OSA0MDYgMzQ2LjIxNSA0MDYgMjcwVjIxMkgzNjhaIiBmaWxsPSIjRkZGRkZGIiAvPgogIAogIDwhLS0gSW5uZXIgUHVsc2UgQ2lyY2xlcyAtLT4KICA8Y2lyY2xlIGN4PSIyNTYiIGN5PSIyNTYiIHI9IjcwIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS1vcGFjaXR5PSIwLjQiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWRhc2hhcnJheT0iMjAgMTUiIC8+CiAgPGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSIxMjAiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLW9wYWNpdHk9IjAuMjUiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWRhc2hhcnJheT0iMTUgMjAiIC8+CiAgCiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXIiIHgxPSIwIiB5MT0iMCIgeDI9IjUxMiIgeTI9IjUxMiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjNEY0NkU1IiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3QzNBRUQiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KPC9zdmc+"

# Buat file favicon.ico (kosong, diganti saat build)
echo "Membuat favicon.ico placeholder..."
echo -n > favicon.ico

# Buat file PNG placeholder
echo "Membuat PNG placeholders..."
echo "SVG_BASE64=\"$SVG_BASE64\"" > favicon-generator.html
cat <<EOF >> favicon-generator.html
<!DOCTYPE html>
<html>
<head>
  <title>FeelMate Favicon Generator</title>
</head>
<body>
  <h1>FeelMate Favicon Generator</h1>
  <p>Gambar SVG dibawah ini perlu dikonversi ke PNG dengan ukuran sesuai kebutuhan:</p>
  <img src="data:image/svg+xml;base64,\${SVG_BASE64}" width="512" height="512" alt="FeelMate Logo">
  <p>Gunakan browser "Save Image As" untuk menyimpan gambar ini, atau gunakan online converter.</p>
  <p>File yang diperlukan:</p>
  <ul>
    <li>favicon-16x16.png</li>
    <li>favicon-32x32.png</li>
    <li>android-chrome-192x192.png (logo192.png)</li>
    <li>android-chrome-512x512.png (logo512.png)</li>
    <li>apple-touch-icon.png</li>
    <li>mstile-150x150.png</li>
  </ul>
</body>
</html>
EOF

echo "File favicon-generator.html telah dibuat. Buka file tersebut di browser untuk mengekstrak dan mengkonversi SVG menjadi format gambar yang diperlukan."
echo "CATATAN: Script ini hanya membuat file placeholder. Untuk icon yang sesungguhnya, gunakan script create-favicons.sh atau layanan online seperti realfavicongenerator.net" 