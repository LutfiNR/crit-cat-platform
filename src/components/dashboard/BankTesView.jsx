// /src/components/dashboard/BankTesView.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar, Alert, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TestForm from './TestForm'; // Impor form baru

export default function BankTesView() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Fungsi untuk mengambil daftar tes dari API
  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tests');
      if (!response.ok) throw new Error("Gagal memuat data tes.");
      const data = await response.json();
      setTests(data.tests);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleOpenForm = (test = null) => {
    setEditingTest(test);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTest(null);
  };

  const handleSaveTest = async (formData) => {
    try {
      const isEditing = !!editingTest;
      const url = isEditing ? `/api/tests/${editingTest._id}` : '/api/tests';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      setNotification({ open: true, message: result.message, severity: 'success' });
      handleCloseForm();
      fetchTests(); // Muat ulang daftar tes
    } catch (err) {
      setNotification({ open: true, message: err.message, severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus tes ini? Semua data terkait mungkin akan terpengaruh.')) {
      try {
        const response = await fetch(`/api/tests/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);

        setNotification({ open: true, message: result.message, severity: 'success' });
        fetchTests(); // Muat ulang
      } catch (err) {
        setNotification({ open: true, message: err.message, severity: 'error' });
      }
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification({ ...notification, open: false });
  };

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">Manajemen Bank Tes</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
            Buat Tes Baru
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Judul Tes</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Kode Akses</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Jumlah Soal</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test._id}>
                    <TableCell>{test.title}</TableCell>
                    <TableCell><code>{test.accessCode}</code></TableCell>
                    <TableCell align="center">{test.questions.length}</TableCell>
                    <TableCell align="center">
                      <Chip label={test.status} color={test.status === 'published' ? 'success' : 'default'} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpenForm(test)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(test._id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <TestForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveTest}
        initialData={editingTest}
      />

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>{notification.message}</Alert>
      </Snackbar>
    </>
  );
}