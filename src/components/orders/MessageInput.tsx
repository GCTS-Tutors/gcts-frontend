'use client';

import {
  Box,
  TextField,
  Button,
  IconButton,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Send,
  AttachFile,
  EmojiEmotions,
} from '@mui/icons-material';
import { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({ onSendMessage, disabled = false, placeholder = "Type your message..." }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        borderTop: '1px solid',
        borderColor: 'divider',
        borderRadius: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder={placeholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={disabled}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '& fieldset': {
                    borderColor: 'grey.300',
                  },
                  '&:hover fieldset': {
                    borderColor: 'grey.400',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Tooltip title="Attach File">
              <IconButton size="small" disabled={disabled}>
                <AttachFile />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Add Emoji">
              <IconButton size="small" disabled={disabled}>
                <EmojiEmotions />
              </IconButton>
            </Tooltip>
            
            <Button
              type="submit"
              variant="contained"
              disabled={!message.trim() || disabled}
              sx={{ 
                minWidth: 'auto', 
                px: 2,
                borderRadius: 3,
                ml: 1,
              }}
            >
              <Send sx={{ fontSize: 18 }} />
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
}