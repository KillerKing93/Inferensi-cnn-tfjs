# PadangFood Classifier

![PadangFood Classifier Banner](<ayam_goreng(30).jpg>)

## Deskripsi

PadangFood Classifier adalah aplikasi berbasis web yang menggunakan Convolutional Neural Network (CNN) untuk mengklasifikasikan masakan tradisional Padang dari Indonesia. Aplikasi ini dibangun dengan TensorFlow.js, sehingga dapat berjalan langsung di browser tanpa memerlukan pemrosesan di sisi server untuk klasifikasi gambar.

## Fitur

- **Klasifikasi Gambar Real-time**: Unggah atau ambil foto makanan Padang dan dapatkan hasil klasifikasi secara instan
- **Integrasi Kamera**: Gunakan kamera perangkat Anda untuk mengambil gambar langsung dari aplikasi
- **Desain Responsif**: Berfungsi dengan baik pada perangkat desktop dan mobile
- **Kemampuan Offline**: Setelah dimuat, model bekerja tanpa koneksi internet
- **Antarmuka Ramah Pengguna**: Desain sederhana dan intuitif untuk semua pengguna

## Kategori Makanan

Model pada aplikasi ini dilatih dari datasets [Padang Cuisine (Indonesian Food Image Dataset)](https://www.kaggle.com/datasets/faldoae/padangfood?utm_source=chatgpt.com)

Model dapat mengidentifikasi jenis makanan Padang berikut:

- Ayam Goreng
- Ayam Pop
- Daging Rendang
- Dendeng Batokok
- Gulai Ikan
- Gulai Tambusu
- Gulai Tunjang
- Telur Balado
- Telur Dadar

## Teknologi yang Digunakan

- **Frontend**: HTML5, CSS3, JavaScript
- **Machine Learning**: TensorFlow.js
- **Komponen UI**: Font Awesome untuk ikon
- **Styling**: CSS kustom dengan prinsip desain responsif

## Struktur Proyek

```
Inferensi-cnn-tfjs/
├── index.html                # File HTML utama
├── style.css                 # Style CSS
├── script.js                 # Fungsionalitas JavaScript
├── class_names.txt           # Daftar kategori makanan
├── tfjs_model/               # Direktori model TensorFlow.js
│   ├── model.json            # Arsitektur model
│   └── weights.bin           # Bobot model
├── LICENSE                   # Dokumen lisensi
└── README.md                 # Dokumentasi proyek
```

## Instalasi & Penggunaan

### Setup Lokal

1. Clone repositori:

   ```bash
   git clone https://github.com/killerking93/Inferensi-cnn-tfjs.git
   cd Inferensi-cnn-tfjs
   ```

2. Jalankan proyek menggunakan server web lokal:

   - Menggunakan Python:

     ```bash
     # Python 3
     python -m http.server

     # Python 2
     python -m SimpleHTTPServer
     ```

   - Menggunakan Node.js:
     ```bash
     npm install -g http-server
     http-server
     ```

3. Buka browser Anda dan navigasi ke `http://localhost:8000` (atau port yang ditampilkan di terminal Anda).

### Demo Online

Kunjungi [demo-link]((https://craftthingy.com/inference-tfjs-cnn/) untuk mencoba aplikasi tanpa instalasi.

## Cara Kerja

1. **Pemuatan Model**: Aplikasi memuat model CNN yang telah dilatih sebelumnya menggunakan TensorFlow.js.
2. **Pemrosesan Gambar**: Gambar yang diunggah atau diambil diproses untuk menyesuaikan dengan persyaratan input model.
3. **Klasifikasi**: Model memproses gambar dan memprediksi kategori makanan yang paling mungkin.
4. **Tampilan Hasil**: Hasil klasifikasi ditampilkan dengan skor kepercayaan dan prediksi alternatif.

## Informasi Model

- **Arsitektur**: Convolutional Neural Network (CNN)
- **Ukuran Input**: Gambar RGB 224×224 piksel
- **Output**: Distribusi probabilitas untuk 9 kategori makanan Padang
- **Performa**: [Masukkan metrik akurasi model jika tersedia]

## Kompatibilitas Browser

- Chrome (direkomendasikan)
- Firefox
- Safari
- Edge
- Opera

## Pengembangan

### Prasyarat

- Pengetahuan dasar HTML, CSS, dan JavaScript
- Pemahaman tentang TensorFlow.js (untuk modifikasi model)

### Memodifikasi Model

Jika Anda ingin menggunakan model Anda sendiri:

1. Latih model Anda menggunakan TensorFlow/Keras
2. Konversi ke format TensorFlow.js menggunakan konverter:
   ```bash
   tensorflowjs_converter --input_format keras path/to/your/model.h5 path/to/output/folder
   ```
3. Ganti file di direktori `tfjs_model` dengan model yang Anda konversi

### Menambahkan Kategori Makanan Baru

1. Perbarui model Anda untuk menyertakan kategori baru
2. Modifikasi file `class_names.txt` untuk menyertakan nama makanan baru
3. Perbarui elemen UI jika diperlukan

## Kontribusi

Kontribusi Anda selalu disambut! Silakan kirimkan Pull Request.

1. Fork repositori
2. Buat branch fitur Anda (`git checkout -b feature/fitur-keren`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur keren'`)
4. Push ke branch (`git push origin feature/fitur-keren`)
5. Buka Pull Request

## Lisensi

Proyek ini dilisensikan di bawah Lisensi Apache Versi 2.0 yang dimodifikasi - lihat file [LICENSE](LICENSE) untuk detail.

## Kontak

- **Pengembang**:Alif Nurhidayat
- **Email**: alifnurhidayatwork@gmail.com
- **GitHub**: [KillerKing93](https://github.com/yourusername)

## Ucapan Terima Kasih

- Terima kasih khusus kepada semua kontributor yang membantu mengembangkan proyek ini
- Terinspirasi dari masakan tradisional Padang Indonesia
- Tim TensorFlow.js untuk dokumentasi dan alat yang sangat baik
