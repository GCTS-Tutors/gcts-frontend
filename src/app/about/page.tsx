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
  Divider,
} from '@mui/material';
import {
  School,
  Verified,
  Groups,
  Lock,
  TrendingUp,
  SupportAgent,
  MenuBook,
  EmojiObjects,
} from '@mui/icons-material';
import Link from 'next/link';

const ACCENT = '#8C59D9';

const values = [
  {
    icon: <Lock sx={{ fontSize: 40, color: ACCENT }} />,
    title: 'Confidentiality First',
    description:
      'Your identity and your work stay private. We built GCTS as a safe portal to academic understanding, with strict data protection and anonymous communication between students and experts.',
  },
  {
    icon: <Verified sx={{ fontSize: 40, color: ACCENT }} />,
    title: 'Original, Quality Work',
    description:
      'Every paper is researched and written from scratch by a qualified expert, properly cited in your required style, and checked for originality before it ever reaches you.',
  },
  {
    icon: <School sx={{ fontSize: 40, color: ACCENT }} />,
    title: 'Learning, Not Shortcuts',
    description:
      'Our model samples, tutoring, and detailed solutions are designed to deepen your understanding so you can produce stronger work on your own.',
  },
  {
    icon: <SupportAgent sx={{ fontSize: 40, color: ACCENT }} />,
    title: 'Always Supported',
    description:
      'From the moment you place an order to your final revision, our support team and your assigned expert are reachable around the clock.',
  },
];

const stats = [
  { icon: <Groups sx={{ fontSize: 36, color: ACCENT }} />, value: '10,000+', label: 'Students Assisted' },
  { icon: <MenuBook sx={{ fontSize: 36, color: ACCENT }} />, value: '25,000+', label: 'Papers Delivered' },
  { icon: <Verified sx={{ fontSize: 36, color: ACCENT }} />, value: '500+', label: 'Expert Writers' },
  { icon: <TrendingUp sx={{ fontSize: 36, color: ACCENT }} />, value: '98%', label: 'Satisfaction Rate' },
];

const steps = [
  {
    title: 'Tell us what you need',
    description:
      'Share your topic, subject, academic level, citation style, page count, and deadline. Upload any instructions or source material.',
  },
  {
    title: 'Get matched with an expert',
    description:
      'We assign a writer with proven background in your field. You can message them directly to clarify expectations as the work progresses.',
  },
  {
    title: 'Review and refine',
    description:
      'Receive your draft, request up to three free revisions if anything needs adjusting, and approve the final version with confidence.',
  },
];

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          About Grand Canyon Tutoring Services
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 760, mx: 'auto' }}>
          GCTS is a safe portal to academic understanding — connecting students with
          qualified experts for writing help, tutoring, and study resources across
          dozens of disciplines.
        </Typography>
      </Box>

      {/* Mission */}
      <Paper elevation={2} sx={{ p: { xs: 3, md: 6 }, borderRadius: 3, mb: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Our Mission
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontSize: '1.05rem' }}>
              Academic life is demanding. Between coursework, jobs, and personal
              responsibilities, even capable students run short on time. GCTS exists to
              level the playing field — giving every learner access to subject-matter
              experts, clear model work, and one-on-one guidance when they need it most.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem' }}>
              We are not a shortcut. We are a learning partner. Our goal is for every
              student who works with us to leave with a stronger grasp of their subject
              and the confidence to tackle the next challenge themselves.
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: 'rgba(140, 89, 217, 0.08)',
                border: `1px solid rgba(140, 89, 217, 0.2)`,
                textAlign: 'center',
              }}
            >
              <EmojiObjects sx={{ fontSize: 56, color: ACCENT, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                &ldquo;A safe portal to academic understanding.&rdquo;
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                The principle behind everything we build.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 8 }}>
        {stats.map((s) => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card sx={{ textAlign: 'center', py: 3, borderRadius: 3, height: '100%' }}>
              <CardContent>
                {s.icon}
                <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {s.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Values */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          What We Stand For
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 5, maxWidth: 640, mx: 'auto' }}>
          Four commitments shape how we work with every student.
        </Typography>
        <Grid container spacing={4}>
          {values.map((v) => (
            <Grid item xs={12} sm={6} key={v.title}>
              <Card sx={{ height: '100%', borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  {v.icon}
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                    {v.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {v.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* How it works */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          How GCTS Works
        </Typography>
        <Divider sx={{ mb: 5, maxWidth: 80, mx: 'auto', borderColor: ACCENT, borderWidth: 2 }} />
        <Grid container spacing={4}>
          {steps.map((step, i) => (
            <Grid item xs={12} md={4} key={step.title}>
              <Box sx={{ textAlign: 'center', px: 2 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: ACCENT,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.4rem',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {i + 1}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
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
          Ready to get started?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 560, mx: 'auto' }}>
          Browse our sample papers, explore what we offer, or place your first order in minutes.
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
          <Button component={Link} href="/services" variant="outlined" size="large" sx={{ color: ACCENT, borderColor: ACCENT }}>
            Explore Services
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
