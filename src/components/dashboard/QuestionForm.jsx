// /src/components/dashboard/QuestionForm.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const initialFormState = {
    subject: '',
    difficulty: 0,
    tier1Text: '',
    tier1Options: [{ id: 'opt1A', text: '' }, { id: 'opt1B', text: '' }, { id: 'opt1C', text: '' }],
    correctTier1: '',
    tier2Text: '',
    tier2Options: [{ id: 'opt2A', text: '' }, { id: 'opt2B', text: '' }, { id: 'opt2C', text: '' }],
    correctTier2: '',
};

export default function QuestionForm({ open, onClose, onSave, initialData }) {
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (open) {
            setFormData(initialData || initialFormState);
        }
    }, [open, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (tier, index, value) => {
        const newOptions = [...formData[tier]];
        newOptions[index].text = value;
        setFormData(prev => ({ ...prev, [tier]: newOptions }));
    };

    const handleSaveClick = () => {
        // Di sini bisa ditambahkan validasi form sebelum menyimpan
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{initialData ? 'Edit Soal' : 'Tambah Soal Baru'}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={8}>
                        <TextField fullWidth label="Subjek Soal" name="subject" value={formData.subject} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField fullWidth label="Tingkat Kesulitan (b)" name="difficulty" type="number" value={formData.difficulty} onChange={handleChange} />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth multiline rows={3} label="Teks Soal (Tier 1)" name="tier1Text" value={formData.tier1Text} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl>
                            <FormLabel>Pilihan Jawaban (Tier 1) & Kunci Jawaban</FormLabel>
                            <RadioGroup name="correctTier1" value={formData.correctTier1} onChange={handleChange}>
                                {formData.tier1Options.map((opt, index) => (
                                    <Box key={opt.id} sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>
                                        <FormControlLabel value={opt.id} control={<Radio />} label={`Opsi ${String.fromCharCode(65 + index)}`} />
                                        <TextField fullWidth size="small" value={opt.text} onChange={(e) => handleOptionChange('tier1Options', index, e.target.value)} />
                                    </Box>
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth multiline rows={3} label="Teks Soal (Tier 2 - Alasan)" name="tier2Text" value={formData.tier2Text} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl>
                            <FormLabel>Pilihan Jawaban (Tier 2) & Kunci Jawaban</FormLabel>
                            <RadioGroup name="correctTier2" value={formData.correctTier2} onChange={handleChange}>
                                {formData.tier2Options.map((opt, index) => (
                                    <Box key={opt.id} sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>
                                        <FormControlLabel value={opt.id} control={<Radio />} label={`Alasan ${String.fromCharCode(65 + index)}`} />
                                        <TextField fullWidth size="small" value={opt.text} onChange={(e) => handleOptionChange('tier2Options', index, e.target.value)} />
                                    </Box>
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Batal</Button>
                <Button variant="contained" onClick={handleSaveClick}>Simpan</Button>
            </DialogActions>
        </Dialog>
    );
}