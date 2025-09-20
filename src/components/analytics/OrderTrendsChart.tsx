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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface OrderTrendsChartProps {
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

export function OrderTrendsChart({
  data,
  isLoading = false,
  error,
  title = 'Order Trends',
}: OrderTrendsChartProps) {
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
          text: 'Number of Orders',
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        tension: 0.4,
      },
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
              There's no order data for the selected time period.
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
        subheader="Track order volume and trends over time"
      />
      <CardContent>
        <Box sx={{ height: 300 }}>
          <Line data={data || defaultData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
}