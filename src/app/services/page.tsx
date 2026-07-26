'use client';

import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import {
  EditNote,
  Science,
  MenuBook,
  Slideshow,
  FactCheck,
  Calculate,
  Psychology,
  Verified,
  Schedule,
  Lock,
  Autorenew,
  SupportAgent,
} from '@mui/icons-material';
import Link from 'next/link';

const ACCENT = '#8C59D9';

const services = [
  {
    icon: <EditNote sx={{ fontSize: 40, color: ACCENT }} />,
    title: 'Essays & Academic Writing',
    description:
      'Argumentative, admission, reflective, and analytical essays crafted to your prompt, level, and citation style — fully original and ready to learn from.',
  },
  {
    icon: <Science sx={{ fontSize: 40, color: ACCENT }} />,
    title: 'Research Papers & Proposals',
    description:
      'In-depth research papers, research proposals, annotated bibliographies, and literature reviews backed by credible, properly cited sources.',
  },
  {
    icon: <MenuBook sx={{ fontSize: 40, color: ACCENT }} />,
    title: 'Theses & Dissertations',
    description:
      'Long-form support for capstone projects, theses, and dissertations — from outline and methodology through to discussion and references.',
  },
  {
    icon: <Slideshow sx={{ fontSize: 40, color: ACCENT }} />,
    title: 'Presentations & Reports',
    description:
      'PowerPoint presentations (with speaker notes), lab reports, case studies, business plans, and professional reports tailored to your audience.',
  },
  {
    icon: <FactCheck sx={{ fontSize: 40, color: ACCENT }} />,
    title: 'Editing & Proofreading',
    description:
      'Polish existing drafts for clarity, grammar, structure, and citation accuracy — without changing your voice.',
  },
  {
    icon: <Calculate sx={{ fontSize: 40, color: ACCENT }} />,
    title: 'Problem Solving & Coursework',
    description:
      'Step-by-step worked solutions for quantitative coursework, homework sets, and online assignments so you can follow the reasoning.',
  },
  {
    icon: <Psychology sx={{ fontSize: 40, color: ACCENT }} />,
    title: 'One-on-One Tutoring',
    description:
      'Personalized tutoring and study coaching to strengthen your understanding of difficult topics before exams and submissions.',
  },
  {
    icon: <MenuBook sx={{ fontSize: 40, color: ACCENT }} />,
    title: 'Sample Paper Library',
    description:
      'Browse our growing library of model papers to see how strong academic work is structured, argued, and referenced.',
  },
];

const subjects = [
  'Nursing', 'Psychology', 'Sociology', 'Healthcare', 'Business', 'Management',
  'Engineering', 'Education', 'Law', 'History', 'Literature', 'Biology',
  'Chemistry', 'Physics', 'Mathematics', 'Computer Science', 'Information Technology',
  'Economics', 'Finance', 'Accounting', 'Marketing', 'Political Science',
  'Philosophy', 'Religion', 'Arts', 'Architecture', 'Linguistics', 'and more',
];

const levels = ['College', "Bachelor's", "Master's", 'Doctorate'];
const styles = ['APA (6th & 7th)', 'MLA', 'Chicago/Turabian', 'Harvard', 'IEEE'];

const guarantees = [
  { icon: <Verified sx={{ color: ACCENT }} />, title: 'Original Work', text: 'Written from scratch and checked for originality.' },
  { icon: <Autorenew sx={{ color: ACCENT }} />, title: 'Free Revisions', text: 'Up to three rounds of revisions on every order.' },
  { icon: <Schedule sx={{ color: ACCENT }} />, title: 'On-Time Delivery', text: 'Deadlines from urgent turnarounds to long projects.' },
  { icon: <Lock sx={{ color: ACCENT }} />, title: 'Confidential', text: 'Private accounts and anonymous communication.' },
  { icon: <SupportAgent sx={{ color: ACCENT }} />, title: '24/7 Support', text: 'Reach your expert and our team anytime.' },
];

export default function ServicesPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Our Services
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 760, mx: 'auto' }}>
          Whatever the assignment, GCTS pairs you with a qualified expert and gives you
          the model work, guidance, and support to understand it — across every academic
          level and citation style.
        </Typography>
      </Box>

      {/* Service cards */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {services.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.title}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                {s.icon}
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                  {s.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Subjects */}
      <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Subjects We Cover
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Our experts span the humanities, sciences, business, and technical
          disciplines. A selection of what we support:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {subjects.map((subject) => (
            <Chip
              key={subject}
              label={subject}
              sx={{
                bgcolor: 'rgba(140, 89, 217, 0.08)',
                color: 'text.primary',
                fontWeight: 500,
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Levels + styles */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Academic Levels
            </Typography>
            <Divider sx={{ mb: 2, maxWidth: 60, borderColor: ACCENT, borderWidth: 2 }} />
            {levels.map((l) => (
              <Typography key={l} variant="body1" sx={{ py: 0.5 }}>
                • {l}
              </Typography>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Citation Styles
            </Typography>
            <Divider sx={{ mb: 2, maxWidth: 60, borderColor: ACCENT, borderWidth: 2 }} />
            {styles.map((st) => (
              <Typography key={st} variant="body1" sx={{ py: 0.5 }}>
                • {st}
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Guarantees */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Every Order Includes
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 5 }}>
          Standards we hold ourselves to on every single project.
        </Typography>
        <Grid container spacing={3}>
          {guarantees.map((g) => (
            <Grid item xs={12} sm={6} md={4} key={g.title}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', p: 2 }}>
                <Box sx={{ mt: 0.5 }}>{g.icon}</Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {g.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {g.text}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 3,
          textAlign: 'center',
          bgcolor: 'rgba(140, 89, 217, 0.08)',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Find the help that fits your assignment
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 560, mx: 'auto' }}>
          Place an order with your details and deadline, and we&apos;ll match you with the right expert.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/order/place"
            variant="contained"
            size="large"
            sx={{ bgcolor: ACCENT, '&:hover': { bgcolor: '#7a47c4' } }}
          >
            Place an Order
          </Button>
          <Button component={Link} href="/papers" variant="outlined" size="large" sx={{ color: ACCENT, borderColor: ACCENT }}>
            Browse Sample Papers
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
