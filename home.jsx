import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  Avatar,
  Typography,
  Divider,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { Favorite, FavoriteBorder, ChatBubbleOutline, Repeat } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { usePosts, createPost, likePost } from '../contexts/PostContext';
import axios from 'axios';

export default function Home() {
  const { user } = useAuth();
  const { posts, loading, fetchPosts } = usePosts();
  const [newPost, setNewPost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createPost(newPost);
      setNewPost('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      await likePost(postId);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
        <Typography>Loading posts...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Create Post */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar src={user?.avatar_url}>
            {user?.display_name?.[0] || user?.username?.[0]}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="What's happening?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                disabled={isSubmitting}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!newPost.trim() || isSubmitting}
                >
                  Post
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Paper>

      {/* Posts Timeline */}
      {posts.map((post) => (
        <Card key={post.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Avatar src={post.avatar_url}>
                {post.display_name?.[0] || post.username?.[0]}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {post.display_name || post.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{post.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • {new Date(post.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                  {post.content}
                </Typography>
              </Box>
            </Box>
          </CardContent>
          <CardActions>
            <IconButton
              onClick={() => handleLike(post.id, post.liked_by_me)}
              color={post.liked_by_me ? 'error' : 'default'}
            >
              {post.liked_by_me ? <Favorite /> : <FavoriteBorder />}
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {post.like_count || 0}
              </Typography>
            </IconButton>
            <IconButton>
              <ChatBubbleOutline />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {post.reply_count || 0}
              </Typography>
            </IconButton>
            <IconButton>
              <Repeat />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
}