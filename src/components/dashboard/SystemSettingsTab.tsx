'use client';

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Switch,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Security,
  Notifications,
  Email,
  Storage,
  Backup,
  Update,
  Settings,
  Delete,
  Add,
  Edit,
  Save,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { useState } from 'react';
import { useGetSystemSettingsQuery, useUpdateSystemSettingsMutation } from '@/store/api/adminApi';

export function SystemSettingsTab() {
  const [settingsData, setSettingsData] = useState({
    emailNotifications: true,
    autoBackup: true,
    maintenanceMode: false,
    allowRegistration: true,
    orderAutoAssignment: false,
    paymentProcessing: true,
    fileUploadLimit: 10,
    sessionTimeout: 30,
    maxOrderPages: 50,
    defaultOrderPrice: 15,
  });

  const [backupDialog, setBackupDialog] = useState(false);
  const [maintenanceDialog, setMaintenanceDialog] = useState(false);

  const { data: systemSettings, isLoading } = useGetSystemSettingsQuery();
  const [updateSettings] = useUpdateSystemSettingsMutation();

  const handleSettingChange = (setting: string, value: any) => {
    setSettingsData(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings(settingsData);
      // Show success message
    } catch (error) {
      // Show error message
    }
  };

  const handleBackupNow = () => {
    // TODO: Implement backup functionality
    console.log('Creating backup...');
    setBackupDialog(false);
  };

  const handleMaintenanceMode = () => {
    handleSettingChange('maintenanceMode', !settingsData.maintenanceMode);
    setMaintenanceDialog(false);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          System Settings
        </Typography>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSaveSettings}
        >
          Save All Changes
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="General Settings"
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Settings />
                </Avatar>
              }
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">Allow New Registrations</Typography>
                  <Switch
                    checked={settingsData.allowRegistration}
                    onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Controls whether new users can register for accounts
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">Auto-assign Orders</Typography>
                  <Switch
                    checked={settingsData.orderAutoAssignment}
                    onChange={(e) => handleSettingChange('orderAutoAssignment', e.target.checked)}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Automatically assign orders to available writers
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <TextField
                fullWidth
                label="Session Timeout (minutes)"
                type="number"
                value={settingsData.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                helperText="How long users stay logged in when inactive"
              />

              <TextField
                fullWidth
                label="Max Order Pages"
                type="number"
                value={settingsData.maxOrderPages}
                onChange={(e) => handleSettingChange('maxOrderPages', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                helperText="Maximum number of pages allowed per order"
              />

              <TextField
                fullWidth
                label="Default Order Price ($)"
                type="number"
                value={settingsData.defaultOrderPrice}
                onChange={(e) => handleSettingChange('defaultOrderPrice', parseFloat(e.target.value))}
                helperText="Default price per page for new orders"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Security & Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Security & Notifications"
              avatar={
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <Security />
                </Avatar>
              }
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">Email Notifications</Typography>
                  <Switch
                    checked={settingsData.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Send email notifications for important events
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">Payment Processing</Typography>
                  <Switch
                    checked={settingsData.paymentProcessing}
                    onChange={(e) => handleSettingChange('paymentProcessing', e.target.checked)}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Enable payment processing for orders
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <TextField
                fullWidth
                label="File Upload Limit (MB)"
                type="number"
                value={settingsData.fileUploadLimit}
                onChange={(e) => handleSettingChange('fileUploadLimit', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                helperText="Maximum file size for uploads"
              />

              {/* Maintenance Mode */}
              <Box sx={{ mt: 3 }}>
                <Alert 
                  severity={settingsData.maintenanceMode ? "warning" : "info"}
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      onClick={() => setMaintenanceDialog(true)}
                    >
                      {settingsData.maintenanceMode ? 'Disable' : 'Enable'}
                    </Button>
                  }
                >
                  Maintenance Mode: {settingsData.maintenanceMode ? 'Active' : 'Inactive'}
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Backup & Storage */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Backup & Storage"
              avatar={
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <Backup />
                </Avatar>
              }
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">Automatic Backups</Typography>
                  <Switch
                    checked={settingsData.autoBackup}
                    onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Automatically backup system data daily
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Backup />}
                onClick={() => setBackupDialog(true)}
                sx={{ mb: 2 }}
              >
                Create Backup Now
              </Button>

              <Typography variant="subtitle2" gutterBottom>
                Recent Backups
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Full System Backup"
                    secondary="Today, 3:00 AM • 2.3 GB"
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Success" color="success" size="small" />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Database Backup"
                    secondary="Yesterday, 3:00 AM • 890 MB"
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Success" color="success" size="small" />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Files Backup"
                    secondary="2 days ago, 3:00 AM • 1.1 GB"
                  />
                  <ListItemSecondaryAction>
                    <Chip label="Success" color="success" size="small" />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* System Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="System Information"
              avatar={
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircle />
                </Avatar>
              }
            />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>System Version</Typography>
                <Typography variant="body2" color="text.secondary">GCTS v2.1.0</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Database</Typography>
                <Typography variant="body2" color="text.secondary">PostgreSQL 14.2</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Server</Typography>
                <Typography variant="body2" color="text.secondary">Ubuntu 22.04 LTS</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Storage Usage</Typography>
                <Typography variant="body2" color="text.secondary">15.2 GB / 100 GB (15.2%)</Typography>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Update />}
                sx={{ mt: 2 }}
              >
                Check for Updates
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* API Configuration */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="API Configuration"
              avatar={
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Settings />
                </Avatar>
              }
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="API Rate Limit (requests/minute)"
                    type="number"
                    defaultValue={1000}
                    helperText="Maximum API requests per minute per user"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="API Timeout (seconds)"
                    type="number"
                    defaultValue={30}
                    helperText="Request timeout duration"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>API Version</InputLabel>
                    <Select defaultValue="v1" label="API Version">
                      <MenuItem value="v1">Version 1.0</MenuItem>
                      <MenuItem value="v2">Version 2.0 (Beta)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Backup Dialog */}
      <Dialog open={backupDialog} onClose={() => setBackupDialog(false)}>
        <DialogTitle>Create System Backup</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            This will create a full backup of the system including:
          </Typography>
          <ul>
            <li>Database (users, orders, payments)</li>
            <li>File storage (uploaded documents)</li>
            <li>System configuration</li>
          </ul>
          <Typography color="text.secondary">
            The backup process may take several minutes to complete.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackupDialog(false)}>Cancel</Button>
          <Button onClick={handleBackupNow} variant="contained">
            Create Backup
          </Button>
        </DialogActions>
      </Dialog>

      {/* Maintenance Mode Dialog */}
      <Dialog open={maintenanceDialog} onClose={() => setMaintenanceDialog(false)}>
        <DialogTitle>
          {settingsData.maintenanceMode ? 'Disable' : 'Enable'} Maintenance Mode
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            {settingsData.maintenanceMode 
              ? 'Disabling maintenance mode will restore normal system access for all users.'
              : 'Enabling maintenance mode will prevent users from accessing the system. Only administrators will be able to log in.'
            }
          </Alert>
          <Typography>
            {settingsData.maintenanceMode 
              ? 'Are you sure you want to disable maintenance mode?'
              : 'Are you sure you want to enable maintenance mode?'
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMaintenanceDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleMaintenanceMode} 
            variant="contained"
            color={settingsData.maintenanceMode ? 'success' : 'warning'}
          >
            {settingsData.maintenanceMode ? 'Disable' : 'Enable'} Maintenance Mode
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}