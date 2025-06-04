const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

/**
 * @swagger
 * /comments:
 *   get:
 *     tags: [Comments]
 *     summary: Retorna todos os comentários
 *     responses:
 *       200:
 *         description: Lista de comentários
 */
router.get('/', commentsController.getAllComments);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     tags: [Comments]
 *     summary: Retorna um comentário pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do comentário
 *       404:
 *         description: Comentário não encontrado
 */
router.get('/:id', commentsController.getCommentById);

/**
 * @swagger
 * /comments:
 *   post:
 *     tags: [Comments]
 *     summary: Cria um novo comentário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Comment'
 *     responses:
 *       201:
 *         description: Comentário criado com sucesso
 */
router.post('/', commentsController.createComment);

module.exports = router;