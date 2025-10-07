// /src/app/layout.js

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import NextAuthProvider from '@/components/providers/SessionProvider'; // <-- Ganti nama ini jika berbeda

// Impor komponen yang baru dibuat
import theme from '@/theme';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'CRIT CAT Platform',
  description: 'Platform Computerized Adaptive Testing untuk Berpikir Kritis',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NextAuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  pt: { xs: 7, sm: 8 },
                }}
              >
                {children}
              </Box>
              <Footer />
            </Box>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}