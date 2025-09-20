'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  IconButton,
  Tooltip,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Info,
} from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  subtitle?: string;
  tooltip?: string;
  isLoading?: boolean;
  format?: 'number' | 'currency' | 'percentage';
}

export function MetricCard({
  title,
  value,
  previousValue,
  icon,
  color = 'primary',
  subtitle,
  tooltip,
  isLoading = false,
  format = 'number',
}: MetricCardProps) {
  const formatValue = (val: string | number, fmt: string = format) => {
    if (typeof val === 'string') return val;
    
    switch (fmt) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'number':
      default:
        return new Intl.NumberFormat('en-US').format(val);
    }
  };

  const calculateChange = () => {
    if (!previousValue || typeof value !== 'number' || typeof previousValue !== 'number') {
      return null;
    }
    
    const change = ((value - previousValue) / previousValue) * 100;
    return change;
  };

  const change = calculateChange();
  const isPositiveChange = change !== null && change > 0;
  const isNegativeChange = change !== null && change < 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
          <Skeleton variant="text" width="80%" height={32} />
          <Skeleton variant="text" width="40%" height={16} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {tooltip && (
              <Tooltip title={tooltip}>
                <IconButton size="small" sx={{ opacity: 0.7 }}>
                  <Info sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}
            {icon && (
              <Avatar
                sx={{
                  bgcolor: `${color}.main`,
                  width: 40,
                  height: 40,
                }}
              >
                {icon}
              </Avatar>
            )}
          </Box>
        </Box>

        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: 'bold',
            color: `${color}.main`,
            mb: 1,
          }}
        >
          {formatValue(value)}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          
          {change !== null && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: isPositiveChange ? 'success.main' : isNegativeChange ? 'error.main' : 'text.secondary',
              }}
            >
              {isPositiveChange && <TrendingUp sx={{ fontSize: 16 }} />}
              {isNegativeChange && <TrendingDown sx={{ fontSize: 16 }} />}
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 'medium',
                  color: 'inherit',
                }}
              >
                {Math.abs(change).toFixed(1)}%
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}