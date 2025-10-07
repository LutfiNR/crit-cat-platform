// /src/app/page.jsx
"use client";

import React from 'react';
import { Container, Typography, Button, Box, Grid, Paper, Divider } from '@mui/material';
import Link from 'next/link';
import PsychologyIcon from '@mui/icons-material/Psychology';
import RuleIcon from '@mui/icons-material/Rule';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ textAlign: 'center', py: { xs: 4, md: 8 } }}>

      {/* Bagian Hero */}
      <Box sx={{ my: { xs: 2, md: 4 } }}>
        <Typography
          // --- PENYEMPURNAAN 1: Tipografi Responsif ---
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'text.primary',
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' } // Ukuran font menyesuaikan layar
          }}
        >
          Selamat Datang di CRIT CAT
        </Typography>
        <Typography
          variant="h5"
          component="p"
          color="text.secondary"
          paragraph
          sx={{ maxWidth: '750px', mx: 'auto', mb: 4 }}
        >
          Platform Computerized Adaptive Testing (CAT) untuk mengasah dan mengukur kemampuan berpikir kritis Anda melalui metode soal <i>two-tier</i> yang inovatif.
        </Typography>

        {/* --- PENYEMPURNAAN 2: Menambahkan kembali tombol Login --- */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/signup"
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            Buat Akun Baru
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 8, maxWidth: '200px', mx: 'auto' }}>
        <StarBorderIcon color="primary" />
      </Divider>

      {/* Bagian Fitur */}
      <Box sx={{ my: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          Fitur Aplikasi
        </Typography>
        {/* --- PENJELASAN UTAMA: Grid Responsif --- */}
        <Grid container spacing={4} justifyContent="center">
          {[
            { icon: <PsychologyIcon />, title: "Tes Adaptif", description: "Soal disajikan sesuai tingkat kemampuan Anda secara real-time untuk evaluasi yang lebih akurat dan efisien." },
            { icon: <RuleIcon />, title: "Soal Two-Tier", description: "Mengukur tidak hanya jawaban akhir Anda, tetapi juga kedalaman pemahaman di balik alasan pilihan tersebut." },
            { icon: <AnalyticsIcon />, title: "Dashboard Analitik", description: "Untuk guru, tersedia dashboard untuk memantau dan menganalisis hasil pengerjaan tes para siswa." }
          ].map((item, index) => (
            // Bagian inilah yang mengatur layout responsif
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  }
                }}
              >
                {React.cloneElement(item.icon, { color: "primary", sx: { fontSize: 48, mb: 2 } })}
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {item.title}
                </Typography>
                <Typography color="text.secondary">
                  {item.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}