'use client';

import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  MoreVert,
  Delete,
  Person,
  AdminPanelSettings,
  Edit,
  School,
} from '@mui/icons-material';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: any;
  isOwnMessage: boolean;
  currentUserRole?: string;
  onDeleteMessage?: (messageId: number) => void;
}

export function MessageBubble({ message, isOwnMessage, currentUserRole, onDeleteMessage }: MessageBubbleProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    if (onDeleteMessage) {
      onDeleteMessage(message.id);
    }
    handleMenuClose();
  };

  const getUserIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return <AdminPanelSettings />;
      case 'writer': return <Edit />;
      case 'student': return <School />;
      default: return <Person />;
    }
  };

  const getUserColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'error.main';
      case 'writer': return 'info.main';
      case 'student': return 'success.main';
      default: return 'grey.500';
    }
  };

  const canDeleteMessage = () => {
    return currentUserRole === 'admin' || isOwnMessage;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: '70%',
          display: 'flex',
          flexDirection: isOwnMessage ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          gap: 1,
        }}
      >
        <Avatar
          sx={{
            bgcolor: getUserColor(message.sender.role),
            width: 32,
            height: 32,
          }}
        >
          {getUserIcon(message.sender.role)}
        </Avatar>
        
        <Box
          sx={{
            bgcolor: isOwnMessage ? 'primary.main' : 'grey.100',
            color: isOwnMessage ? 'primary.contrastText' : 'text.primary',
            borderRadius: 2,
            p: 1.5,
            position: 'relative',
            boxShadow: 1,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {message.sender.firstName} {message.sender.lastName}
              </Typography>
              <Chip
                label={message.sender.role}
                size="small"
                variant="outlined"
                sx={{
                  height: 16,
                  fontSize: '0.6rem',
                  color: getUserColor(message.sender.role),
                  borderColor: getUserColor(message.sender.role),
                }}
              />
            </Box>
            {canDeleteMessage() && (
              <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{ ml: 1, color: 'inherit', opacity: 0.7 }}
              >
                <MoreVert sx={{ fontSize: 14 }} />
              </IconButton>
            )}
          </Box>
          
          <Typography variant="body2" sx={{ mb: 0.5, lineHeight: 1.4 }}>
            {message.content}
          </Typography>
          
          <Typography 
            variant="caption" 
            sx={{ 
              opacity: 0.8,
              display: 'block',
              textAlign: isOwnMessage ? 'right' : 'left',
              fontSize: '0.65rem',
            }}
          >
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </Typography>
        </Box>
      </Box>

      {/* Message Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: isOwnMessage ? 'left' : 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: isOwnMessage ? 'right' : 'left',
        }}
      >
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1, fontSize: 16 }} />
          Delete Message
        </MenuItem>
      </Menu>
    </Box>
  );
}