// /src/theme.js
"use client";

import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Buat instance tema dengan palet warna baru
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4682A9',   // Biru laut sebagai warna utama
      light: '#749BC2',  // Varian biru lebih terang
      dark: '#325f7a',   // Varian biru lebih gelap (tambahan)
      contrastText: '#FFFBDE', // Teks di atas warna primary (putih)
    },
    secondary: {
      main: '#749BC2',   // Biru yang lebih lembut sebagai warna aksen
      contrastText: '#FFFBDE',
    },
    background: {
      default: '#FFFBDE', // Kuning gading/pasir sebagai latar belakang utama
      paper: '#ffffff',   // Warna putih bersih untuk Card, Paper, dll.
    },
    text: {
      primary: '#2a4d61',   // Biru sangat gelap agar mudah dibaca di atas background kuning
      secondary: '#4682A9', // Menggunakan warna primary untuk teks sekunder
    },
    // Warna standar untuk notifikasi
    error: {
      main: '#D32F2F',
    },
    success: {
      main: '#2E7D32',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
  },
  components: {
    // Kustomisasi default props untuk komponen
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none', // Agar teks tombol tidak kapital semua
        },
      },
    },
  },
});

export default theme;