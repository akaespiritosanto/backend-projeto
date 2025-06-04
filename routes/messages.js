const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     tags: [Messages]
 *     summary: Retorna uma mensagem pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes da mensagem
 *       404:
 *         description: Mensagem não encontrada
 */
router.get('/:id', messagesController.getMessageById);

/**
 * @swagger
 * /messages/{id}:
 *   put:
 *     tags: [Messages]
 *     summary: Atualiza uma mensagem
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
 *               user_id:
 *                 type: integer
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mensagem atualizada com sucesso
 *       404:
 *         description: Mensagem não encontrada
 */
router.put('/:id', messagesController.updateMessage);

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     tags: [Messages]
 *     summary: Deleta uma mensagem
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
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Mensagem deletada com sucesso
 *       404:
 *         description: Mensagem não encontrada
 */
router.delete('/:id', messagesController.deleteMessage);

module.exports = router;