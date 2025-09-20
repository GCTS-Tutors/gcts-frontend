'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  IconButton,
  Autocomplete,
} from '@mui/material';
import {
  Close,
  ExpandMore,
  Clear,
} from '@mui/icons-material';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface OrderFiltersProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export function OrderFilters({ open, onClose, onApplyFilters }: OrderFiltersProps) {
  const [filters, setFilters] = useState({
    orderType: [],
    academicLevel: [],
    subject: [],
    priority: [],
    priceRange: [0, 1000],
    pageRange: [1, 50],
    createdAfter: null,
    createdBefore: null,
    dueAfter: null,
    dueBefore: null,
    assignedTo: '',
    hasAttachments: '',
    hasComments: '',
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleArrayFilterChange = (key: string, value: string) => {
    setFilters(prev => {
      const currentArray = prev[key as keyof typeof prev] as string[];
      return {
        ...prev,
        [key]: currentArray.includes(value)
          ? currentArray.filter((item: string) => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const handleClearAll = () => {
    setFilters({
      orderType: [],
      academicLevel: [],
      subject: [],
      priority: [],
      priceRange: [0, 1000],
      pageRange: [1, 50],
      createdAfter: null,
      createdBefore: null,
      dueAfter: null,
      dueBefore: null,
      assignedTo: '',
      hasAttachments: '',
      hasComments: '',
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const orderTypes = [
    'Essay',
    'Research Paper',
    'Dissertation',
    'Thesis',
    'Assignment',
    'Case Study',
    'Lab Report',
    'Book Review',
    'Article Review',
    'Presentation',
  ];

  const academicLevels = [
    'High School',
    'Undergraduate',
    'Graduate',
    'Masters',
    'PhD',
    'Professional',
  ];

  const subjects = [
    'English Literature',
    'History',
    'Psychology',
    'Business',
    'Computer Science',
    'Mathematics',
    'Biology',
    'Chemistry',
    'Physics',
    'Economics',
    'Sociology',
    'Philosophy',
    'Political Science',
    'Law',
    'Medicine',
    'Engineering',
    'Art',
    'Music',
    'Other',
  ];

  const priorities = [
    'Standard',
    'Urgent',
    'Very Urgent',
  ];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.orderType.length > 0) count++;
    if (filters.academicLevel.length > 0) count++;
    if (filters.subject.length > 0) count++;
    if (filters.priority.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.pageRange[0] > 1 || filters.pageRange[1] < 50) count++;
    if (filters.createdAfter || filters.createdBefore) count++;
    if (filters.dueAfter || filters.dueBefore) count++;
    if (filters.assignedTo) count++;
    if (filters.hasAttachments) count++;
    if (filters.hasComments) count++;
    return count;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Advanced Filters</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getActiveFiltersCount() > 0 && (
            <Chip 
              label={`${getActiveFiltersCount()} active`} 
              color="primary" 
              size="small" 
            />
          )}
          <Button onClick={handleClearAll} size="small">
            Clear All
          </Button>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {/* Order Type */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">Order Type</Typography>
              {filters.orderType.length > 0 && (
                <Chip 
                  label={filters.orderType.length} 
                  color="primary" 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {orderTypes.map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    clickable
                    color={(filters.orderType as any).includes(type) ? 'primary' : 'default'}
                    onClick={() => handleArrayFilterChange('orderType', type)}
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Academic Level */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">Academic Level</Typography>
              {filters.academicLevel.length > 0 && (
                <Chip 
                  label={filters.academicLevel.length} 
                  color="primary" 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {academicLevels.map((level) => (
                  <Chip
                    key={level}
                    label={level}
                    clickable
                    color={(filters.academicLevel as any).includes(level) ? 'primary' : 'default'}
                    onClick={() => handleArrayFilterChange('academicLevel', level)}
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Subject */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">Subject</Typography>
              {filters.subject.length > 0 && (
                <Chip 
                  label={filters.subject.length} 
                  color="primary" 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Autocomplete
                multiple
                options={subjects}
                value={filters.subject}
                onChange={(_, newValue) => handleFilterChange('subject', newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select subjects..." />
                )}
              />
            </AccordionDetails>
          </Accordion>

          {/* Priority */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">Priority</Typography>
              {filters.priority.length > 0 && (
                <Chip 
                  label={filters.priority.length} 
                  color="primary" 
                  size="small" 
                  sx={{ ml: 2 }} 
                />
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {priorities.map((priority) => (
                  <Chip
                    key={priority}
                    label={priority}
                    clickable
                    color={(filters.priority as any).includes(priority) ? 'primary' : 'default'}
                    onClick={() => handleArrayFilterChange('priority', priority)}
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Price Range */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">Price Range</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={filters.priceRange}
                  onChange={(_, newValue) => handleFilterChange('priceRange', newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={1000}
                  step={10}
                  marks={[
                    { value: 0, label: '$0' },
                    { value: 250, label: '$250' },
                    { value: 500, label: '$500' },
                    { value: 750, label: '$750' },
                    { value: 1000, label: '$1000+' },
                  ]}
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Page Range */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">Pages</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                {filters.pageRange[0]} - {filters.pageRange[1]} pages
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={filters.pageRange}
                  onChange={(_, newValue) => handleFilterChange('pageRange', newValue)}
                  valueLabelDisplay="auto"
                  min={1}
                  max={50}
                  step={1}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 10, label: '10' },
                    { value: 25, label: '25' },
                    { value: 50, label: '50+' },
                  ]}
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Date Ranges */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">Date Ranges</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Created Date
                  </Typography>
                  <DatePicker
                    label="From"
                    value={filters.createdAfter}
                    onChange={(date) => handleFilterChange('createdAfter', date)}
                    slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: 2 } } }}
                  />
                  <DatePicker
                    label="To"
                    value={filters.createdBefore}
                    onChange={(date) => handleFilterChange('createdBefore', date)}
                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Due Date
                  </Typography>
                  <DatePicker
                    label="From"
                    value={filters.dueAfter}
                    onChange={(date) => handleFilterChange('dueAfter', date)}
                    slotProps={{ textField: { fullWidth: true, size: 'small', sx: { mb: 2 } } }}
                  />
                  <DatePicker
                    label="To"
                    value={filters.dueBefore}
                    onChange={(date) => handleFilterChange('dueBefore', date)}
                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Additional Filters */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">Additional Filters</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Has Attachments</InputLabel>
                    <Select
                      value={filters.hasAttachments}
                      label="Has Attachments"
                      onChange={(e) => handleFilterChange('hasAttachments', e.target.value)}
                    >
                      <MenuItem value="">Any</MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Has Comments</InputLabel>
                    <Select
                      value={filters.hasComments}
                      label="Has Comments"
                      onChange={(e) => handleFilterChange('hasComments', e.target.value)}
                    >
                      <MenuItem value="">Any</MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Assigned To (Writer ID)"
                    value={filters.assignedTo}
                    onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                    type="number"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleClearAll} color="secondary">
          Clear All
        </Button>
        <Button onClick={handleApply} variant="contained">
          Apply Filters ({getActiveFiltersCount()})
        </Button>
      </DialogActions>
    </Dialog>
  );
}