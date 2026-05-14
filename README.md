# FocusNote Pomodoro

FocusNote Pomodoro adalah aplikasi timer belajar berbasis Pomodoro untuk pelajar/mahasiswa. Aplikasi ini punya timer fokus, musik istirahat, catatan refleksi belajar, riwayat, statistik, badge motivasi, dan penyimpanan lokal lewat browser.

## Fitur Utama

- Timer fokus default 15 menit.
- Mode istirahat setelah sesi fokus selesai.
- Musik istirahat otomatis saat masuk mode break.
- Catatan/refleksi hasil belajar harian.
- Pilihan mata pelajaran dan target belajar.
- Riwayat belajar berdasarkan tanggal.
- Statistik total sesi, total menit, dan streak.
- Badge motivasi.
- Export catatan ke file TXT.
- Tema terang/gelap.
- Data tersimpan di LocalStorage, jadi tidak butuh login.

## Teknologi

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- LocalStorage

## Struktur Folder

```text
src/
  components/
  lib/
  screens/
  services/
  App.tsx
  main.tsx
  types.ts
.github/
  workflows/
    deploy.yml
```

## Cara Menjalankan di Laptop

Pastikan Node.js sudah terpasang.

```bash
npm install
npm run dev
```

Lalu buka alamat yang muncul di terminal, biasanya:

```text
http://localhost:3000
```

## Cara Build Manual

```bash
npm run build
```

Hasil build akan muncul di folder:

```text
dist/
```

Untuk preview hasil build:

```bash
npm run preview
```

## Cara Upload ke GitHub dan Hosting di GitHub Pages

### 1. Buat repository baru di GitHub

Contoh nama repository:

```text
focusnote-pomodoro
```

### 2. Upload project ini ke repository

Kalau pakai terminal:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/focusnote-pomodoro.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub kamu.

### 3. Aktifkan GitHub Pages

Masuk ke repository GitHub:

```text
Settings → Pages → Build and deployment → Source: GitHub Actions
```

Setelah itu buka tab:

```text
Actions
```

Tunggu workflow **Deploy to GitHub Pages** selesai.

### 4. Link hosting

Kalau sukses, aplikasinya biasanya bisa dibuka di:

```text
https://USERNAME.github.io/focusnote-pomodoro/
```

## Catatan Penting

- Project ini adalah aplikasi web React + Vite, jadi hosting paling cocok adalah GitHub Pages, Vercel, atau Netlify.
- Ini bukan project Flutter, jadi belum langsung menghasilkan APK Android.
- Kalau mau jadi APK Android, project web ini bisa dibungkus lagi memakai Capacitor atau TWA.
- Routing sudah memakai `HashRouter`, jadi aman untuk GitHub Pages dan tidak gampang error 404 saat refresh halaman.
- `vite.config.ts` sudah memakai `base: './'` supaya asset CSS/JS tetap kebaca saat di-host di GitHub Pages.

## Build Status

Project sudah dicek dengan:

```bash
npm install
npm run build
```

Build berhasil.
