'use client';

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Alert,
  Paper,
  Skeleton,
  Tooltip,
} from '@mui/material';
import {
  GetApp,
  Delete,
  MoreVert,
  Description,
  Image,
  PictureAsPdf,
  VideoFile,
  AudioFile,
  AttachFile,
  Visibility,
  VisibilityOff,
  Person,
  Edit as EditIcon,
  School,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';

interface FilesListProps {
  files: any[];
  isLoading?: boolean;
  error?: string;
  currentUserRole?: string;
  currentUserId?: number;
  onDownload?: (fileId: number, filename: string) => void;
  onDelete?: (fileId: number) => void;
  onToggleVisibility?: (fileId: number, isPublic: boolean) => void;
  showUploader?: boolean;
}

export function FilesList({
  files = [],
  isLoading = false,
  error,
  currentUserRole,
  currentUserId,
  onDownload,
  onDelete,
  onToggleVisibility,
  showUploader = true,
}: FilesListProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, file: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedFile(file);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  const handleDownload = () => {
    if (selectedFile && onDownload) {
      onDownload(selectedFile.id, selectedFile.filename);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedFile && onDelete) {
      onDelete(selectedFile.id);
    }
    handleMenuClose();
  };

  const handleToggleVisibility = () => {
    if (selectedFile && onToggleVisibility) {
      onToggleVisibility(selectedFile.id, !selectedFile.isPublic);
    }
    handleMenuClose();
  };

  const getFileIcon = (filename: string, mimeType?: string) => {
    const ext = filename.toLowerCase().split('.').pop();
    const mime = mimeType?.toLowerCase();
    
    if (mime?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext || '')) {
      return <Image color="success" />;
    }
    if (mime === 'application/pdf' || ext === 'pdf') {
      return <PictureAsPdf color="error" />;
    }
    if (mime?.startsWith('video/') || ['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) {
      return <VideoFile color="secondary" />;
    }
    if (mime?.startsWith('audio/') || ['mp3', 'wav', 'flac', 'aac'].includes(ext || '')) {
      return <AudioFile color="warning" />;
    }
    if (mime?.includes('document') || ['doc', 'docx', 'txt', 'rtf'].includes(ext || '')) {
      return <Description color="primary" />;
    }
    
    return <AttachFile />;
  };

  const getFileTypeColor = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'requirement': return 'info';
      case 'submission': return 'success';
      case 'revision': return 'warning';
      case 'reference': return 'secondary';
      default: return 'default';
    }
  };

  const getUserIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return <AdminPanelSettings />;
      case 'writer': return <EditIcon />;
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canDelete = (file: any) => {
    return currentUserRole === 'admin' || file.uploadedBy.id === currentUserId;
  };

  const canToggleVisibility = (file: any) => {
    return currentUserRole === 'admin' || file.uploadedBy.id === currentUserId;
  };

  if (isLoading) {
    return (
      <List>
        {Array.from({ length: 3 }).map((_, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemIcon>
            <ListItemText
              primary={<Skeleton variant="text" width="60%" />}
              secondary={<Skeleton variant="text" width="40%" />}
            />
            <ListItemSecondaryAction>
              <Skeleton variant="circular" width={24} height={24} />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load files: {error}
      </Alert>
    );
  }

  if (files.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <AttachFile sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No Files Uploaded
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload files to share requirements, submissions, or reference materials.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <List>
        {files.map((file) => (
          <ListItem
            key={file.id}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              mb: 1,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon>
              {getFileIcon(file.filename, file.mimeType)}
            </ListItemIcon>
            
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {file.originalName}
                  </Typography>
                  <Chip
                    label={file.fileType}
                    size="small"
                    color={getFileTypeColor(file.fileType) as any}
                    variant="outlined"
                  />
                  {!file.isPublic && (
                    <Chip
                      label="Private"
                      size="small"
                      icon={<VisibilityOff />}
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                </Box>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {formatFileSize(file.fileSize)} • {file.mimeType}
                  </Typography>
                  {showUploader && file.uploadedBy && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Avatar
                        sx={{
                          width: 16,
                          height: 16,
                          bgcolor: getUserColor(file.uploadedBy.role),
                        }}
                      >
                        {getUserIcon(file.uploadedBy.role)}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {file.uploadedBy.firstName} {file.uploadedBy.lastName} • 
                        {formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}
                      </Typography>
                    </Box>
                  )}
                </Box>
              }
            />
            
            <ListItemSecondaryAction>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Tooltip title="Download">
                  <IconButton
                    size="small"
                    onClick={() => onDownload && onDownload(file.id, file.filename)}
                  >
                    <GetApp />
                  </IconButton>
                </Tooltip>
                
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuClick(e, file)}
                >
                  <MoreVert />
                </IconButton>
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDownload}>
          <GetApp sx={{ mr: 1 }} />
          Download
        </MenuItem>
        
        {canToggleVisibility(selectedFile) && (
          <MenuItem onClick={handleToggleVisibility}>
            {selectedFile?.isPublic ? <VisibilityOff sx={{ mr: 1 }} /> : <Visibility sx={{ mr: 1 }} />}
            Make {selectedFile?.isPublic ? 'Private' : 'Public'}
          </MenuItem>
        )}
        
        {canDelete(selectedFile) && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} />
            Delete File
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}