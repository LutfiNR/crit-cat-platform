// /src/components/Footer.jsx
"use client"; // Menggunakan "use client" agar bisa mengakses theme di sx prop
import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        px: 2,
        mt: 'auto', // Mendorsong footer ke bawah halaman
        
        // --- PENYESUAIAN TEMA ---
        backgroundColor: 'primary.main', // Menggunakan warna utama dari tema (biru)
        color: 'primary.contrastText',   // Menggunakan warna teks kontras (putih)
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center" sx={{fontSize: '0.8rem'}}>
          {'Copyright © '}
          <Link color="inherit" href="/" sx={{ fontWeight: 'bold' }}>
            CRIT CAT
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </Box>
  );
}