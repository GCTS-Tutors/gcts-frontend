'use client';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  IconButton,
  Breadcrumbs,
  Alert,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { useGetOrderQuery } from '@/store/api/orderApi';
import { useGetOrderMessagesQuery, useCreateMessageMutation, useDeleteMessageMutation } from '@/store/api/messageApi';
import { MessagesList } from '@/components/orders/MessagesList';
import { MessageInput } from '@/components/orders/MessageInput';

interface OrderMessagesPageProps {
  params: {
    id: string;
  };
}

function OrderMessagesPage({ params }: OrderMessagesPageProps) {
  const { user } = useAuth();

  const { data: order, isLoading: orderLoading } = useGetOrderQuery(params.id);
  const { data: messages, isLoading: messagesLoading, error: messagesError, refetch } = useGetOrderMessagesQuery(params.id);
  const [createMessage, { isLoading: sendingMessage }] = useCreateMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  // Auto-refresh messages every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleSendMessage = async (content: string) => {
    try {
      await createMessage({
        content,
        orderId: params.id,
      }).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const canSendMessage = () => {
    if (!order || !user) return false;
    // Students can message if they own the order
    if (user.role === 'student' && order.student?.id === user.id) return true;
    // Writers can message if assigned to the order
    if (user.role === 'writer' && order.writer?.id === user.id) return true;
    // Admins can always message
    if (user.role === 'admin') return true;
    return false;
  };

  if (orderLoading || messagesLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading messages...</Typography>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Order not found or you don't have permission to view it.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href="/orders" style={{ textDecoration: 'none', color: 'inherit' }}>
          Orders
        </Link>
        <Link href={`/orders/${params.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          Order #{order.id}
        </Link>
        <Typography color="text.primary">Messages</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <IconButton component={Link} href={`/orders/${params.id}`}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" component="h1">
            Order Messages
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {order.title}
          </Typography>
        </Box>
      </Box>

      {/* Order Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6">{order.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Order #{order.id} • {order.status.replace('_', ' ')} • ${order.price}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={order.status.replace('_', ' ')}
                color={order.status === 'completed' ? 'success' : order.status === 'in_progress' ? 'info' : 'warning'}
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Messages Container */}
      <Paper sx={{ height: '60vh', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
        <MessagesList
          messages={messages || []}
          isLoading={messagesLoading}
          error={messagesError?.toString()}
          currentUserId={user?.id}
          currentUserRole={user?.role}
          onDeleteMessage={handleDeleteMessage}
        />
        
        {canSendMessage() ? (
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={sendingMessage}
            placeholder="Type your message..."
          />
        ) : (
          <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Alert severity="info">
              You don't have permission to send messages for this order.
            </Alert>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default function OrderMessagesPageWithAuth({ params }: OrderMessagesPageProps) {
  return (
    <PrivateRoute>
      <OrderMessagesPage params={params} />
    </PrivateRoute>
  );
}