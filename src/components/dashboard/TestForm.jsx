// /src/components/dashboard/TestForm.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, 
  Grid, Checkbox, List, ListItem, ListItemButton, ListItemText, Typography, 
  CircularProgress, Paper, FormControlLabel, Switch // <-- Impor Switch
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
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialData ? 'Edit Tes' : 'Buat Tes Baru'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={8}>
            <TextField fullWidth label="Judul Tes" name="title" value={formData.title} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Kode Akses" name="accessCode" value={formData.accessCode} onChange={handleChange} helperText="Kode unik untuk siswa masuk"/>
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField fullWidth multiline rows={2} label="Deskripsi (Opsional)" name="description" value={formData.description} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Durasi (Menit)" name="duration" type="number" value={formData.duration} onChange={handleChange} />
          </Grid>

          {/* --- PERBAIKAN: Mengganti Checkbox dengan Switch --- */}
          <Grid item xs={12}>
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
          </Grid>

          <Grid item xs={12}>
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
            <Typography variant="body2" color="text.secondary" sx={{mt:1}}>Soal Terpilih: {formData.questions.length}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button variant="contained" onClick={handleSaveClick}>Simpan Tes</Button>
      </DialogActions>
    </Dialog>
  );
}