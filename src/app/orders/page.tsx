'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Menu,
  Tooltip,
  Fab,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Sort,
  ViewList,
  ViewModule,
  Refresh,
} from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { OrderCard } from '@/components/orders/OrderCard';
import { OrderTable } from '@/components/orders/OrderTable';
import { useGetOrdersQuery } from '@/store/api/orderApi';
import { useSearchOrdersQuery } from '@/store/api/searchApi';
import { AdvancedFilters } from '@/components/search/AdvancedFilters';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`orders-tabpanel-${index}`}
      aria-labelledby={`orders-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function OrdersPage() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('-created_at');
  const [page, setPage] = useState(1);
  const [useAdvancedSearch, setUseAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    query: '',
    status: [],
    academicLevel: [],
    paperType: [],
    dateFrom: '',
    dateTo: '',
    sortBy: '-created_at',
    sortOrder: 'desc',
  });

  // Get appropriate filters based on user role and tab
  const getFilters = () => {
    const baseFilters: any = {
      search: searchTerm || undefined,
      status: statusFilter !== 'all' ? [statusFilter] : undefined,
    };

    if (user?.role === 'student') {
      // myOrders filter is now handled by backend queryset filtering
    } else if (user?.role === 'writer') {
      switch (tabValue) {
        case 0: // My Orders (Assigned)
          baseFilters.assignedToMe = true;
          break;
        case 1: // Available Orders
          baseFilters.status = ['pending'];
          delete baseFilters.assignedToMe;
          break;
        case 2: // All Orders (Writers can see all for bidding)
          delete baseFilters.assignedToMe;
          break;
      }
    }
    // Admin users see all orders by default

    return baseFilters;
  };

  // Advanced search query
  const { data: searchResponse, isLoading: searchLoading, error: searchError } = useSearchOrdersQuery({
    ...advancedFilters,
    page,
    pageSize: 12,
  }, {
    skip: !useAdvancedSearch,
  });

  // Regular query for basic search
  const { data: ordersResponse, isLoading, error, refetch } = useGetOrdersQuery({
    page,
    page_size: 12,
    ordering: sortBy.replace('createdAt', 'created_at').replace('orderType', 'type'),
    filters: getFilters(),
  }, {
    skip: useAdvancedSearch,
  });

  // Use appropriate data source
  const currentData = useAdvancedSearch ? searchResponse : ordersResponse;
  const currentLoading = useAdvancedSearch ? searchLoading : isLoading;
  const currentError = useAdvancedSearch ? searchError : error;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(1); // Reset page when changing tabs
  };

  const handleRefresh = () => {
    if (useAdvancedSearch) {
      // Refetch advanced search
      // searchResponse will be refetched automatically
    } else {
      refetch();
    }
  };

  const advancedFilterConfig = [
    {
      key: 'query',
      label: 'Search Terms',
      type: 'text' as const,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'multiselect' as const,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'revision', label: 'Under Revision' },
      ],
    },
    {
      key: 'academicLevel',
      label: 'Academic Level',
      type: 'multiselect' as const,
      options: [
        { value: 'college', label: 'College' },
        { value: 'bachelors', label: 'Bachelor\'s' },
        { value: 'masters', label: 'Master\'s' },
        { value: 'phd', label: 'PhD' },
      ],
    },
    {
      key: 'paperType',
      label: 'Paper Type',
      type: 'multiselect' as const,
      options: [
        { value: 'essay', label: 'Essay' },
        { value: 'research paper', label: 'Research Paper' },
        { value: 'thesis', label: 'Thesis' },
        { value: 'dissertation', label: 'Dissertation' },
        { value: 'case study', label: 'Case Study' },
        { value: 'lab report', label: 'Lab Report' },
      ],
    },
    {
      key: 'daterange',
      label: 'Date Range',
      type: 'daterange' as const,
    },
  ];

  const handleAdvancedFiltersChange = (filters: Record<string, any>) => {
    setAdvancedFilters({ ...advancedFilters, ...filters });
  };

  const handleApplyAdvancedFilters = () => {
    setUseAdvancedSearch(true);
    setPage(1);
  };

  const handleResetAdvancedFilters = () => {
    setAdvancedFilters({
      query: '',
      status: [],
      academicLevel: [],
      paperType: [],
      dateFrom: '',
      dateTo: '',
      sortBy: '-created_at',
      sortOrder: 'desc',
    });
    setUseAdvancedSearch(false);
    setPage(1);
  };

  const getPageTitle = () => {
    if (user?.role === 'student') return 'My Orders';
    if (user?.role === 'writer') {
      switch (tabValue) {
        case 0: return 'My Assigned Orders';
        case 1: return 'Available Orders';
        case 2: return 'All Orders';
        default: return 'Orders';
      }
    }
    return 'Order Management';
  };

  const getTabLabels = () => {
    if (user?.role === 'student') {
      return ['All Orders', 'Active', 'Completed', 'Cancelled'];
    }
    if (user?.role === 'writer') {
      return ['Assigned to Me', 'Available Orders', 'All Orders'];
    }
    return ['All Orders', 'Pending', 'In Progress', 'Completed'];
  };

  const canCreateOrder = user?.role === 'student';

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            {getPageTitle()}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {user?.role === 'admin' 
              ? 'Manage all orders in the system'
              : user?.role === 'writer'
              ? 'View and manage your writing assignments'
              : 'Track your academic writing orders'
            }
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Toggle View">
            <IconButton onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}>
              {viewMode === 'grid' ? <ViewList /> : <ViewModule />}
            </IconButton>
          </Tooltip>

          {canCreateOrder && (
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              component={Link}
              href="/order/place"
            >
              New Order
            </Button>
          )}
        </Box>
      </Box>

      {/* Advanced Search and Filters */}
      <AdvancedFilters
        title="Order Search & Filters"
        filters={advancedFilterConfig}
        values={advancedFilters}
        onChange={handleAdvancedFiltersChange}
        onApply={handleApplyAdvancedFilters}
        onReset={handleResetAdvancedFilters}
        isLoading={currentLoading}
        showApplyButton={true}
        collapsible={true}
        defaultExpanded={useAdvancedSearch}
      />

      {/* Basic Search (fallback) */}
      {!useAdvancedSearch && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="revision">Revision</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="-created_at">Newest First</MenuItem>
                  <MenuItem value="created_at">Oldest First</MenuItem>
                  <MenuItem value="-deadline">Deadline (Soon)</MenuItem>
                  <MenuItem value="deadline">Deadline (Later)</MenuItem>
                  <MenuItem value="-price">Price (High)</MenuItem>
                  <MenuItem value="price">Price (Low)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  onClick={() => setUseAdvancedSearch(true)}
                >
                  Advanced Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Tabs for Role-based Views */}
      {(user?.role === 'writer' || user?.role === 'admin') && (
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="order tabs"
            variant="fullWidth"
          >
            {getTabLabels().map((label, index) => (
              <Tab key={index} label={label} />
            ))}
          </Tabs>
        </Paper>
      )}

      {/* Orders Content */}
      <TabPanel value={tabValue} index={tabValue}>
        {viewMode === 'grid' ? (
          <OrderCard 
            orders={currentData?.results || []} 
            isLoading={currentLoading}
            userRole={user?.role}
            onPageChange={setPage}
            currentPage={page}
            totalCount={currentData?.count || 0}
          />
        ) : (
          <OrderTable 
            orders={currentData?.results || []} 
            isLoading={currentLoading}
            userRole={user?.role}
            onPageChange={setPage}
            currentPage={page}
            totalCount={currentData?.count || 0}
          />
        )}
      </TabPanel>


      {/* Floating Action Button for Mobile */}
      {canCreateOrder && (
        <Fab
          color="primary"
          aria-label="add order"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: { xs: 'flex', md: 'none' },
          }}
          component={Link}
          href="/order/place"
        >
          <Add />
        </Fab>
      )}
    </Container>
  );
}

export default function OrdersPageWithAuth() {
  return (
    <PrivateRoute>
      <OrdersPage />
    </PrivateRoute>
  );
}