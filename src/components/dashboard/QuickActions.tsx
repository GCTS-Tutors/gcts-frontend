'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Add,
  Visibility,
  Payment,
  Message,
  Star,
  Help,
  Download,
  Refresh,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export function QuickActions() {
  const { user } = useAuth();

  const actions = [
    {
      title: 'Place New Order',
      description: 'Start a new academic order',
      icon: <Add />,
      color: 'primary.main',
      href: '/order/place',
      primary: true,
    },
    {
      title: 'View Orders',
      description: 'Check your order status',
      icon: <Visibility />,
      color: 'info.main',
      href: '/orders',
    },
    {
      title: 'Payment History',
      description: 'View payment records',
      icon: <Payment />,
      color: 'success.main',
      href: '/payments',
    },
    {
      title: 'Messages',
      description: 'Chat with writers',
      icon: <Message />,
      color: 'warning.main',
      href: '/messages',
    },
    {
      title: 'Leave Review',
      description: 'Rate your experience',
      icon: <Star />,
      color: 'secondary.main',
      href: '/reviews',
    },
    {
      title: 'Get Help',
      description: 'Contact support',
      icon: <Help />,
      color: 'error.main',
      href: '/support',
    },
  ];

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Quick Actions</Typography>
          <IconButton size="small">
            <Refresh />
          </IconButton>
        </Box>
        
        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Button
                component={Link}
                href={action.href}
                variant={action.primary ? 'contained' : 'outlined'}
                fullWidth
                sx={{
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  minHeight: 80,
                }}
                startIcon={
                  <Avatar 
                    sx={{ 
                      bgcolor: action.primary ? 'white' : action.color,
                      color: action.primary ? action.color : 'white',
                      width: 32,
                      height: 32,
                    }}
                  >
                    {action.icon}
                  </Avatar>
                }
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="subtitle2" component="div">
                    {action.title}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                  >
                    {action.description}
                  </Typography>
                </Box>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}