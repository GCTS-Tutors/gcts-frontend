'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  FormControlLabel,
  Checkbox,
  Stack,
} from '@mui/material';
import { Send, Person, Lock } from '@mui/icons-material';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  useGetOrderCommentsQuery,
  useAddOrderCommentMutation,
} from '@/store/api/orderApi';

interface OrderCommentsProps {
  orderId: string;
  isAdmin: boolean;
}

/**
 * The requester↔admin communication thread on an order. The backend scopes
 * visibility: internal (admin/writer) notes are never returned to the owner.
 */
export function OrderComments({ orderId, isAdmin }: OrderCommentsProps) {
  const [message, setMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [postError, setPostError] = useState('');

  const { data: comments = [], isLoading, refetch } = useGetOrderCommentsQuery(orderId);
  const [addComment, { isLoading: posting }] = useAddOrderCommentMutation();

  const handlePost = async () => {
    if (!message.trim()) return;
    setPostError('');
    try {
      await addComment({ orderId, content: message.trim(), isInternal }).unwrap();
      setMessage('');
      setIsInternal(false);
      refetch();
    } catch (e: any) {
      setPostError(e?.data?.message || e?.data?.error || 'Failed to post the comment.');
    }
  };

  // Oldest first for a natural conversation flow (API returns newest first)
  const thread = [...comments].reverse();

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : thread.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            No comments yet — questions about this order go here.
          </Typography>
        ) : (
          <Stack spacing={2} sx={{ mb: 2 }}>
            {thread.map((c: any) => (
              <Box key={c.id} sx={{ display: 'flex', gap: 1.5 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  <Person fontSize="small" />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2">
                      {c.user
                        ? `${c.user.firstName ?? ''} ${c.user.lastName ?? ''}`.trim() ||
                          c.user.username ||
                          c.user.email
                        : 'Unknown'}
                    </Typography>
                    {c.is_internal && (
                      <Chip size="small" icon={<Lock />} label="Internal" color="warning" />
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {c.createdAt &&
                        formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {c.message ?? c.comment}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        )}

        {postError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setPostError('')}>
            {postError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            size="small"
            placeholder="Write a comment…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            variant="contained"
            endIcon={<Send />}
            disabled={posting || !message.trim()}
            onClick={handlePost}
          >
            Post
          </Button>
        </Box>
        {isAdmin && (
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
              />
            }
            label={
              <Typography variant="caption">
                Internal note (hidden from the student)
              </Typography>
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
