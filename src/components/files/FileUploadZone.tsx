'use client';

import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import {
  CloudUpload,
  AttachFile,
  Delete,
  Description,
  Image,
  PictureAsPdf,
  VideoFile,
  AudioFile,
} from '@mui/icons-material';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadZoneProps {
  orderId: string;
  onUploadSuccess?: (files: any[]) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  disabled?: boolean;
}

export function FileUploadZone({
  orderId,
  onUploadSuccess,
  onUploadError,
  maxFiles = 10,
  maxSize = 50,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.png', '.zip'],
  disabled = false,
}: FileUploadZoneProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileType, setFileType] = useState<'requirement' | 'submission' | 'revision' | 'reference'>('requirement');
  const [isPublic, setIsPublic] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');
    
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(({ file, errors }) => 
        `${file.name}: ${errors.map((e: any) => e.message).join(', ')}`
      );
      setError(`Some files were rejected: ${errors.join('; ')}`);
    }

    // Add accepted files
    setSelectedFiles(prev => [...prev, ...acceptedFiles].slice(0, maxFiles));
  }, [maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[getMimeType(type)] = [type];
      return acc;
    }, {} as any),
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    maxFiles: maxFiles - selectedFiles.length,
    disabled: disabled || uploading,
  });

  const getMimeType = (extension: string) => {
    const mimeTypes: { [key: string]: string } = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.zip': 'application/zip',
    };
    return mimeTypes[extension] || 'application/octet-stream';
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.toLowerCase().split('.').pop();
    switch (ext) {
      case 'pdf': return <PictureAsPdf color="error" />;
      case 'doc':
      case 'docx':
      case 'txt': return <Description color="primary" />;
      case 'jpg':
      case 'jpeg':
      case 'png': return <Image color="success" />;
      case 'mp4':
      case 'avi': return <VideoFile color="secondary" />;
      case 'mp3':
      case 'wav': return <AudioFile color="warning" />;
      default: return <AttachFile />;
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select files to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const uploadPromises = selectedFiles.map(async (file, index) => {
        // Simulate upload progress
        const progressStep = 100 / selectedFiles.length;
        setUploadProgress(prev => prev + progressStep);

        // Here you would make the actual API call
        // For now, we'll simulate the upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          id: Date.now() + index,
          filename: file.name,
          originalName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          fileType,
          isPublic,
          uploadedAt: new Date().toISOString(),
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      
      if (onUploadSuccess) {
        onUploadSuccess(uploadedFiles);
      }
      
      setSelectedFiles([]);
      setUploadProgress(100);
      
      // Reset progress after showing completion
      setTimeout(() => setUploadProgress(0), 2000);
      
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      if (onUploadError) {
        onUploadError(err.message || 'Upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      {/* Upload Configuration */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>File Type</InputLabel>
          <Select
            value={fileType}
            label="File Type"
            onChange={(e) => setFileType(e.target.value as any)}
            disabled={uploading}
          >
            <MenuItem value="requirement">Requirements</MenuItem>
            <MenuItem value="submission">Submission</MenuItem>
            <MenuItem value="revision">Revision</MenuItem>
            <MenuItem value="reference">Reference</MenuItem>
          </Select>
        </FormControl>
        
        <FormControlLabel
          control={
            <Switch
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              disabled={uploading}
            />
          }
          label="Make files public"
        />
      </Box>

      {/* Drag & Drop Zone */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          bgcolor: isDragActive ? 'primary.50' : 'grey.50',
          cursor: disabled || uploading ? 'not-allowed' : 'pointer',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          opacity: disabled || uploading ? 0.6 : 1,
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'primary.50',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          or click to browse files
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Accepted: {acceptedTypes.join(', ')} | Max size: {maxSize}MB per file | Max files: {maxFiles}
        </Typography>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Selected Files ({selectedFiles.length})
          </Typography>
          {selectedFiles.map((file, index) => (
            <Paper key={index} sx={{ p: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
              {getFileIcon(file.name)}
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" noWrap>
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(file.size)}
                </Typography>
              </Box>
              <Chip
                label={fileType}
                size="small"
                color="primary"
                variant="outlined"
              />
              <IconButton
                size="small"
                onClick={() => removeFile(index)}
                disabled={uploading}
              >
                <Delete />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}

      {/* Upload Progress */}
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom>
            Uploading files... {Math.round(uploadProgress)}%
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={uploadFiles}
            disabled={uploading}
            startIcon={<CloudUpload />}
            size="large"
          >
            {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} File${selectedFiles.length > 1 ? 's' : ''}`}
          </Button>
        </Box>
      )}
    </Box>
  );
}