// /src/app/dashboard/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Alert, ListItemAvatar, Avatar, Container, Typography, Box, CircularProgress, Button, Paper, Grid, List, ListItem, ListItemText, Divider, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// --- Import Ikon ---
import HistoryIcon from '@mui/icons-material/History';
import EditNoteIcon from '@mui/icons-material/EditNote';

import BankSoalView from '@/components/dashboard/BankSoalView';
import BankTesView from '@/components/dashboard/BankTesView';
import RekapTesView from '@/components/dashboard/RekapTesView';
import Link from 'next/link';


// ===================================================================
// ## KOMPONEN DASHBOARD SISWA ##
// ===================================================================
const SiswaDashboard = ({ session }) => {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/submissions/history');
        if (!response.ok) {
          throw new Error('Gagal memuat data riwayat tes.');
        }
        const data = await response.json();
        setHistory(data.history);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>Selamat Datang, {session.user.name}!</Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>Siap untuk mengasah kemampuan berpikir kritis Anda?</Typography>

      {/* Kartu Aksi Utama (Tidak Berubah) */}
      <Paper elevation={4} sx={{ p: { xs: 3, sm: 5 }, mb: 4, textAlign: 'center', background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)` }}>
        <Typography variant="h5" sx={{ color: 'primary.contrastText', fontWeight: 'bold', mb: 2 }}>Mulai Ujian Baru</Typography>
        <Button variant="contained" color="secondary" size="large" onClick={() => router.push('/test')} startIcon={<EditNoteIcon />}>
          Kerjakan Tes
        </Button>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>Riwayat Tes Anda</Typography>

      {/* --- PERUBAHAN UTAMA: Menggunakan Tabel --- */}
      <TableContainer component={Paper} variant="outlined">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : (
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nama Test</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Waktu Selesai</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Nilai Akhir (Theta)</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.length > 0 ? (
                history.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.testId.title}</TableCell>
                    <TableCell>{new Date(item.testFinishTime).toLocaleString('id-ID')}</TableCell>
                    <TableCell>{item.stoppingRule}</TableCell>
                    <TableCell align="center">{item.finalTheta.toFixed(3)}</TableCell>
                    <TableCell align="center">
                      <Button
                        component={Link}
                        href={`/results/${item._id}`}
                        size="small"
                        variant="outlined"
                        target='_blank'
                      >
                        Lihat Rincian
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      Belum ada riwayat tes yang dikerjakan.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

// ===================================================================
// ## KOMPONEN DASHBOARD GURU ##
// ===================================================================
const GuruDashboard = ({ session }) => {
  const [activeTab, setActiveTab] = useState(0); // 0: Bank Soal, 1: Bank Tes, 2: Rekap

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Guru
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Selamat Datang, {session.user.name}!
      </Typography>

      {/* --- Navigasi Tab --- */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="dashboard guru tabs">
          <Tab label="Bank Soal" id="tab-0" />
          <Tab label="Bank Tes" id="tab-1" />
          <Tab label="Rekap Tes" id="tab-2" />
        </Tabs>
      </Box>

      {/* --- Konten Tab --- */}
      {activeTab === 0 && <BankSoalView />}
      {activeTab === 1 && <BankTesView />}
      {activeTab === 2 && <RekapTesView />}
    </Box>
  );
};

// ===================================================================
// ## KOMPONEN UTAMA PAGE ##
// ===================================================================
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // --- PENYEMPURNAAN: Redirect otomatis jika tidak login ---
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {session?.user?.role === 'guru' && <GuruDashboard session={session} />}
      {session?.user?.role === 'siswa' && <SiswaDashboard session={session} />}
    </Container>
  );
}