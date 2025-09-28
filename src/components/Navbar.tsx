'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Container,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Home,
  Article,
  Assignment,
  Dashboard,
  Login,
  Logout,
  Menu as MenuIcon,
  Person,
  RateReview,
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { SiteData } from '@/lib/siteData';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/components/auth/RoleGuard';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Use auth context
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { isStudent, isWriter, isAdmin } = useRoleAccess();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  type MenuItem = {
    label: string;
    icon: React.ReactElement;
    href?: string;
    onClick?: () => Promise<void>;
  };

  const menuItems: MenuItem[] = [
    { label: 'Home', href: '/', icon: <Home /> },
    { label: 'Papers', href: '/papers', icon: <Article /> },
    { label: 'Reviews', href: '/public-reviews', icon: <RateReview /> },
    ...(isAuthenticated ? [{ label: 'Orders', href: '/orders', icon: <Assignment /> }] : []),
  ];

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const authItems: MenuItem[] = isAuthenticated 
    ? [
        { label: 'Dashboard', href: '/dashboard', icon: <Dashboard /> },
        { label: 'Logout', onClick: handleLogout, icon: <Logout /> },
      ]
    : [
        { label: 'Login', href: '/login', icon: <Login /> },
      ];

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: SiteData.site_colours.accent_colour,
        boxShadow: 2,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Image
                src="/assets/logos/logo.png"
                alt={SiteData.site_name}
                width={50}
                height={50}
                style={{ marginRight: '12px' }}
              />
              <Typography
                variant="h4"
                noWrap
                sx={{
                  fontWeight: 600,
                  color: 'white',
                  textDecoration: 'none',
                }}
              >
                {SiteData.site_abbrev}
              </Typography>
            </Link>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.label}
                    component={Link}
                    href={item.href}
                    startIcon={item.icon}
                    sx={{
                      color: 'white',
                      mx: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Notification Bell for authenticated users */}
                {isAuthenticated && user && (
                  <Box sx={{ mr: 1 }}>
                    <NotificationBell userId={user.id} />
                  </Box>
                )}
                
                {authItems.map((item) => (
                  <Button
                    key={item.label}
                    component={item.href ? Link : 'button'}
                    href={item.href}
                    onClick={item.onClick}
                    startIcon={item.icon}
                    sx={{
                      color: 'white',
                      mx: 1,
                      backgroundColor: item.label === 'Login' ? 'rgba(0, 0, 0, 0.2)' : 'transparent',
                      '&:hover': {
                        backgroundColor: item.label === 'Login' 
                          ? 'rgba(0, 0, 0, 0.3)' 
                          : 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="mobile-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="mobile-menu"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {[...menuItems, ...authItems].map((item) => (
                  <MenuItem
                    key={item.label}
                    component={item.href ? Link : 'button'}
                    href={item.href}
                    onClick={() => {
                      handleMenuClose();
                      item.onClick?.();
                    }}
                    sx={{ minWidth: 150 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.icon}
                      <Typography>{item.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}