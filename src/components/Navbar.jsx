// /src/components/Navbar.jsx
"use client";

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, Avatar, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

const drawerWidth = 240;

export default function Navbar(props) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  
  // State untuk menu mobile (drawer)
  const [mobileOpen, setMobileOpen] = useState(false);
  // State untuk menu user di desktop
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // --- KONTEN UNTUK MENU MOBILE (DRAWER) ---
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        CRIT CAT
      </Typography>
      <Divider />
      <List>
        {isAuthenticated ? (
          // Item menu jika sudah login
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/dashboard" sx={{ textAlign: 'center' }}>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => signOut({ callbackUrl: '/' })} sx={{ textAlign: 'center' }}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          // Item menu jika belum login
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/signin" sx={{ textAlign: 'center' }}>
                <ListItemText primary="Masuk" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} href="/signup" sx={{ textAlign: 'center' }}>
                <ListItemText primary="Daftar" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav">
        <Toolbar>
          {/* --- TOMBOL HAMBURGER (HANYA MUNCUL DI MOBILE) --- */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }} // Tampil di 'xs', sembunyi di 'sm' ke atas
          >
            <MenuIcon />
          </IconButton>

          {/* --- BRAND/JUDUL (SELALU TAMPIL) --- */}
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
          >
            CRIT CAT
          </Typography>

          {/* --- MENU DESKTOP (HANYA MUNCUL DI DESKTOP) --- */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {isAuthenticated ? (
              // Tampilan jika sudah login di desktop
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem disabled>Halo, {session.user.name}!</MenuItem>
                  <Divider />
                  <MenuItem component={Link} href="/dashboard" onClick={handleClose}>Dashboard</MenuItem>
                  <MenuItem onClick={() => { handleClose(); signOut({ callbackUrl: '/' }); }}>Logout</MenuItem>
                </Menu>
              </div>
            ) : (
              // Tampilan jika belum login di desktop
              <>
                <Button component={Link} href="/signin" color="inherit">Login</Button>
                <Button component={Link} href="/signup" variant="outlined" color="inherit" sx={{ ml: 1 }}>Daftar</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* --- DRAWER UNTUK TAMPILAN MOBILE --- */}
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better open performance on mobile.
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}