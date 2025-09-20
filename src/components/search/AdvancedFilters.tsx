'use client';

import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Collapse,
  IconButton,
  Autocomplete,
  Switch,
  FormControlLabel,
  Slider,
  Divider,
} from '@mui/material';
import {
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
  Search,
  Refresh,
} from '@mui/icons-material';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface FilterValue {
  key: string;
  value: any;
  label: string;
}

interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'text' | 'date' | 'daterange' | 'number' | 'range' | 'boolean';
  options?: { value: any; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

interface AdvancedFiltersProps {
  title?: string;
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (filters: Record<string, any>) => void;
  onApply: () => void;
  onReset: () => void;
  isLoading?: boolean;
  showApplyButton?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export function AdvancedFilters({
  title = 'Advanced Filters',
  filters,
  values,
  onChange,
  onApply,
  onReset,
  isLoading = false,
  showApplyButton = true,
  collapsible = true,
  defaultExpanded = false,
}: AdvancedFiltersProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: values.dateFrom ? new Date(values.dateFrom) : null,
    to: values.dateTo ? new Date(values.dateTo) : null,
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...values, [key]: value };
    
    // Handle date range specially
    if (key === 'dateFrom' || key === 'dateTo') {
      if (key === 'dateFrom') {
        setDateRange(prev => ({ ...prev, from: value }));
        newFilters.dateFrom = value?.toISOString();
      } else {
        setDateRange(prev => ({ ...prev, to: value }));
        newFilters.dateTo = value?.toISOString();
      }
    }
    
    onChange(newFilters);
  };

  const handleReset = () => {
    setDateRange({ from: null, to: null });
    onReset();
  };

  const getActiveFiltersCount = () => {
    return Object.entries(values).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'boolean') return value;
      return value !== null && value !== undefined && value !== '';
    }).length;
  };

  const getActiveFilters = (): FilterValue[] => {
    const activeFilters: FilterValue[] = [];
    
    Object.entries(values).forEach(([key, value]) => {
      const filterConfig = filters.find(f => f.key === key);
      if (!filterConfig) return;
      
      if (Array.isArray(value) && value.length > 0) {
        value.forEach(v => {
          const option = filterConfig.options?.find(opt => opt.value === v);
          activeFilters.push({
            key: `${key}-${v}`,
            value: v,
            label: `${filterConfig.label}: ${option?.label || v}`,
          });
        });
      } else if (value !== null && value !== undefined && value !== '' && 
                 (typeof value !== 'string' || value.trim() !== '')) {
        let displayValue = value;
        
        if (filterConfig.type === 'select') {
          const option = filterConfig.options?.find(opt => opt.value === value);
          displayValue = option?.label || value;
        } else if (filterConfig.type === 'date') {
          displayValue = new Date(value).toLocaleDateString();
        } else if (typeof value === 'boolean') {
          displayValue = value ? 'Yes' : 'No';
        }
        
        activeFilters.push({
          key,
          value,
          label: `${filterConfig.label}: ${displayValue}`,
        });
      }
    });
    
    return activeFilters;
  };

  const handleRemoveFilter = (filterKey: string) => {
    if (filterKey.includes('-')) {
      // Handle multiselect item removal
      const [key, valueToRemove] = filterKey.split('-', 2);
      const currentValues = values[key] || [];
      const newValues = currentValues.filter((v: any) => v !== valueToRemove);
      handleFilterChange(key, newValues);
    } else {
      // Handle regular filter removal
      const defaultValue = filters.find(f => f.key === filterKey)?.type === 'multiselect' ? [] : '';
      handleFilterChange(filterKey, defaultValue);
    }
  };

  const renderFilter = (filter: FilterConfig) => {
    const currentValue = values[filter.key];
    
    switch (filter.type) {
      case 'select':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{filter.label}</InputLabel>
            <Select
              value={currentValue || ''}
              label={filter.label}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {filter.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'multiselect':
        return (
          <Autocomplete
            multiple
            size="small"
            options={filter.options || []}
            getOptionLabel={(option) => option.label}
            value={filter.options?.filter(opt => (currentValue || []).includes(opt.value)) || []}
            onChange={(_, newValue) => {
              handleFilterChange(filter.key, newValue.map(v => v.value));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={filter.label}
                placeholder={filter.placeholder}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option.label}
                  size="small"
                  {...getTagProps({ index })}
                  key={option.value}
                />
              ))
            }
          />
        );

      case 'text':
        return (
          <TextField
            fullWidth
            size="small"
            label={filter.label}
            placeholder={filter.placeholder}
            value={currentValue || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
          />
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={filter.label}
              value={currentValue ? new Date(currentValue) : null}
              onChange={(date) => handleFilterChange(filter.key, date)}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
          </LocalizationProvider>
        );

      case 'daterange':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <DatePicker
                  label="From"
                  value={dateRange.from}
                  onChange={(date) => handleFilterChange('dateFrom', date)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="To"
                  value={dateRange.to}
                  onChange={(date) => handleFilterChange('dateTo', date)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        );

      case 'number':
        return (
          <TextField
            fullWidth
            size="small"
            type="number"
            label={filter.label}
            placeholder={filter.placeholder}
            value={currentValue || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            inputProps={{
              min: filter.min,
              max: filter.max,
              step: filter.step,
            }}
          />
        );

      case 'range':
        return (
          <Box sx={{ px: 1 }}>
            <Typography variant="body2" gutterBottom>
              {filter.label}
            </Typography>
            <Slider
              value={currentValue || [filter.min || 0, filter.max || 100]}
              onChange={(_, value) => handleFilterChange(filter.key, value)}
              valueLabelDisplay="auto"
              min={filter.min}
              max={filter.max}
              step={filter.step}
              marks={[
                { value: filter.min || 0, label: filter.min?.toString() || '0' },
                { value: filter.max || 100, label: filter.max?.toString() || '100' },
              ]}
            />
          </Box>
        );

      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={currentValue || false}
                onChange={(e) => handleFilterChange(filter.key, e.target.checked)}
              />
            }
            label={filter.label}
          />
        );

      default:
        return null;
    }
  };

  const activeFilters = getActiveFilters();
  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Filter Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList />
          <Typography variant="h6">
            {title}
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} active`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            size="small"
            startIcon={<Clear />}
            onClick={handleReset}
            disabled={activeFiltersCount === 0}
          >
            Reset
          </Button>
          
          {collapsible && (
            <IconButton
              onClick={() => setExpanded(!expanded)}
              size="small"
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Active Filters:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {activeFilters.map((filter) => (
              <Chip
                key={filter.key}
                label={filter.label}
                size="small"
                onDelete={() => handleRemoveFilter(filter.key)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
          <Divider sx={{ mt: 2 }} />
        </Box>
      )}

      {/* Filter Controls */}
      <Collapse in={!collapsible || expanded}>
        <Grid container spacing={2}>
          {filters.map((filter) => (
            <Grid item xs={12} sm={6} md={4} key={filter.key}>
              {renderFilter(filter)}
            </Grid>
          ))}
        </Grid>

        {/* Action Buttons */}
        {showApplyButton && (
          <Box sx={{ display: 'flex', gap: 1, mt: 3, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={onReset}
              disabled={activeFiltersCount === 0}
            >
              Reset All
            </Button>
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={onApply}
              disabled={isLoading}
            >
              {isLoading ? 'Applying...' : 'Apply Filters'}
            </Button>
          </Box>
        )}
      </Collapse>
    </Paper>
  );
}