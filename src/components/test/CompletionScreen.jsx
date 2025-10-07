"use client";
import React from 'react';
import { Container, Typography, Alert, Paper, Button, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function CompletionScreen({ userName, stoppingRule }) {
  const messages = {
    TIME_WASTED: 'Waktu pengerjaan Anda telah habis.',
    NO_MORE_QUESTIONS: 'Anda telah menyelesaikan semua soal yang tersedia.',
    SE_DIFFERENCE: 'Pengukuran kemampuan Anda telah mencapai tingkat akurasi yang memadai.',
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" gutterBottom>Tes Telah Selesai!</Typography>
        <Alert severity="success" sx={{ mb: 3 }}>
          Terima kasih, <strong>{userName}</strong>. Jawaban Anda telah berhasil direkam.
        </Alert>
        <Typography variant="body1" color="text.secondary">
          Tes Anda dihentikan karena: {messages[stoppingRule] || 'Tes telah selesai.'}
        </Typography>
        <Box mt={4}>
            <Button variant="contained" href="/">Kembali ke Beranda</Button>
        </Box>
      </Paper>
    </Container>
  );
}