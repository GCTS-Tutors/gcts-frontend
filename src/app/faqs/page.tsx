'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import { ExpandMore, Search } from '@mui/icons-material';
import Link from 'next/link';

const ACCENT = '#8C59D9';

const faqs = [
  {
    category: 'Getting Started',
    q: 'How do I place an order?',
    a: 'Create a free account, then go to "Place an Order". Tell us your topic, subject, academic level, citation style, page count, and deadline, and upload any instructions or source files. You can review the details and confirm before anything is assigned.',
  },
  {
    category: 'Getting Started',
    q: 'Do I need an account to use GCTS?',
    a: 'You can browse our sample papers and public reviews without an account. To place an order, message your expert, track progress, and download completed work, you will need to register — it only takes a minute.',
  },
  {
    category: 'Orders & Experts',
    q: 'Who will work on my assignment?',
    a: 'We match each order to an expert with a proven background in the relevant subject and academic level. Once assigned, you can communicate with them directly through the order page to clarify expectations.',
  },
  {
    category: 'Orders & Experts',
    q: 'What subjects and assignment types do you cover?',
    a: 'We support dozens of disciplines — from nursing, business, and law to computer science, engineering, and the humanities — and most assignment types, including essays, research papers, case studies, lab reports, presentations, theses, and problem sets. See our Services page for the full picture.',
  },
  {
    category: 'Orders & Experts',
    q: 'Can I communicate with my expert during the order?',
    a: 'Yes. Every order has a private messaging thread so you can share clarifications, answer questions, and exchange files with your assigned expert while the work is in progress.',
  },
  {
    category: 'Quality & Originality',
    q: 'Is the work original and plagiarism-free?',
    a: 'Always. Every piece is written from scratch to your specific instructions, cited in your required style, and checked for originality before delivery. We never resell or reuse completed work.',
  },
  {
    category: 'Quality & Originality',
    q: 'How should I use the work you deliver?',
    a: 'Our papers and worked solutions are model references intended to guide your own learning and writing. We encourage you to study them, follow the reasoning and structure, and use them in line with your institution’s academic integrity policies.',
  },
  {
    category: 'Revisions & Refunds',
    q: 'What if I need changes after delivery?',
    a: 'Every order includes up to three free revisions. If the delivered work does not match the original instructions, request a revision from the order page and your expert will adjust it.',
  },
  {
    category: 'Revisions & Refunds',
    q: 'Can I get a refund?',
    a: 'If we cannot fulfill your order to the agreed instructions, you may be eligible for a partial or full refund depending on the stage of the work. Contact our support team and we will review your case fairly and promptly.',
  },
  {
    category: 'Deadlines',
    q: 'How fast can you deliver?',
    a: 'Turnaround depends on the length and complexity of the assignment. You set the deadline and urgency when ordering, and we confirm whether it can be met before work begins. We treat your deadline as firm.',
  },
  {
    category: 'Payments',
    q: 'How does payment work?',
    a: 'Pricing is based on your academic level, page count, and deadline. You review the price before confirming, and orders can be tracked through pending, partially paid, and paid states from your dashboard.',
  },
  {
    category: 'Privacy',
    q: 'Is my information confidential?',
    a: 'Yes. GCTS is built as a safe portal to academic understanding. Your personal details are protected, communication with experts is anonymous, and we never share your information with third parties.',
  },
];

export default function FaqsPage() {
  const [query, setQuery] = useState('');

  const filtered = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(query.toLowerCase()) ||
      f.a.toLowerCase().includes(query.toLowerCase()) ||
      f.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Hero */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto' }}>
          Everything you need to know about ordering, quality, revisions, and privacy at GCTS.
        </Typography>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search questions..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      {/* FAQ list */}
      {filtered.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ py: 6 }}>
          No questions matched your search. Try a different term, or contact our support team.
        </Typography>
      ) : (
        filtered.map((f, i) => (
          <Accordion key={i} disableGutters sx={{ mb: 1.5, borderRadius: 2, '&:before': { display: 'none' } }} elevation={1}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box>
                <Typography variant="caption" sx={{ color: ACCENT, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {f.category}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {f.q}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                {f.a}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      )}

      {/* CTA */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, textAlign: 'center', mt: 6, bgcolor: 'rgba(140, 89, 217, 0.08)' }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Still have a question?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Our support team is available around the clock to help.
        </Typography>
        <Button
          component={Link}
          href="/contact"
          variant="contained"
          size="large"
          sx={{ bgcolor: ACCENT, '&:hover': { bgcolor: '#7a47c4' } }}
        >
          Contact Support
        </Button>
      </Paper>
    </Container>
  );
}
