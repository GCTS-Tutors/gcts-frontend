'use client';

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Skeleton,
  Alert,
  Pagination,
  Tooltip,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Add,
  Search,
  FilterList,
  ContentCopy,
  Visibility,
  VisibilityOff,
  Star,
  StarBorder,
  Download,
  FileUpload,
} from '@mui/icons-material';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { useState } from 'react';
import { format } from 'date-fns';
import {
  useGetAdminPapersQuery,
  useCreatePaperMutation,
  useUpdatePaperMutation,
  useDeletePaperMutation,
  useDuplicatePaperMutation,
  useBulkActionPapersMutation,
  type AdminPaper,
  type CreatePaperData,
  type UpdatePaperData,
} from '@/store/api/papersApi';

interface PaperFormData {
  title: string;
  subject: string;
  type: string;
  level: string;
  pages: number;
  excerpt: string;
  content: string;
  author: string;
  keywords: string;
  is_published: boolean;
  featured: boolean;
  meta_description: string;
}

const initialFormData: PaperFormData = {
  title: '',
  subject: '',
  type: '',
  level: '',
  pages: 1,
  excerpt: '',
  content: '',
  author: '',
  keywords: '',
  is_published: false,
  featured: false,
  meta_description: '',
};

export function PapersManagementTab() {
  // State for pagination and filtering
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    is_published: undefined as boolean | undefined,
    featured: undefined as boolean | undefined,
    subject: '',
    type: '',
    level: '',
  });

  // State for dialogs and forms
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<AdminPaper | null>(null);
  const [formData, setFormData] = useState<PaperFormData>(initialFormData);

  // State for bulk operations
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [bulkMenuAnchor, setBulkMenuAnchor] = useState<null | HTMLElement>(null);

  // State for individual paper actions
  const [paperMenuAnchor, setPaperMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuPaper, setMenuPaper] = useState<AdminPaper | null>(null);

  // Fetch papers data
  const { data: papersData, isLoading, error, refetch } = useGetAdminPapersQuery({
    page,
    page_size: pageSize,
    search: searchTerm || undefined,
    ...filters,
  });

  // Mutations
  const [createPaper, { isLoading: isCreating }] = useCreatePaperMutation();
  const [updatePaper, { isLoading: isUpdating }] = useUpdatePaperMutation();
  const [deletePaper, { isLoading: isDeleting }] = useDeletePaperMutation();
  const [duplicatePaper, { isLoading: isDuplicating }] = useDuplicatePaperMutation();
  const [bulkActionPapers, { isLoading: isBulkActing }] = useBulkActionPapersMutation();

  const papers = papersData?.results || [];
  const totalPages = papersData ? Math.ceil(papersData.count / pageSize) : 0;

  // Handle form changes
  const handleFormChange = (field: keyof PaperFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle paper creation
  const handleCreatePaper = async () => {
    try {
      const keywords = formData.keywords ? formData.keywords.split(',').map(k => k.trim()) : undefined;
      const createData: CreatePaperData = {
        ...formData,
        keywords,
        meta_description: formData.meta_description || undefined,
        author: formData.author || undefined,
      };
      await createPaper(createData).unwrap();
      setCreateDialogOpen(false);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Failed to create paper:', error);
    }
  };

  // Handle paper editing
  const handleEditPaper = async () => {
    if (!selectedPaper) return;

    try {
      const keywords = formData.keywords ? formData.keywords.split(',').map(k => k.trim()) : undefined;
      const updateData: UpdatePaperData = {
        id: selectedPaper.id,
        ...formData,
        keywords,
        meta_description: formData.meta_description || undefined,
        author: formData.author || undefined,
      };
      await updatePaper(updateData).unwrap();
      setEditDialogOpen(false);
      setSelectedPaper(null);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Failed to update paper:', error);
    }
  };

  // Handle paper deletion
  const handleDeletePaper = async () => {
    if (!selectedPaper) return;

    try {
      await deletePaper(selectedPaper.id).unwrap();
      setDeleteDialogOpen(false);
      setSelectedPaper(null);
    } catch (error) {
      console.error('Failed to delete paper:', error);
    }
  };

  // Handle paper duplication
  const handleDuplicatePaper = async (paperId: string) => {
    try {
      await duplicatePaper(paperId).unwrap();
      setPaperMenuAnchor(null);
      setMenuPaper(null);
    } catch (error) {
      console.error('Failed to duplicate paper:', error);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: 'delete' | 'publish' | 'unpublish' | 'feature' | 'unfeature') => {
    if (selectedPapers.length === 0) return;

    try {
      await bulkActionPapers({ ids: selectedPapers, action }).unwrap();
      setSelectedPapers([]);
      setBulkMenuAnchor(null);
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
    }
  };

  // Open edit dialog with paper data
  const openEditDialog = (paper: AdminPaper) => {
    setSelectedPaper(paper);
    setFormData({
      title: paper.title,
      subject: paper.subject,
      type: paper.type,
      level: paper.level,
      pages: paper.pages,
      excerpt: paper.excerpt,
      content: paper.content,
      author: paper.author || '',
      keywords: paper.keywords?.join(', ') || '',
      is_published: paper.is_published,
      featured: paper.featured,
      meta_description: paper.meta_description || '',
    });
    setEditDialogOpen(true);
    setPaperMenuAnchor(null);
    setMenuPaper(null);
  };

  // Open delete dialog
  const openDeleteDialog = (paper: AdminPaper) => {
    setSelectedPaper(paper);
    setDeleteDialogOpen(true);
    setPaperMenuAnchor(null);
    setMenuPaper(null);
  };

  // Handle checkbox selection
  const handleSelectPaper = (paperId: string, checked: boolean) => {
    if (checked) {
      setSelectedPapers(prev => [...prev, paperId]);
    } else {
      setSelectedPapers(prev => prev.filter(id => id !== paperId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPapers(papers.map(paper => paper.id));
    } else {
      setSelectedPapers([]);
    }
  };

  return (
    <Box>
      {/* Header with actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Papers Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add New Paper
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Papers
              </Typography>
              <Typography variant="h4">
                {papersData?.count || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Published
              </Typography>
              <Typography variant="h4">
                {papers.filter(p => p.is_published).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Featured
              </Typography>
              <Typography variant="h4">
                {papers.filter(p => p.featured).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Downloads
              </Typography>
              <Typography variant="h4">
                {papers.reduce((sum, p) => sum + p.download_count, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search papers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.is_published ?? ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  is_published: e.target.value === '' ? undefined : e.target.value === 'true'
                }))}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Published</MenuItem>
                <MenuItem value="false">Draft</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Featured</InputLabel>
              <Select
                value={filters.featured ?? ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  featured: e.target.value === '' ? undefined : e.target.value === 'true'
                }))}
                label="Featured"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Featured</MenuItem>
                <MenuItem value="false">Not Featured</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {selectedPapers.length > 0 && (
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">
                  {selectedPapers.length} selected
                </Typography>
                <Button
                  size="small"
                  onClick={(e) => setBulkMenuAnchor(e.currentTarget)}
                  disabled={isBulkActing}
                >
                  Bulk Actions
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Papers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedPapers.length === papers.length && papers.length > 0}
                  indeterminate={selectedPapers.length > 0 && selectedPapers.length < papers.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Downloads</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width={24} height={24} /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                </TableRow>
              ))
            ) : papers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No papers found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              papers.map((paper) => (
                <TableRow key={paper.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedPapers.includes(paper.id)}
                      onChange={(e) => handleSelectPaper(paper.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                        {paper.title}
                      </Typography>
                      {paper.featured && (
                        <Chip size="small" label="Featured" color="primary" sx={{ mt: 0.5 }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{paper.subject}</TableCell>
                  <TableCell>{paper.type}</TableCell>
                  <TableCell>{paper.level}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={paper.is_published ? 'Published' : 'Draft'}
                      color={paper.is_published ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Download sx={{ fontSize: 16 }} />
                      {paper.download_count}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {format(new Date(paper.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        setPaperMenuAnchor(e.currentTarget);
                        setMenuPaper(paper);
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, newPage) => setPage(newPage)}
            color="primary"
          />
        </Box>
      )}

      {/* Paper Actions Menu */}
      <Menu
        anchorEl={paperMenuAnchor}
        open={Boolean(paperMenuAnchor)}
        onClose={() => {
          setPaperMenuAnchor(null);
          setMenuPaper(null);
        }}
      >
        <MenuItem onClick={() => menuPaper && openEditDialog(menuPaper)}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => menuPaper && handleDuplicatePaper(menuPaper.id)}>
          <ContentCopy sx={{ mr: 1 }} />
          Duplicate
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => menuPaper && openDeleteDialog(menuPaper)}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkMenuAnchor}
        open={Boolean(bulkMenuAnchor)}
        onClose={() => setBulkMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleBulkAction('publish')}>
          <Visibility sx={{ mr: 1 }} />
          Publish
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('unpublish')}>
          <VisibilityOff sx={{ mr: 1 }} />
          Unpublish
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('feature')}>
          <Star sx={{ mr: 1 }} />
          Feature
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('unfeature')}>
          <StarBorder sx={{ mr: 1 }} />
          Unfeature
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => handleBulkAction('delete')}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create Paper Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Paper</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Subject"
                value={formData.subject}
                onChange={(e) => handleFormChange('subject', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Type"
                value={formData.type}
                onChange={(e) => handleFormChange('type', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Level"
                value={formData.level}
                onChange={(e) => handleFormChange('level', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Pages"
                type="number"
                value={formData.pages}
                onChange={(e) => handleFormChange('pages', parseInt(e.target.value) || 1)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Author"
                value={formData.author}
                onChange={(e) => handleFormChange('author', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Keywords (comma-separated)"
                value={formData.keywords}
                onChange={(e) => handleFormChange('keywords', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Excerpt"
                multiline
                rows={3}
                value={formData.excerpt}
                onChange={(e) => handleFormChange('excerpt', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta Description"
                multiline
                rows={2}
                value={formData.meta_description}
                onChange={(e) => handleFormChange('meta_description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <RichTextEditor
                label="Content"
                value={formData.content}
                onChange={(value) => handleFormChange('content', value)}
                required
                placeholder="Write the paper content here..."
                height="400px"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_published}
                    onChange={(e) => handleFormChange('is_published', e.target.checked)}
                  />
                }
                label="Published"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.featured}
                    onChange={(e) => handleFormChange('featured', e.target.checked)}
                  />
                }
                label="Featured"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreatePaper}
            variant="contained"
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Paper'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Paper Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Paper</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Subject"
                value={formData.subject}
                onChange={(e) => handleFormChange('subject', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Type"
                value={formData.type}
                onChange={(e) => handleFormChange('type', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Level"
                value={formData.level}
                onChange={(e) => handleFormChange('level', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Pages"
                type="number"
                value={formData.pages}
                onChange={(e) => handleFormChange('pages', parseInt(e.target.value) || 1)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Author"
                value={formData.author}
                onChange={(e) => handleFormChange('author', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Keywords (comma-separated)"
                value={formData.keywords}
                onChange={(e) => handleFormChange('keywords', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Excerpt"
                multiline
                rows={3}
                value={formData.excerpt}
                onChange={(e) => handleFormChange('excerpt', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta Description"
                multiline
                rows={2}
                value={formData.meta_description}
                onChange={(e) => handleFormChange('meta_description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <RichTextEditor
                label="Content"
                value={formData.content}
                onChange={(value) => handleFormChange('content', value)}
                required
                placeholder="Write the paper content here..."
                height="400px"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_published}
                    onChange={(e) => handleFormChange('is_published', e.target.checked)}
                  />
                }
                label="Published"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.featured}
                    onChange={(e) => handleFormChange('featured', e.target.checked)}
                  />
                }
                label="Featured"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleEditPaper}
            variant="contained"
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Paper'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
      >
        <DialogTitle>Delete Paper</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedPaper?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeletePaper}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load papers. Please try again.
        </Alert>
      )}
    </Box>
  );
}