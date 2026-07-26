'use client';

import { ReactNode } from 'react';
import { Card, CardContent, Box, Typography, Avatar, Skeleton } from '@mui/material';

interface StatTileProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  /** MUI palette token for the icon background, e.g. 'primary.main'. */
  color?: string;
  loading?: boolean;
}

/**
 * Compact single-metric tile used across the role dashboards.
 * Intentionally minimal — one icon, one number, one label — to keep the
 * dashboards focused on essential information.
 */
export function StatTile({ icon, label, value, color = 'primary.main', loading }: StatTileProps) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: color }}>{icon}</Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" component="div" sx={{ fontWeight: 600, lineHeight: 1.1 }}>
            {loading ? <Skeleton width={48} /> : value}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
