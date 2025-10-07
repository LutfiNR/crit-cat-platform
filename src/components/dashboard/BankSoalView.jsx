// /src/components/dashboard/BankSoalView.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Impor semua fungsi API yang kita butuhkan
import { getTestQuestions, getQuestionById, updateQuestion, deleteQuestion } from '@/lib/api';
import QuestionForm from './QuestionForm';

export default function BankSoalView() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    // --- State baru untuk membedakan mode Add/Edit ---
    const [editingQuestion, setEditingQuestion] = useState(null);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const data = await getTestQuestions();
            setQuestions(data);
        } catch (err) {
            setError('Gagal memuat data soal. ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleCloseNotification = (event, reason) => {
        if (reason === 'clickaway') return;
        setNotification({ ...notification, open: false });
    };

    // --- Handler untuk Form ---
    const handleOpenForm = (question = null) => {
        setEditingQuestion(question); // Jika 'question' ada, kita mode edit. Jika null, mode tambah.
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingQuestion(null); // Selalu reset state edit saat form ditutup
    };

    const handleSaveQuestion = async (formData) => {
        try {
            if (editingQuestion) {
                // --- LOGIKA UPDATE ---
                const result = await updateQuestion(editingQuestion._id, formData);
                setNotification({ open: true, message: result.message, severity: 'success' });
            } else {
                // --- LOGIKA CREATE ---
                const response = await fetch('/api/questions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || 'Gagal menyimpan soal.');
                setNotification({ open: true, message: 'Soal berhasil ditambahkan!', severity: 'success' });
            }
            handleCloseForm();
            fetchQuestions(); // Muat ulang data untuk menampilkan perubahan
        } catch (err) {
            setNotification({ open: true, message: err.message, severity: 'error' });
        }
    };

    // --- Handler untuk Delete ---
    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus soal ini? Tindakan ini tidak bisa diurungkan.')) {
            try {
                const result = await deleteQuestion(id);
                setNotification({ open: true, message: result.message, severity: 'success' });
                // Update UI secara langsung tanpa fetch ulang untuk respons yang lebih cepat
                setQuestions(prev => prev.filter(q => q._id !== id));
            } catch (err) {
                setNotification({ open: true, message: err.message, severity: 'error' });
            }
        }
    };

    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <>
            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" component="h2">Manajemen Bank Soal</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
                        Tambah Soal
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
                ) : (
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Subjek</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Teks Soal (Tier 1)</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Kesulitan (b)</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Aksi</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {questions.length > 0 ? (
                                    questions.map((q) => (
                                        <TableRow key={q._id}>
                                            <TableCell>{q.subject}</TableCell>
                                            <TableCell>{q.tier1Text.substring(0, 70)}...</TableCell>
                                            <TableCell align="center">{q.difficulty}</TableCell>
                                            <TableCell align="right">
                                                <IconButton color="primary" onClick={() => handleOpenForm(q)}><EditIcon /></IconButton>
                                                <IconButton color="error" onClick={() => handleDelete(q._id)}><DeleteIcon /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">Belum ada soal di dalam bank soal.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* Form Dialog sekarang menerima initialData */}
            <QuestionForm
                open={isFormOpen}
                onClose={handleCloseForm}
                onSave={handleSaveQuestion}
                initialData={editingQuestion}
            />

            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
}