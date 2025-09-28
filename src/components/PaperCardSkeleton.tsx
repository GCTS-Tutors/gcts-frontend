import { Card, CardContent, CardActions, Skeleton, Box } from '@mui/material';

export default function PaperCardSkeleton() {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="rectangular" width={60} height={24} />
          <Skeleton variant="rectangular" width={100} height={24} />
        </Box>
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="70%" />
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Skeleton variant="rectangular" width={120} height={36} />
      </CardActions>
    </Card>
  );
}