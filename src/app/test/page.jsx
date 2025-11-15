// /src/app/test/page.jsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Box, CircularProgress, Button, Paper, TextField, Alert } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import QuestionDisplay from '@/components/test/QuestionDisplay';
import TierOptions from '@/components/test/TierOptions';
import CompletionScreen from '@/components/test/CompletionScreen';
import CAT_Engine, { calculateNewTheta } from '@/lib/catHandlers';
import { submitTestResults } from '@/lib/api';

// --- KOMPONEN FORM KODE AKSES ---
const AccessCodeForm = ({ onStart, loading, error, setError }) => {
    const [accessCode, setAccessCode] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!accessCode) {
            setError('Kode akses tidak boleh kosong.');
            return;
        }
        try {
            await onStart(accessCode);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Mulai Tes</Typography>
                <Typography color="text.secondary" align="center" sx={{ mt: 1 }}>Masukkan kode akses tes dari guru Anda.</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        autoFocus
                        label="Kode Akses Tes"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                    />
                    {error && <Alert severity="error" sx={{ width: '100%', mt: 1 }}>{error}</Alert>}
                    <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2 }}>
                        {loading ? <CircularProgress size={24} /> : 'Mulai'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

// --- KOMPONEN UTAMA HALAMAN TES ---
export default function TestPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [testPhase, setTestPhase] = useState('enterCode');
    const [testData, setTestData] = useState(null);
    const [accessCode, setAccessCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userAnswers, setUserAnswers] = useState({ tier1: null, tier2: null });
    const [showTier2, setShowTier2] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [theta, setTheta] = useState(0);
    const [responseHistory, setResponseHistory] = useState([]);
    const [informationItems, setInformationItems] = useState([]);
    const [answeredQuestionIds, setAnsweredQuestionIds] = useState(new Set());
    const [stoppingRule, setStoppingRule] = useState('');
    const [testStartTime, setTestStartTime] = useState(null);

    const handleStartTest = async (code) => {
        setLoading(true);
        setAccessCode(code);
        const response = await fetch('/api/attempt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessCode: code }),
        });
        const data = await response.json();
        if (!response.ok) {
            setLoading(false);
            throw new Error(data.message);
        }

        setTestData(data.testData);
        setTimeLeft(data.testData.duration * 60);
        setTestStartTime(new Date());
        const firstQuestion = data.testData.questions.reduce((p, c) => Math.abs(c.difficulty - 0) < Math.abs(p.difficulty - 0) ? c : p);
        setCurrentQuestion(firstQuestion);
        setAnsweredQuestionIds(new Set([firstQuestion._id]));
        setTestPhase('testing');
        setLoading(false);
    };

    const handleFinishTest = useCallback(async (rule, history) => {
        if (testPhase === 'finished' || !session || !testData) return;
        setStoppingRule(rule);
        setTestPhase('finished');

        const finalData = {
            userId: session.user.id,
            testId: testData._id,
            userInfo: {
                name: session.user.name,
                school: session.user.school,
                nis: session.user.nis,
                kelas: session.user.kelas,
                accessCode: accessCode,
            },
            testStartTime,
            testFinishTime: new Date(),
            finalTheta: Math.max(...history.map(r => r.thetaAfter)),
            stoppingRule: rule,
            responseHistory: history,
        };
        try {
            await submitTestResults(finalData);
        } catch (err) {
            console.error("Gagal menyimpan hasil tes:", err);
        }
    }, [testPhase, testData, session, theta, testStartTime, accessCode]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && testPhase === 'testing') {
                const zeroedHistory = responseHistory.map(item => ({
                    ...item, score: 0, pCorrect: 0, pWrong: 0,
                    informationItem: [], thetaBefore: 0, thetaAfter: 0, se: 0,
                    seDifference: item.seDifference === null ? null : 0,
                }));
                handleFinishTest('LEFT_TAB', zeroedHistory);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [testPhase, responseHistory, handleFinishTest]);

    const processAnswerAndSelectNext = useCallback(() => {
        if (!userAnswers.tier1 || !userAnswers.tier2) return;

        const tier1Correct = userAnswers.tier1 === currentQuestion.correctTier1;
        const tier2Correct = userAnswers.tier2 === currentQuestion.correctTier2;

        const oldTheta = theta;
        const newTheta = calculateNewTheta(currentQuestion.difficulty);
        const score = CAT_Engine.calculateScore(tier1Correct, tier2Correct);
        const pCorrect = CAT_Engine.calculateCorrectProbability(score, newTheta, currentQuestion.difficultySecondary, currentQuestion.difficultyTertiary, currentQuestion.difficultyQuaternary);
        const pWrong = CAT_Engine.calculcateWrongProbability(pCorrect.pCorrect);
        const informationItem = CAT_Engine.calculateInformationItem(pCorrect.pCorrect, pWrong);
        const newInformationItems = [...informationItems, informationItem];
        setInformationItems(newInformationItems);

        const oldSE = responseHistory.length > 0 ? responseHistory[responseHistory.length - 1].se : 0;
        const newSE = CAT_Engine.calculateStandardError(newInformationItems);
        const seDifference = CAT_Engine.calculateDifferenceSE(oldSE, newSE);

        const newHistoryEntry = {
            questionId: currentQuestion._id,
            questionDifficulty: {
                difficulty: currentQuestion.difficulty,
                difficultySecondary: currentQuestion.difficultySecondary,
                difficultyTertiary: currentQuestion.difficultyTertiary,
                difficultyQuaternary: currentQuestion.difficultyQuaternary,
            },
            answerTier1: userAnswers.tier1,
            answerTier2: userAnswers.tier2,
            score,
            pCorrect,
            pWrong,
            informationItem,
            thetaBefore: oldTheta,
            thetaAfter: newTheta,
            se: newSE,
            seDifference,
        };
        const updatedHistory = [...responseHistory, newHistoryEntry];
        setResponseHistory(updatedHistory);
        setTheta(newTheta);

        if (answeredQuestionIds.size >= testData.questions.length) {
            handleFinishTest('NO_MORE_QUESTIONS', updatedHistory);
            return;
        }
        if (seDifference !== null && seDifference < 0.01) {
            handleFinishTest('SE_DIFFERENCE', updatedHistory);
            return;
        }

        const availableQuestions = testData.questions.filter(q => !answeredQuestionIds.has(q._id));
        if (availableQuestions.length === 0) {
            handleFinishTest('NO_MORE_QUESTIONS', updatedHistory);
            return;
        }

        const nextQuestion = (() => {
            let filtered;

            // Step 1: Filter based on score
            if (score < 3) {
                // Prefer easier questions (difficulty < 0)
                filtered = availableQuestions.filter(q => q.difficulty < 0);
            } else {
                // Prefer harder questions (difficulty > 0)
                filtered = availableQuestions.filter(q => q.difficulty > 0);
            }

            // Step 2: Fallback if none match the filter
            if (filtered.length === 0) filtered = availableQuestions;

            // Step 3: Find the question whose difficulty is closest to 0
            return filtered.reduce((prev, curr) =>
                Math.abs(curr.difficulty - 0) < Math.abs(prev.difficulty - 0) ? curr : prev
            );
        })();

        setCurrentQuestion(nextQuestion);
        setAnsweredQuestionIds(prev => new Set(prev).add(nextQuestion._id));
        setUserAnswers({ tier1: null, tier2: null });
        setShowTier2(false);
    }, [userAnswers, currentQuestion, theta, responseHistory, testData, answeredQuestionIds, handleFinishTest]);

    useEffect(() => {
        if (status === 'unauthenticated') router.replace('/login');
        if (status === 'authenticated' && session?.user?.role !== 'siswa') router.replace('/dashboard');
    }, [status, session, router]);

    useEffect(() => {
        if (testPhase !== 'testing' || timeLeft <= 0) return;
        const timerId = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timerId);
    }, [testPhase, timeLeft]);

    useEffect(() => {
        if (timeLeft <= 0 && testPhase === 'testing') {
            handleFinishTest('TIME_WASTED', responseHistory);
        }
    }, [timeLeft, testPhase, responseHistory, handleFinishTest]);

    if (status === 'loading' || !session) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
    }
    if (testPhase === 'enterCode') {
        return <AccessCodeForm onStart={handleStartTest} loading={loading} error={error} setError={setError} />;
    }
    if (testPhase === 'finished') {
        return <CompletionScreen userName={session.user.name} stoppingRule={stoppingRule} />;
    }
    if (testPhase === 'testing' && currentQuestion) {
        const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography variant="h5" component="h1">{testData.title}</Typography>
                        <Typography variant="body2" color="text.secondary">Soal {answeredQuestionIds.size} dari {testData.questions.length}</Typography>
                    </Box>
                    <Paper elevation={2} sx={{ display: 'flex', alignItems: 'center', p: 1, minWidth: 100 }}>
                        <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" component="span">{formatTime(timeLeft)}</Typography>
                    </Paper>
                </Box>
                <QuestionDisplay
                    tier1Text={currentQuestion.tier1Text}
                    tier2Text={currentQuestion.tier2Text}
                    image={currentQuestion.imagelink} // Sesuaikan dengan nama field di model
                    showTier2={showTier2}
                />
                <TierOptions
                    label="Pilih Jawaban Tier 1:"
                    options={currentQuestion.tier1Options}
                    selectedValue={userAnswers.tier1}
                    onChange={(e) => { setUserAnswers(prev => ({ ...prev, tier1: e.target.value })); setShowTier2(true); }}
                />
                {showTier2 && (
                    <Box sx={{ mt: 3 }}>
                        <TierOptions
                            label="Pilih Alasan (Tier 2):"
                            options={currentQuestion.tier2Options}
                            selectedValue={userAnswers.tier2}
                            onChange={(e) => setUserAnswers(prev => ({ ...prev, tier2: e.target.value }))}
                        />
                    </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        onClick={processAnswerAndSelectNext}
                        disabled={!userAnswers.tier1 || !userAnswers.tier2}
                    >
                        Lanjut
                    </Button>
                </Box>
            </Container>
        );
    }
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
}
