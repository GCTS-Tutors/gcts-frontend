'use client';

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Skeleton,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Circle } from '@mui/icons-material';

ChartJS.register(ArcElement, Tooltip, Legend);

interface OrderStatusPieChartProps {
  data?: { [key: string]: number };
  isLoading?: boolean;
  error?: string;
  title?: string;
}

export function OrderStatusPieChart({
  data,
  isLoading = false,
  error,
  title = 'Orders by Status',
}: OrderStatusPieChartProps) {
  const statusColors: { [key: string]: string } = {
    pending: '#ff9800',
    in_progress: '#2196f3',
    completed: '#4caf50',
    cancelled: '#f44336',
    revision: '#9c27b0',
  };

  const statusLabels: { [key: string]: string } = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    revision: 'Revision',
  };

  const prepareChartData = () => {
    if (!data) return { labels: [], datasets: [] };

    const labels = Object.keys(data).map(key => statusLabels[key] || key);
    const values = Object.values(data);
    const colors = Object.keys(data).map(key => statusColors[key] || '#757575');

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: colors.map(color => color),
          borderWidth: 2,
          hoverBorderWidth: 3,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We'll create a custom legend
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '60%',
  };

  const getTotalOrders = () => {
    if (!data) return 0;
    return Object.values(data).reduce((acc, val) => acc + val, 0);
  };

  const getPercentage = (value: number) => {
    const total = getTotalOrders();
    return total > 0 ? ((value / total) * 100).toFixed(1) : '0';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader title={title} />
        <CardContent>
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: '100%' }}>
              <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto' }} />
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

  if (!data || Object.keys(data).length === 0) {
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
              There are no orders to display status distribution.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const chartData = prepareChartData();
  const totalOrders = getTotalOrders();

  return (
    <Card>
      <CardHeader 
        title={title}
        subheader="Distribution of orders by current status"
      />
      <CardContent>
        <Box sx={{ display: 'flex', gap: 3, height: 300 }}>
          {/* Chart */}
          <Box sx={{ flex: '0 0 200px', position: 'relative' }}>
            <Doughnut data={chartData} options={options} />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}
            >
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {totalOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Orders
              </Typography>
            </Box>
          </Box>

          {/* Custom Legend */}
          <Box sx={{ flex: 1 }}>
            <List dense>
              {Object.entries(data).map(([status, count]) => (
                <ListItem key={status} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Circle 
                      sx={{ 
                        color: statusColors[status] || '#757575',
                        fontSize: 16,
                      }} 
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">
                          {statusLabels[status] || status}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {count}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({getPercentage(count)}%)
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}