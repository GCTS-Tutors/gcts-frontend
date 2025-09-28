'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, FormLabel, FormHelperText, Paper } from '@mui/material';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Import Quill CSS (we'll need to add this to the global styles)
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  helperText?: string;
  error?: boolean;
  required?: boolean;
  placeholder?: string;
  height?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  label,
  helperText,
  error = false,
  required = false,
  placeholder = 'Write your content here...',
  height = '300px',
  disabled = false,
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Quill configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  // Don't render on server side
  if (!mounted) {
    return (
      <Box>
        {label && (
          <FormLabel
            component="legend"
            required={required}
            error={error}
            sx={{ mb: 1, display: 'block' }}
          >
            {label}
          </FormLabel>
        )}
        <Paper
          variant="outlined"
          sx={{
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.50'
          }}
        >
          Loading editor...
        </Paper>
        {helperText && (
          <FormHelperText error={error}>{helperText}</FormHelperText>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      {label && (
        <FormLabel
          component="legend"
          required={required}
          error={error}
          sx={{ mb: 1, display: 'block' }}
        >
          {label}
        </FormLabel>
      )}

      <Box
        sx={{
          '& .ql-container': {
            minHeight: height,
            fontSize: '14px',
          },
          '& .ql-toolbar': {
            borderTop: error ? '1px solid' : '1px solid #ccc',
            borderLeft: error ? '1px solid' : '1px solid #ccc',
            borderRight: error ? '1px solid' : '1px solid #ccc',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            borderColor: error ? 'error.main' : 'divider',
          },
          '& .ql-container.ql-snow': {
            borderBottom: error ? '1px solid' : '1px solid #ccc',
            borderLeft: error ? '1px solid' : '1px solid #ccc',
            borderRight: error ? '1px solid' : '1px solid #ccc',
            borderBottomLeftRadius: '4px',
            borderBottomRightRadius: '4px',
            borderColor: error ? 'error.main' : 'divider',
          },
          '& .ql-editor': {
            minHeight: height,
            fontFamily: 'inherit',
          },
          '& .ql-editor.ql-blank::before': {
            color: 'text.secondary',
            fontStyle: 'normal',
            left: '15px',
          },
        }}
      >
        <ReactQuill
          ref={quillRef}
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          readOnly={disabled}
          theme="snow"
        />
      </Box>

      {helperText && (
        <FormHelperText error={error}>{helperText}</FormHelperText>
      )}
    </Box>
  );
}