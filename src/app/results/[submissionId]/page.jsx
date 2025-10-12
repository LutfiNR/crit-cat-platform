// /src/app/results/[submissionId]/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
    Container, Typography, Box, CircularProgress, Paper, Grid, Chip, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// Helper component to display an answer with a correctness icon within a table cell
const AnswerCell = ({ question, answerId, tier }) => {
    if (!question) return <TableCell>Data soal tidak tersedia</TableCell>;

    const options = tier === 1 ? question.tier1Options : question.tier2Options;
    const correctId = tier === 1 ? question.correctTier1 : question.correctTier2;
    
    const chosenOption = options.find(opt => opt.id === answerId);
    const isCorrect = answerId === correctId;

    return (
        <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isCorrect ? <CheckCircleIcon fontSize="small" color="success" /> : <CancelIcon fontSize="small" color="error" />}
                <Typography variant="body2">{chosenOption?.text || 'Tidak terjawab'}</Typography>
            </Box>
        </TableCell>
    );
};


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
    if (error) return <Container sx={{mt: 4}}><Paper sx={{p:3}}><Typography color="error">{error}</Typography></Paper></Container>;
    if (!submission) return <Container sx={{mt: 4}}><Paper sx={{p:3}}><Typography>Data tidak ditemukan.</Typography></Paper></Container>;

    const getScoreColor = (score) => {
        if (score === 4) return 'success';
        if (score === 3) return 'info';
        if (score === 2) return 'warning';
        return 'error';
    };

    const calculateDuration = () => {
        if (!submission.testStartTime || !submission.testFinishTime) {
            return 'N/A';
        }
        const startTime = new Date(submission.testStartTime);
        const finishTime = new Date(submission.testFinishTime);
        const durationMs = finishTime - startTime; // Selisih dalam milidetik

        const totalSeconds = Math.floor(durationMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes} menit ${seconds} detik`;
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}> {/* Changed to xl for wider table */}
            <Paper sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>Detail Hasil Pengerjaan</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}><Typography><strong>Peserta:</strong> {submission.userInfo.name}</Typography></Grid>
                    <Grid item xs={12} md={6}><Typography><strong>Tes:</strong> {submission.testId.title}</Typography></Grid>
                    <Grid item xs={12} md={6}>
                        <Typography><strong>Durasi Pengerjaan:</strong> {calculateDuration()}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}><Typography variant="h6" component="p"><strong>Nilai Akhir (Theta): {submission.finalTheta.toFixed(4)}</strong></Typography></Grid>
                </Grid>
            </Paper>

            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Rincian Jawaban per Soal</Typography>
            
            <TableContainer component={Paper} variant="outlined">
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>No.</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>Soal (Tier 1)</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>Jawaban (Tier 1)</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>Jawaban (Tier 2)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Skor</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Perubahan Theta</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {submission.responseHistory.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <Typography variant="body2">{item.questionId?.tier1Text || "N/A"}</Typography>
                                </TableCell>
                                <AnswerCell question={item.questionId} answerId={item.answerTier1} tier={1} />
                                <AnswerCell question={item.questionId} answerId={item.answerTier2} tier={2} />
                                <TableCell align="center">
                                    <Chip label={item.score} color={getScoreColor(item.score)} size="small" />
                                </TableCell>
                                <TableCell align="center">
                                    <Typography variant="body2">
                                        {item.thetaBefore.toFixed(3)} → {item.thetaAfter.toFixed(3)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}