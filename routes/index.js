const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Home]
 *     summary: Página inicial da API
 *     responses:
 *       200:
 *         description: Bem-vindo à API do Marketplace
 */
router.get('/', function(req, res, next) {
  res.json({
    message: 'Bem-vindo à API do Marketplace',
    endpoints: {
      users: '/users',
      ads: '/ads',
      categories: '/categories',
      comments: '/comments',
      chats: '/chats',
      messages: '/messages',
      docs: '/api-docs'
    }
  });
});

module.exports = router;

