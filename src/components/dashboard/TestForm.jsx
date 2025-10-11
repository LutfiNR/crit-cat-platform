// /src/components/dashboard/TestForm.jsx
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Grid, Checkbox, List, ListItem, ListItemButton, ListItemText, Typography,
  CircularProgress, Paper, FormControlLabel, Switch, Box
} from '@mui/material';
import { getTestQuestions } from '@/lib/api';

const initialFormState = {
  title: '',
  description: '',
  accessCode: '',
  duration: 60,
  questions: [],
  status: 'draft', // Status default adalah 'draft'
};

export default function TestForm({ open, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(initialFormState);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Ambil semua soal dari Bank Soal untuk ditampilkan sebagai pilihan
  useEffect(() => {
    if (open) {
      setLoadingQuestions(true);
      getTestQuestions()
        .then(data => {
          setAvailableQuestions(data);
          setLoadingQuestions(false);
        })
        .catch(err => {
          console.error("Gagal memuat soal:", err);
          setLoadingQuestions(false);
        });
    }
  }, [open]);

  // Isi form jika dalam mode edit
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          accessCode: initialData.accessCode || '',
          duration: initialData.duration || 60,
          questions: initialData.questions.map(q => q._id || q) || [],
          status: initialData.status || 'draft',
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- PERBAIKAN: Handler khusus untuk Switch status ---
  const handleStatusChange = (event) => {
    const newStatus = event.target.checked ? 'published' : 'draft';
    setFormData(prev => ({ ...prev, status: newStatus }));
  };

  const handleToggleQuestion = (questionId) => {
    setFormData(prev => {
      const selectedQuestions = prev.questions;
      const currentIndex = selectedQuestions.indexOf(questionId);
      const newSelected = [...selectedQuestions];

      if (currentIndex === -1) {
        newSelected.push(questionId);
      } else {
        newSelected.splice(currentIndex, 1);
      }
      return { ...prev, questions: newSelected };
    });
  };

  const handleSaveClick = () => {
    onSave(formData);
    console.log("Data yang disimpan:", formData); // Debug log
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialData ? 'Edit Tes' : 'Buat Tes Baru'}</DialogTitle>
      <DialogContent>
        <Box display="flex" gap={2} sx={{ mt: 1, flexDirection: 'column' }}>
          <TextField fullWidth label="Judul Tes" name="title" value={formData.title} onChange={handleChange} />
          <TextField fullWidth label="Kode Akses" name="accessCode" value={formData.accessCode} onChange={handleChange} helperText="Kode unik untuk siswa masuk" />
          <TextField fullWidth multiline rows={2} label="Deskripsi (Opsional)" name="description" value={formData.description} onChange={handleChange} />
          <TextField fullWidth label="Durasi (Menit)" name="duration" type="number" value={formData.duration} onChange={handleChange} />

          <FormControlLabel
            control={
              <Switch
                checked={formData.status === 'published'}
                onChange={handleStatusChange}
                name="status"
              />
            }
            label={formData.status === 'published' ? 'Tes ini Dipublikasikan' : 'Tes ini Masih Draft'}
          />

          <Typography variant="h6" sx={{ mb: 1 }}>Pilih Soal dari Bank Soal</Typography>
          {loadingQuestions ? (
            <CircularProgress />
          ) : (
            <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
              <List dense>
                {availableQuestions.map((q) => {
                  const isSelected = formData.questions.includes(q._id);
                  return (
                    <ListItem key={q._id} secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={() => handleToggleQuestion(q._id)}
                        checked={isSelected}
                      />
                    }
                      disablePadding
                    >
                      <ListItemButton onClick={() => handleToggleQuestion(q._id)}>
                        <ListItemText primary={q.tier1Text} secondary={`Subjek: ${q.subject} | Kesulitan: ${q.difficulty}`} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Soal Terpilih: {formData.questions.length}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button variant="contained" onClick={handleSaveClick}>Simpan Tes</Button>
      </DialogActions>
    </Dialog>
  );
}