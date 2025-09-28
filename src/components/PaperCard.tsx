import {
  Paper,
  Typography,
  Box,
  Chip,
  Button
} from '@mui/material';
import Link from 'next/link';

export interface SamplePaper {
  id?: string;
  slug?: string;
  title: string;
  subject: string;
  type: string;
  level: string;
  pages: number;
  excerpt: string;
}

interface PaperCardProps {
  paper: SamplePaper;
  excerptLines?: number;
}

export function PaperCard({ paper, excerptLines = 5 }: PaperCardProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: '100%',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', lineHeight: 1.3 }}>
          {paper.title}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip
          label={paper.subject}
          size="small"
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            fontWeight: 'medium'
          }}
        />
        <Chip
          label={paper.type}
          size="small"
          variant="outlined"
          color="primary"
        />
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 3,
          lineHeight: 1.6,
          display: '-webkit-box',
          WebkitLineClamp: excerptLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '120px',
          flex: 1
        }}
      >
        {paper.excerpt}
      </Typography>

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: 1,
        borderColor: 'divider',
        pt: 2,
        mt: 'auto'
      }}>
        <Typography variant="caption" color="text.secondary">
          {paper.level} • {paper.pages} pages
        </Typography>
        <Button
          size="small"
          variant="outlined"
          component={Link}
          href={`/papers/${paper.slug || paper.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
          sx={{ fontSize: '0.75rem' }}
        >
          View Sample
        </Button>
      </Box>
    </Paper>
  );
}