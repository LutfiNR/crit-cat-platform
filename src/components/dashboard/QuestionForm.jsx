// /src/components/dashboard/QuestionForm.jsx
"use client";

import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Box, Alert, Typography
} from '@mui/material';

const initialFormState = {
    subject: '',
    imagelink: '',
    tier1Text: '',
    tier1Options: [{ id: 'opt1A', text: '' }, { id: 'opt1B', text: '' }, { id: 'opt1C', text: '' }, { id: 'opt1D', text: '' }, { id: 'opt1E', text: '' }],
    correctTier1: '',
    tier2Text: '',
    tier2Options: [{ id: 'opt2A', text: '' }, { id: 'opt2B', text: '' }, { id: 'opt2C', text: '' }, { id: 'opt2D', text: '' }, { id: 'opt2E', text: '' }],
    correctTier2: '',
    difficulty: 0,
    difficultySecondary: 0,
    difficultyTertiary: 0,
    difficultyQuaternary: 0,
};

// Fungsi helper untuk ekstraksi ID dari link Google Drive
const extractGoogleDriveId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return (match && match[1]) ? match[1] : null;
};

export default function QuestionForm({ open, onClose, onSave, initialData }) {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({}); // State untuk menampung pesan error

    useEffect(() => {
        if (open) {
            if (initialData) {
                setFormData({
                    subject: initialData.subject || '',
                    imagelink: initialData.imagelink || '',
                    tier1Text: initialData.tier1Text || '',
                    tier1Options: initialData.tier1Options?.length ? initialData.tier1Options : initialFormState.tier1Options,
                    correctTier1: initialData.correctTier1 || '',
                    tier2Text: initialData.tier2Text || '',
                    tier2Options: initialData.tier2Options?.length ? initialData.tier2Options : initialFormState.tier2Options,
                    correctTier2: initialData.correctTier2 || '',
                    difficulty: initialData.difficulty || 0,
                    difficultySecondary: initialData.difficultySecondary || 0,
                    difficultyTertiary: initialData.difficultyTertiary || 0,
                    difficultyQuaternary: initialData.difficultyQuaternary || 0,
                });
            } else {
                setFormData(initialFormState);
            }
            setErrors({}); // Selalu reset error saat form dibuka
        }
    }, [open, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleOptionChange = (tier, index, value) => {
        const newOptions = [...formData[tier]];
        newOptions[index].text = value;
        setFormData(prev => ({ ...prev, [tier]: newOptions }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.subject.trim()) newErrors.subject = "Subjek tidak boleh kosong.";
        if (!formData.tier1Text.trim()) newErrors.tier1Text = "Teks soal Tier 1 tidak boleh kosong.";
        if (!formData.tier2Text.trim()) newErrors.tier2Text = "Teks soal Tier 2 tidak boleh kosong.";
        if (!formData.correctTier1) newErrors.correctTier1 = "Kunci jawaban Tier 1 harus dipilih.";
        if (!formData.correctTier2) newErrors.correctTier2 = "Kunci jawaban Tier 2 harus dipilih.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveClick = () => {
        if (validateForm()) {
            let processedData = { ...formData };
            const fileId = extractGoogleDriveId(processedData.imagelink);
            if (fileId) {
                processedData.imagelink = `https://drive.usercontent.google.com/download?id=${fileId}`;
            }
            onSave(processedData);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{initialData ? 'Edit Soal' : 'Tambah Soal Baru'}</DialogTitle>
            <DialogContent>
                {Object.keys(errors).length > 0 &&
                    <Alert severity="error" sx={{ mb: 2 }}>Harap perbaiki isian yang ditandai merah.</Alert>
                }
                <Box display="flex" gap={2} sx={{ mt: 1, flexDirection: 'column' }}>
                    <TextField fullWidth label="Subjek Soal" name="subject" value={formData.subject} onChange={handleChange} error={!!errors.subject} helperText={errors.subject} />
                    <TextField fullWidth label="Link Gambar (Opsional)" name="imagelink" value={formData.imagelink} onChange={handleChange} helperText="Upload gambar di GDrive, lalu salin link 'anyone with the link'." />
                    <TextField fullWidth label="Kesulitan (b)" name="difficulty" type="number" value={formData.difficulty} onChange={handleChange} />
                    <TextField fullWidth label="Kesulitan (bi 1)" name="difficultySecondary" type="number" value={formData.difficultySecondary} onChange={handleChange} />
                    <TextField fullWidth label="Kesulitan (bi 2)" name="difficultyTertiary" type="number" value={formData.difficultyTertiary} onChange={handleChange} />
                    <TextField fullWidth label="Kesulitan (bi 3)" name="difficultyQuaternary" type="number" value={formData.difficultyQuaternary} onChange={handleChange} />
                    <TextField fullWidth multiline rows={3} label="Teks Soal (Tier 1)" name="tier1Text" value={formData.tier1Text} onChange={handleChange} error={!!errors.tier1Text} helperText={errors.tier1Text} />
                    <FormControl error={!!errors.correctTier1} sx={{ width: '100%' }}>
                        <FormLabel>Pilihan Jawaban (Tier 1) & Kunci Jawaban</FormLabel>
                        <RadioGroup name="correctTier1" value={formData.correctTier1} onChange={handleChange}>
                            {formData.tier1Options.map((opt, index) => (
                                <Box key={opt.id} sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>
                                    <FormControlLabel sx={{ width: '150px', mr: 0 }} value={opt.id} control={<Radio />} label={`Opsi ${String.fromCharCode(65 + index)}`} />
                                    <TextField fullWidth size="small" value={opt.text} onChange={(e) => handleOptionChange('tier1Options', index, e.target.value)} />
                                </Box>
                            ))}
                        </RadioGroup>
                        {errors.correctTier1 && <Typography color="error" variant="caption" sx={{ pl: 4 }}>{errors.correctTier1}</Typography>}
                    </FormControl>

                    <TextField fullWidth multiline rows={3} label="Teks Soal (Tier 2 - Alasan)" name="tier2Text" value={formData.tier2Text} onChange={handleChange} error={!!errors.tier2Text} helperText={errors.tier2Text} />
                    <FormControl error={!!errors.correctTier2} sx={{ width: '100%' }}>
                        <FormLabel>Pilihan Jawaban (Tier 2) & Kunci Jawaban</FormLabel>
                        <RadioGroup name="correctTier2" value={formData.correctTier2} onChange={handleChange}>
                            {formData.tier2Options.map((opt, index) => (
                                <Box key={opt.id} sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>
                                    <FormControlLabel sx={{ width: '150px', mr: 0 }} value={opt.id} control={<Radio />} label={`Alasan ${String.fromCharCode(65 + index)}`} />
                                    <TextField fullWidth size="small" value={opt.text} onChange={(e) => handleOptionChange('tier2Options', index, e.target.value)} />
                                </Box>
                            ))}
                        </RadioGroup>
                        {errors.correctTier2 && <Typography color="error" variant="caption" sx={{ pl: 4 }}>{errors.correctTier2}</Typography>}
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Batal</Button>
                <Button variant="contained" onClick={handleSaveClick}>Simpan</Button>
            </DialogActions>
        </Dialog>
    );
}