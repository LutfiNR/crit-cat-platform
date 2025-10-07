// /src/app/signup/page.jsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, TextField, Button, Box, Paper, Alert, Link as MuiLink, Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Avatar, IconButton, InputAdornment } from '@mui/material';
import Link from 'next/link';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function SignupPage() {
  // --- PERBAIKAN 1: Melengkapi state awal ---
  const [formData, setFormData] = useState({
    name: '',
    nis: '',
    kelas: '', // Menambahkan 'kelas' sesuai model baru
    school: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'siswa', // Nilai default
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State untuk show/hide password
  const router = useRouter();

  // --- PERBAIKAN 2: Melengkapi fungsi handleChange ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      setLoading(false);
      return;
    }

    try {
      // --- PERBAIKAN 3: Membersihkan payload sebelum dikirim ---
      const { confirmPassword, ...payload } = formData;

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal melakukan pendaftaran.');
      }

      setSuccess('Pendaftaran berhasil! Anda akan diarahkan ke halaman login.');
      setTimeout(() => {
        router.push('/signin');
      }, 2000);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><PersonAddAltIcon /></Avatar>
        <Typography component="h1" variant="h5">Buat Akun Baru</Typography>

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Saya mendaftar sebagai:</FormLabel>
                <RadioGroup row name="role" value={formData.role} onChange={handleChange}>
                  <FormControlLabel value="siswa" control={<Radio />} label="Siswa" />
                  <FormControlLabel value="guru" control={<Radio />} label="Guru" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField name="name" required fullWidth label="Nama Lengkap" value={formData.name} onChange={handleChange} />
            </Grid>
            {/* --- PERBAIKAN 4: Field Sekolah sekarang umum untuk Guru & Siswa --- */}
            <Grid item xs={12}>
              <TextField name="school" required fullWidth label="Asal Sekolah" value={formData.school} onChange={handleChange} />
            </Grid>

            {formData.role === 'siswa' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField name="nis" required fullWidth label="Nomor Induk Siswa (NIS)" value={formData.nis} onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField name="kelas" required fullWidth label="Kelas" value={formData.kelas} onChange={handleChange} />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField name="username" required fullWidth label="Username" helperText="Username akan digunakan untuk login." value={formData.username} onChange={handleChange} />
            </Grid>
            {/* --- PERBAIKAN 5: Menambahkan fitur show/hide password --- */}
            <Grid item xs={12}>
              <TextField
                name="password" required fullWidth label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password} onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField name="confirmPassword" required fullWidth label="Konfirmasi Password" type="password" value={formData.confirmPassword} onChange={handleChange} />
            </Grid>
          </Grid>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

          <Button type="submit" fullWidth variant="contained" disabled={loading || !!success} sx={{ mt: 3, mb: 2, py: 1.5 }}>
            {loading ? 'Memproses...' : 'Daftar'}
          </Button>

          <Box textAlign="center">
            <MuiLink component={Link} href="/signin" variant="body2">Sudah punya akun? Login</MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}