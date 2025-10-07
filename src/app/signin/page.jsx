// /src/app/login/page.jsx
"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Container, Typography, TextField, Button, Box, Paper, Alert, Link as MuiLink, Avatar } from '@mui/material';
import Link from 'next/link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Panggil fungsi signIn dari NextAuth
      const result = await signIn('credentials', {
        redirect: false, // Penting: kita tangani redirect manual
        username,
        password,
      });

      if (result.error) {
        // Jika NextAuth mengembalikan error (dari fungsi 'authorize')
        setError('Username atau password salah.');
        setLoading(false);
      } else {
        // Jika login berhasil, arahkan ke dashboard
        router.replace('/dashboard');
      }
    } catch (err) {
      setLoading(false);
      setError('Terjadi kesalahan, coba lagi nanti.');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}><LockOutlinedIcon /></Avatar>
        <Typography component="h1" variant="h5">Login Akun</Typography>
        <Typography color="text.secondary" align="center" sx={{ mt: 1 }}>Untuk Guru dan Siswa</Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField margin="normal" required fullWidth label="Username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2, py: 1.5 }}>
            {loading ? 'Memproses...' : 'Login'}
          </Button>

          <Box textAlign="center">
            <MuiLink component={Link} href="/signup" variant="body2">
              {"Belum punya akun? Buat Akun Baru"}
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}