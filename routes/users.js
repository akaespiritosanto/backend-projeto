const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Retorna todos os usuários
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/', usersController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Retorna um usuário pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do usuário
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', usersController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/User'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post('/', usersController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Atualiza um usuário
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
 *             $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/:id', usersController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Deleta um usuário
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', usersController.deleteUser);

module.exports = router;



