// /src/components/dashboard/RekapTesView.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getTestRecapSummary, getTestRecapDetail } from '@/lib/api';

// Komponen untuk Tampilan Detail
const DetailView = ({ testData, onBack }) => {
  return (
    <>
      <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }}>
        Kembali ke Daftar Rekap
      </Button>
      <Typography variant="h5" component="h2" gutterBottom>
        Rekap Hasil: <span style={{ fontWeight: 'normal' }}>{testData.test.title}</span>
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Nama Siswa</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>NIS</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Waktu Selesai</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Nilai Akhir (Theta)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testData.submissions.length > 0 ? (
              testData.submissions.map(sub => (
                <TableRow key={sub._id}>
                  <TableCell>{sub.userInfo.name}</TableCell>
                  <TableCell>{sub.userInfo.nis}</TableCell>
                  <TableCell>{new Date(sub.testFinishTime).toLocaleString('id-ID')}</TableCell>
                  <TableCell align="right">{sub.finalTheta.toFixed(3)}</TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="outlined">Lihat Rincian</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">Belum ada siswa yang mengerjakan tes ini.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

// Komponen Utama RekapTesView
export default function RekapTesView() {
  const [summaries, setSummaries] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null); // Menyimpan data detail tes yang dipilih
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch data ringkasan saat komponen dimuat
  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        setLoading(true);
        const data = await getTestRecapSummary();
        setSummaries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSummaries();
  }, []);

  // Handler untuk melihat detail
  const handleViewDetails = async (testId) => {
    try {
      setDetailLoading(true);
      const data = await getTestRecapDetail(testId);
      setSelectedTest(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  // Handler untuk kembali ke daftar ringkasan
  const handleBackToSummary = () => {
    setSelectedTest(null);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      {detailLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
      
      {!detailLoading && selectedTest ? (
        // Tampilan 2: Detail Hasil Tes
        <DetailView testData={selectedTest} onBack={handleBackToSummary} />
      ) : (
        // Tampilan 1: Ringkasan Semua Tes
        <>
          <Typography variant="h5" component="h2" gutterBottom>Rekapitulasi Hasil Tes</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Judul Tes</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Kode Akses</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Jumlah Peserta</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summaries.map((test) => (
                  <TableRow key={test._id}>
                    <TableCell>{test.title}</TableCell>
                    <TableCell><code>{test.accessCode}</code></TableCell>
                    <TableCell align="center">{test.submissionCount}</TableCell>
                    <TableCell align="right">
                      <Button variant="contained" size="small" onClick={() => handleViewDetails(test._id)}>Lihat Rekap</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Paper>
  );
}