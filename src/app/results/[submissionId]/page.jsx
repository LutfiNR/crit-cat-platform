// /src/app/results/[submissionId]/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    Container, Typography, Box, CircularProgress, Paper, Grid, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import calculateDurationOfTest from '@/lib/calculateDurationOfTest';

export default function ResultDetailPage() {
    const { submissionId } = useParams();
    const { data: session, status } = useSession();
    const router = useRouter();

    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'authenticated') {
            const fetchSubmission = async () => {
                try {
                    const response = await fetch(`/api/submissions/${submissionId}`);
                    if (!response.ok) throw new Error((await response.json()).message);
                    const data = await response.json();
                    setSubmission(data.submission);
                } catch (err) { setError(err.message); }
                finally { setLoading(false); }
            };
            fetchSubmission();
        }
        if (status === 'unauthenticated') router.replace('/login');
    }, [submissionId, status, router]);

    if (loading || status === 'loading') return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
    if (error) return <Container sx={{ mt: 4 }}><Paper sx={{ p: 3 }}><Typography color="error">{error}</Typography></Paper></Container>;
    if (!submission) return <Container sx={{ mt: 4 }}><Paper sx={{ p: 3 }}><Typography>Data tidak ditemukan.</Typography></Paper></Container>;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}> {/* Changed to xl for wider table */}
            <Paper sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>Detail Hasil Pengerjaan</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}><Typography><strong>Peserta:</strong> {submission.userInfo.name}</Typography></Grid>
                    <Grid item xs={12} md={6}><Typography><strong>Tes:</strong> {submission.testId.title}</Typography></Grid>
                    <Grid item xs={12} md={6}>
                        <Typography><strong>Durasi Pengerjaan:</strong> {calculateDurationOfTest(submission.testStartTime, submission.testFinishTime).minutes} Menit {calculateDurationOfTest(submission.testStartTime, submission.testFinishTime).seconds} Detik</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}><Typography variant="h6" component="p"><strong>Nilai Akhir (Theta): {submission.finalTheta.toFixed(4)}</strong></Typography></Grid>
                </Grid>
            </Paper>

            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Rincian Jawaban per Soal</Typography>

            <TableContainer component={Paper} variant="outlined">
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Item</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 80 }}>b</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 80 }}>bi1</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 80 }}>bi2</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 80 }}>bi3</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 80 }}>Skor</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 80 }}>θ Awal</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 80 }}>θ Akhir</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 80 }}>P(θ)1</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 80 }}>P(θ)2</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 80 }}>P(θ)3</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 80 }}>P(θ)4</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 80 }}>P(θ)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 80 }}>SE</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: 80 }}>SEΔ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {submission.responseHistory.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell align="center" >{index + 1}</TableCell>
                                <TableCell align="center" >{item.questionDifficulty.difficulty}</TableCell>
                                <TableCell align="center" >{item.questionDifficulty.difficultySecondary}</TableCell>
                                <TableCell align="center" >{item.questionDifficulty.difficultyTertiary}</TableCell>
                                <TableCell align="center" >{item.questionDifficulty.difficultyQuaternary}</TableCell>
                                <TableCell align="center" >{item.score}</TableCell>
                                <TableCell align="center" >{item.thetaBefore}</TableCell>
                                <TableCell align="center" >{item.thetaAfter}</TableCell>
                                <TableCell align="center" >{Math.round(item.pCorrect.pCorrect0 * 1000) / 1000}</TableCell>
                                <TableCell align="center" >{Math.round(item.pCorrect.pCorrect1 * 1000) / 1000}</TableCell>
                                <TableCell align="center" >{Math.round(item.pCorrect.pCorrect2 * 1000) / 1000}</TableCell>
                                <TableCell align="center" >{Math.round(item.pCorrect.pCorrect3 * 1000) / 1000}</TableCell>
                                <TableCell align="center" >{Math.round(item.pCorrect.pCorrect * 1000) / 1000}</TableCell>
                                <TableCell align="center" >{Math.round(item.se * 1000) / 1000}</TableCell>
                                <TableCell align="center" >{Math.round(item.seDifference * 1000) / 1000}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}