'use client';

import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Paper,
  Alert
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Schedule,
  Send
} from '@mui/icons-material';
import { useState } from 'react';
import { axiosInstance } from '@/lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    try {
      // The Inquiry resource stores email + message; fold name/subject into
      // the message body so the admin gets the full context.
      await axiosInstance.post('/inquiries/', {
        email: formData.email,
        message:
          `From: ${formData.name || 'Anonymous'}\n` +
          (formData.subject ? `Subject: ${formData.subject}\n\n` : '\n') +
          formData.message,
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 8000);
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message ||
          'Failed to send your message. Please try again or email us directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Have questions? We're here to help! Reach out to our support team for any assistance.
        </Typography>
      </Box>

      <Grid container spacing={6}>
        {/* Contact Form */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Send us a Message
            </Typography>

            {submitted && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Thank you for your message! We'll get back to you within 24 hours.
              </Alert>
            )}

            {submitError && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError('')}>
                {submitError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Send />}
                    sx={{ px: 4 }}
                    disabled={submitting}
                  >
                    {submitting ? 'Sending…' : 'Send Message'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[
              {
                icon: Email,
                title: 'Email Support',
                content: 'support@gcts.com',
                description: 'Get help via email'
              },
              {
                icon: Phone,
                title: 'Phone Support',
                content: '+1 (555) 123-4567',
                description: 'Call us for immediate help'
              },
              {
                icon: Schedule,
                title: 'Support Hours',
                content: '24/7 Available',
                description: 'We\'re always here to help'
              },
              {
                icon: LocationOn,
                title: 'Location',
                content: 'Grand Canyon, AZ',
                description: 'United States'
              }
            ].map((item, index) => (
              <Card key={index} elevation={1} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <item.icon />
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium' }}>
                        {item.content}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* FAQ Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Frequently Asked Questions
        </Typography>
        <Grid container spacing={3}>
          {[
            {
              question: 'How quickly can you complete my order?',
              answer: 'We offer flexible deadlines from 3 hours to 30 days. Rush orders are available for urgent assignments.'
            },
            {
              question: 'Is my personal information secure?',
              answer: 'Yes, we use advanced encryption and never share your personal information with third parties.'
            },
            {
              question: 'What if I\'m not satisfied with my paper?',
              answer: 'We offer up to 2 free revisions to ensure your paper meets all requirements and a money-back guarantee if you\'re not satisfied.'
            },
            {
              question: 'Do you provide plagiarism reports?',
              answer: 'Yes, every order comes with a free plagiarism report to ensure 100% originality.'
            }
          ].map((faq, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {faq.question}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {faq.answer}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}