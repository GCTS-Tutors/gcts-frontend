import {
  Card,
  CardContent,
  Box,
  Skeleton
} from '@mui/material';

export function ReviewCardSkeleton() {
  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        p: 3,
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Rating Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="rectangular" width={100} height={20} sx={{ borderRadius: 1 }} />
          <Skeleton variant="text" width={30} height={20} sx={{ ml: 1 }} />
        </Box>

        {/* Order Type Chip Skeleton */}
        <Skeleton variant="rectangular" width={120} height={24} sx={{ borderRadius: 12, mb: 2 }} />

        {/* Review Text Skeleton */}
        <Box sx={{ mb: 3, minHeight: '120px' }}>
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="95%" height={20} />
          <Skeleton variant="text" width="88%" height={20} />
          <Skeleton variant="text" width="76%" height={20} />
        </Box>

        {/* Subject and Date Skeleton */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: 1,
          borderColor: 'divider',
          pt: 2
        }}>
          <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 12 }} />
          <Skeleton variant="text" width={60} height={16} />
        </Box>
      </CardContent>
    </Card>
  );
}