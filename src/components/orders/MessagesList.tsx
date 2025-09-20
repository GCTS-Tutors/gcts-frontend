'use client';

import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  Fade,
} from '@mui/material';
import {
  ChatBubbleOutline,
} from '@mui/icons-material';
import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';

interface MessagesListProps {
  messages: any[];
  isLoading?: boolean;
  error?: string;
  currentUserId?: number;
  currentUserRole?: string;
  onDeleteMessage?: (messageId: number) => void;
}

export function MessagesList({ 
  messages, 
  isLoading = false, 
  error, 
  currentUserId, 
  currentUserRole,
  onDeleteMessage 
}: MessagesListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load messages: {error}
      </Alert>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          height: '400px',
          color: 'text.secondary',
        }}
      >
        <ChatBubbleOutline sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" gutterBottom>
          No messages yet
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', maxWidth: 300 }}>
          Start the conversation by sending a message below. All participants in this order will be able to see and respond to messages.
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        height: '100%',
        overflow: 'auto',
        p: 2,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'grey.100',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'grey.400',
          borderRadius: '3px',
          '&:hover': {
            background: 'grey.500',
          },
        },
      }}
    >
      <Stack spacing={1}>
        {messages.map((message, index) => (
          <Fade in key={message.id} timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
            <div>
              <MessageBubble
                message={message}
                isOwnMessage={message.sender.id === currentUserId}
                currentUserRole={currentUserRole}
                onDeleteMessage={onDeleteMessage}
              />
            </div>
          </Fade>
        ))}
      </Stack>
      <div ref={messagesEndRef} />
    </Box>
  );
}