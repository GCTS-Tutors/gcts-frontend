'use client';

import {
  Box,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Skeleton,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import {
  Search,
  Assignment,
  Person,
  Payment,
  Star,
  Message,
  Clear,
} from '@mui/icons-material';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import Link from 'next/link';
import { format } from 'date-fns';

interface SearchResult {
  id: number;
  type: 'order' | 'user' | 'payment' | 'review' | 'message';
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  status?: string;
}

interface GlobalSearchProps {
  placeholder?: string;
  variant?: 'outlined' | 'standard' | 'filled';
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

export function GlobalSearch({
  placeholder = 'Search orders, users, payments...',
  variant = 'outlined',
  size = 'small',
  fullWidth = true,
}: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Mock search function - in real app this would call your search API
  const performSearch = async (searchQuery: string): Promise<SearchResult[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    if (!searchQuery.trim()) return [];

    // Mock data - replace with actual API call
    const mockResults: SearchResult[] = [
      {
        id: 1,
        type: 'order',
        title: `Order #ORD-${Math.floor(Math.random() * 10000)}`,
        subtitle: 'Research Paper - Psychology',
        description: 'Academic level: Masters, Pages: 10',
        url: '/orders/1',
        status: 'in_progress',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        type: 'user',
        title: 'John Smith',
        subtitle: 'Student',
        description: 'john.smith@email.com',
        url: '/dashboard/admin/users/2',
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        type: 'payment',
        title: 'Payment #PAY-001',
        subtitle: '$150.00',
        description: 'Order #ORD-1234 - Completed',
        url: '/payments/3',
        status: 'completed',
        createdAt: new Date().toISOString(),
      },
    ].filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return mockResults;
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const searchResults = await performSearch(searchQuery);
        setResults(searchResults);
        setShowResults(true);
      } catch (err) {
        setError('Failed to search. Please try again.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setAnchorEl(event.currentTarget);
  };

  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setAnchorEl(event.currentTarget);
    if (query.trim() && results.length > 0) {
      setShowResults(true);
    }
  };

  const handleClose = () => {
    setShowResults(false);
    setAnchorEl(null);
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    handleClose();
    setQuery('');
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Assignment />;
      case 'user':
        return <Person />;
      case 'payment':
        return <Payment />;
      case 'review':
        return <Star />;
      case 'message':
        return <Message />;
      default:
        return <Search />;
    }
  };

  const getResultColor = (type: string, status?: string) => {
    switch (type) {
      case 'order':
        switch (status) {
          case 'pending': return 'warning.main';
          case 'in_progress': return 'info.main';
          case 'completed': return 'success.main';
          case 'cancelled': return 'error.main';
          default: return 'primary.main';
        }
      case 'payment':
        return status === 'completed' ? 'success.main' : 'warning.main';
      case 'user':
        return 'info.main';
      case 'review':
        return 'warning.main';
      case 'message':
        return 'primary.main';
      default:
        return 'grey.500';
    }
  };

  const formatResultType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Box sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
      <TextField
        fullWidth={fullWidth}
        variant={variant}
        size={size}
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <Clear 
                sx={{ cursor: 'pointer', fontSize: 20 }} 
                onClick={handleClearSearch}
              />
            </InputAdornment>
          ),
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={showResults}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: anchorEl?.offsetWidth || 400,
            maxWidth: 600,
            maxHeight: 500,
            overflow: 'auto',
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        {/* Loading State */}
        {isLoading && (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Searching...
            </Typography>
            {Array.from({ length: 3 }).map((_, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ p: 2 }}>
            <Alert severity="error" size="small">
              {error}
            </Alert>
          </Box>
        )}

        {/* No Results */}
        {!isLoading && !error && query.trim() && results.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Results Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try different keywords or check spelling
            </Typography>
          </Box>
        )}

        {/* Search Results */}
        {!isLoading && !error && results.length > 0 && (
          <>
            <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                {results.length} result{results.length > 1 ? 's' : ''} found
              </Typography>
            </Box>
            
            <List dense>
              {results.map((result, index) => (
                <Box key={`${result.type}-${result.id}`}>
                  <ListItem 
                    button
                    onClick={() => handleResultClick(result)}
                    sx={{
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          bgcolor: getResultColor(result.type, result.status),
                          width: 32,
                          height: 32,
                        }}
                      >
                        {getResultIcon(result.type)}
                      </Avatar>
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {result.title}
                          </Typography>
                          <Chip
                            label={formatResultType(result.type)}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.75rem' }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          {result.subtitle && (
                            <Typography variant="body2" color="text.secondary">
                              {result.subtitle}
                            </Typography>
                          )}
                          {result.description && (
                            <Typography variant="caption" color="text.secondary">
                              {result.description}
                            </Typography>
                          )}
                          {result.createdAt && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              {format(new Date(result.createdAt), 'MMM dd, yyyy')}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < results.length - 1 && <Divider />}
                </Box>
              ))}
            </List>

            {results.length >= 10 && (
              <Box sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Showing first 10 results. Use more specific keywords to narrow down.
                </Typography>
              </Box>
            )}
          </>
        )}
      </Menu>
    </Box>
  );
}