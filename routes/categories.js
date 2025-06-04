const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Retorna todas as categorias
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
router.get('/', categoriesController.getAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Retorna uma categoria pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes da categoria
 *       404:
 *         description: Categoria não encontrada
 */
router.get('/:id', categoriesController.getCategoryById);

/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Cria uma nova categoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Category'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 */
router.post('/', categoriesController.createCategory);

module.exports = router;