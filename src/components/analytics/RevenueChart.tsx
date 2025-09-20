'use client';

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  data?: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
  isLoading?: boolean;
  error?: string;
  title?: string;
}

export function RevenueChart({
  data,
  isLoading = false,
  error,
  title = 'Revenue Trends',
}: RevenueChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(context.parsed.y);
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time Period',
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Revenue ($)',
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
            }).format(value);
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const defaultData = {
    labels: [],
    datasets: [],
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader title={title} />
        <CardContent>
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: '100%' }}>
              <Skeleton variant="rectangular" height={300} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader title={title} />
        <CardContent>
          <Alert severity="error">
            Failed to load chart data: {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <Card>
        <CardHeader title={title} />
        <CardContent>
          <Box sx={{ 
            height: 300, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
          }}>
            <Typography variant="h6" color="text.secondary">
              No Data Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              There's no revenue data for the selected time period.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader 
        title={title}
        subheader="Monitor revenue performance and growth"
      />
      <CardContent>
        <Box sx={{ height: 300 }}>
          <Bar data={data || defaultData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
}