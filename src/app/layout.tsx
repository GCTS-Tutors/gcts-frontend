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
  title: 'GCTS - Grand Canyon Tutoring Services',
  description: 'Professional academic tutoring and assignment services',
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