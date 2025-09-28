import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { StoreProvider } from '@/components/providers/StoreProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Box } from '@mui/material';

export const metadata: Metadata = {
  title: 'GCTS - Grand Canyon Tutoring Services | Expert Academic Writing & Tutoring',
  description: 'Get professional academic writing help, tutoring, and assignment services from PhD-qualified experts. 24/7 support, plagiarism-free papers, and up to 2 free revisions. Trusted by 10,000+ students worldwide.',
  keywords: 'academic writing, tutoring services, essay help, research papers, assignment help, professional writers, academic support, college tutoring, university help, paper writing service',
  authors: [{ name: 'GCTS Team' }],
  creator: 'Grand Canyon Tutoring Services',
  publisher: 'GCTS',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gcts.com',
    title: 'GCTS - Expert Academic Writing & Tutoring Services',
    description: 'Professional academic writing help and tutoring services from PhD-qualified experts. Join 10,000+ satisfied students.',
    siteName: 'Grand Canyon Tutoring Services',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GCTS - Academic Writing and Tutoring Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GCTS - Expert Academic Writing & Tutoring',
    description: 'Professional academic writing help from PhD experts. 24/7 support, plagiarism-free papers.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <ThemeProvider>
            <AuthProvider>
              <ErrorBoundary>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                  }}
                >
                  <Navbar />
                  <Box component="main" sx={{ flexGrow: 1 }}>
                    <ErrorBoundary>
                      {children}
                    </ErrorBoundary>
                  </Box>
                  <Footer />
                </Box>
              </ErrorBoundary>
            </AuthProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}