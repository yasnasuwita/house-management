# House Management

Aplikasi web sederhana untuk mengelola urusan rumah tangga: keuangan, maintenance rumah/kendaraan, kalender bersama, dan link/dokumen penting. Dibuat dengan Next.js (App Router) agar mudah di-deploy ke Vercel, mobile-first karena kemungkinan besar dibuka dari HP.

## Fitur

- 💰 **Keuangan** — catat pemasukan/pengeluaran, lihat saldo aktif
- 📊 **Laporan Keuangan** — rekap otomatis per bulan & per kategori
- 🔧 **Maintenance** — catatan & reminder servis rumah/kendaraan
- 📅 **Kalender** — agenda bersama & reminder
- 🔗 **Link Penting** — simpan link/dokumen penting
- ⚡ **Tambah Cepat** — satu form ringkas untuk menambah data ke modul mana pun

Akses aplikasi dilindungi PIN bersama (tanpa sistem akun terpisah), dan setiap data bisa ditandai siapa yang input (label bisa diganti, default "Saya" / "Suami").

## Tech Stack

- **Next.js 15 (App Router)** + TypeScript + Tailwind CSS
- **Neon Postgres** (lewat integrasi Vercel Marketplace) sebagai database — driver `@neondatabase/serverless`
- Skema tabel dibuat otomatis saat aplikasi pertama kali diakses (tidak perlu jalankan migrasi manual)

## Deploy ke Vercel — Step by Step

### 1. Push project ini ke GitHub (jika belum)

Import repo ini di [vercel.com/new](https://vercel.com/new). Next.js akan terdeteksi otomatis, tidak perlu ubah konfigurasi build.

### 2. Buat database Postgres (Neon) lewat tab Storage

1. Di dashboard project Vercel, buka tab **Storage**.
2. Klik **Create Database** → pilih **Postgres** (disediakan oleh Neon lewat Vercel Marketplace).
3. Ikuti wizard-nya (pilih region terdekat, misalnya Singapore), lalu **Connect** ke project ini.
4. Vercel otomatis mengisi environment variable `DATABASE_URL` (dan beberapa variabel Postgres lain) ke project — Anda tidak perlu copy-paste apa pun untuk ini.

### 3. Isi environment variable di Vercel Dashboard

Buka **Project Settings → Environment Variables**, lalu tambahkan:

| Nama | Wajib? | Contoh nilai | Keterangan |
|---|---|---|---|
| `DATABASE_URL` | Otomatis terisi | — | Diisi otomatis oleh Vercel saat Anda membuat database di Langkah 2. Tidak perlu diisi manual. |
| `APP_PIN` | **Wajib diisi manual** | `246810` | PIN bersama untuk Anda & suami masuk ke aplikasi. Bebas angka/huruf, semakin panjang semakin aman. |
| `USER1_LABEL` | Opsional | `Saya` | Label pilihan pertama di form input. Default: `Saya`. |
| `USER2_LABEL` | Opsional | `Suami` | Label pilihan kedua di form input. Default: `Suami`. |

Setelah menambahkan `APP_PIN`, klik **Redeploy** (atau deploy ulang otomatis akan terpicu jika Anda baru saja push/import).

### 4. Buka aplikasinya

Akses domain Vercel yang diberikan (mis. `https://house-management-xxxx.vercel.app`) dari HP Anda dan suami. Masukkan `APP_PIN` yang sudah diset, lalu simpan sebagai bookmark/shortcut di home screen HP masing-masing.

Tabel database akan otomatis dibuat saat pertama kali aplikasi mengakses data (tidak ada langkah SQL manual yang perlu dijalankan).

## Development Lokal

```bash
npm install
cp .env.example .env.local   # isi DATABASE_URL & APP_PIN
npm run dev
```

Untuk `DATABASE_URL` saat development lokal, salin nilainya dari Vercel dashboard: **Project → Storage → database Anda → tab `.env.local`**.

## Struktur Singkat

```
app/
  login/            # halaman & aksi login PIN
  keuangan/          # modul keuangan
  laporan/            # laporan keuangan
  maintenance/        # modul maintenance
  kalender/            # modul kalender
  link-penting/        # modul link penting
  tambah-cepat/        # form tambah cepat lintas modul
lib/
  db.ts               # koneksi database + auto-migrasi skema
  queries.ts          # query data untuk semua modul
  auth.ts             # helper PIN & label pengguna
middleware.ts          # proteksi akses PIN untuk seluruh halaman
```
