import {
  Container,
  Box,
  Skeleton,
  Paper,
  Divider
} from '@mui/material';

export default function PaperDetailsSkeleton() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs skeleton */}
      <Skeleton variant="text" width={300} height={30} sx={{ mb: 3 }} />

      {/* Back button */}
      <Skeleton variant="rectangular" width={100} height={36} sx={{ mb: 4, borderRadius: 1 }} />

      {/* Title */}
      <Skeleton variant="text" width="80%" height={48} sx={{ mb: 3 }} />

      {/* Chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
        <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 2 }} />
      </Box>

      {/* Paper info */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Skeleton variant="text" width={150} height={24} />
          <Skeleton variant="text" width={100} height={24} />
          <Skeleton variant="text" width={120} height={24} />
        </Box>
      </Paper>

      {/* Keywords */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={100} height={28} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Paper content */}
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        <Skeleton variant="text" width={200} height={36} sx={{ mb: 3 }} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="90%" sx={{ mb: 3 }} />

        <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="95%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="85%" sx={{ mb: 3 }} />

        <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="75%" />
      </Paper>
    </Container>
  );
}