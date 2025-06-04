const express = require('express');
const router = express.Router();
const chatsController = require('../controllers/chatsController');
const messagesController = require('../controllers/messagesController');

/**
 * @swagger
 * /chats:
 *   get:
 *     tags: [Chats]
 *     summary: Retorna todos os chats
 *     responses:
 *       200:
 *         description: Lista de chats
 */
router.get('/', chatsController.getAllChats);

/**
 * @swagger
 * /chats/{id}:
 *   get:
 *     tags: [Chats]
 *     summary: Retorna um chat pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do chat
 *       404:
 *         description: Chat não encontrado
 */
router.get('/:id', chatsController.getChatById);

/**
 * @swagger
 * /chats:
 *   post:
 *     tags: [Chats]
 *     summary: Cria um novo chat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Chat'
 *     responses:
 *       201:
 *         description: Chat criado com sucesso
 */
router.post('/', chatsController.createChat);

/**
 * @swagger
 * /chats/{id}/messages:
 *   get:
 *     tags: [Chats]
 *     summary: Retorna todas as mensagens de um chat
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de mensagens
 *       404:
 *         description: Chat não encontrado
 */
router.get('/:id/messages', chatsController.getChatMessages);

/**
 * @swagger
 * /chats/{id}/messages:
 *   post:
 *     tags: [Chats]
 *     summary: Envia uma nova mensagem em um chat
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender_id:
 *                 type: integer
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mensagem enviada com sucesso
 *       404:
 *         description: Chat não encontrado
 */
router.post('/:id/messages', chatsController.sendMessage);

module.exports = router;