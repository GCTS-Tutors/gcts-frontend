'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
} from '@mui/material';
import { CheckCircle, Cancel, LockOpen } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { axiosInstance } from '@/lib/api';

/** Peel the StandardAPIResponse envelope and optional DRF pagination. */
function unwrapList(data: any): any[] {
  const payload =
    data && typeof data === 'object' && 'success' in data && 'data' in data ? data.data : data;
  if (Array.isArray(payload)) return payload;
  return payload?.results ?? [];
}

/**
 * Admin panel for the sample-paper access flow: pending access requests
 * (grant/deny → the requester is notified and, when granted, unlocks the full
 * paper) and the per-paper open/excerpt toggle.
 */
export function PaperAccessManager() {
  const [requests, setRequests] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError('');
    try {
      const [reqRes, papersRes] = await Promise.all([
        axiosInstance.get('/userpapers/', { params: { status: 'pending' } }),
        axiosInstance.get('/papers/', { params: { pageSize: 100 } }),
      ]);
      setRequests(unwrapList(reqRes.data));
      setPapers(unwrapList(papersRes.data));
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load paper access data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const decide = async (id: string, decision: 'approve' | 'reject') => {
    setBusyId(id);
    setError('');
    try {
      await axiosInstance.post(`/userpapers/${id}/${decision}/`);
      setRequests((prev) => prev.filter((r) => String(r.id) !== String(id)));
    } catch (e: any) {
      setError(e?.response?.data?.message || `Failed to ${decision} the request.`);
    } finally {
      setBusyId(null);
    }
  };

  const toggleOpen = async (paperId: string, isOpen: boolean) => {
    setBusyId(paperId);
    setError('');
    try {
      await axiosInstance.patch(`/papers/${paperId}/`, { is_open: isOpen });
      setPapers((prev) =>
        prev.map((p) => (String(p.id) === String(paperId) ? { ...p, is_open: isOpen } : p))
      );
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to update the paper.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Access Requests
            {requests.length > 0 && (
              <Chip size="small" color="warning" label={requests.length} sx={{ ml: 1 }} />
            )}
          </Typography>
          {requests.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No pending access requests.
            </Typography>
          ) : (
            <Stack spacing={1}>
              {requests.map((req) => (
                <Box
                  key={req.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.5,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Box>
                    <Typography variant="body1">
                      {req.paper?.title ?? 'Unknown paper'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Requested by user #{req.user}
                      {req.created_at &&
                        ` • ${formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}`}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      disabled={busyId === String(req.id)}
                      onClick={() => decide(String(req.id), 'approve')}
                    >
                      Grant
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Cancel />}
                      disabled={busyId === String(req.id)}
                      onClick={() => decide(String(req.id), 'reject')}
                    >
                      Deny
                    </Button>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockOpen fontSize="small" /> Paper Visibility
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Open papers show their full content to everyone; closed papers show an excerpt
            until you grant an access request.
          </Typography>
          <Divider sx={{ mb: 1 }} />
          {papers.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No papers yet.
            </Typography>
          ) : (
            <List dense>
              {papers.map((p) => (
                <ListItem
                  key={p.id}
                  secondaryAction={
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Boolean(p.is_open)}
                          disabled={busyId === String(p.id)}
                          onChange={(e) => toggleOpen(String(p.id), e.target.checked)}
                        />
                      }
                      label={p.is_open ? 'Open' : 'Excerpt only'}
                      labelPlacement="start"
                    />
                  }
                >
                  <ListItemText
                    primary={p.title}
                    secondary={p.subject?.title ?? p.subject ?? undefined}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
