const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// ایجاد پست جدید
router.post('/', authenticate, [
  body('content').isLength({ min: 1, max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, media_url } = req.body;
    const userId = req.userId;
    
    const newPost = await db.query(
      `INSERT INTO posts (user_id, content, media_url) 
       VALUES ($1, $2, $3) 
       RETURNING *, 
       (SELECT username FROM users WHERE id = $1) as username`,
      [userId, content, media_url]
    );
    
    res.status(201).json(newPost.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// دریافت پست‌ها (تایم‌لاین)
router.get('/timeline', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const posts = await db.query(
      `SELECT p.*, u.username, u.display_name, u.avatar_url,
       (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
       (SELECT COUNT(*) FROM replies WHERE post_id = p.id) as reply_count,
       EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = $1) as liked_by_me
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = $1 
       OR p.user_id IN (SELECT following_id FROM follows WHERE follower_id = $1)
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    
    res.json(posts.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// لایک کردن پست
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const postId = req.params.id;
    
    // بررسی وجود پست
    const postCheck = await db.query(
      'SELECT id FROM posts WHERE id = $1',
      [postId]
    );
    
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // بررسی لایک قبلی
    const existingLike = await db.query(
      'SELECT * FROM likes WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );
    
    if (existingLike.rows.length > 0) {
      // حذف لایک
      await db.query(
        'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
        [userId, postId]
      );
      res.json({ liked: false });
    } else {
      // افزودن لایک
      await db.query(
        'INSERT INTO likes (user_id, post_id) VALUES ($1, $2)',
        [userId, postId]
      );
      res.json({ liked: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// افزودن پاسخ
router.post('/:id/reply', authenticate, [
  body('content').isLength({ min: 1, max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;
    const postId = req.params.id;
    const { content } = req.body;
    
    // بررسی وجود پست
    const postCheck = await db.query(
      'SELECT id FROM posts WHERE id = $1',
      [postId]
    );
    
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const newReply = await db.query(
      `INSERT INTO replies (post_id, user_id, content) 
       VALUES ($1, $2, $3) 
       RETURNING *, 
       (SELECT username FROM users WHERE id = $2) as username`,
      [postId, userId, content]
    );
    
    res.status(201).json(newReply.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;