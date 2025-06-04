const express = require('express');
const router = express.Router();
const adsController = require('../controllers/adsController');

/**
 * @swagger
 * /ads:
 *   get:
 *     tags: [Ads]
 *     summary: Retorna todos os anúncios
 *     responses:
 *       200:
 *         description: Lista de anúncios
 */
router.get('/', adsController.getAllAds);

/**
 * @swagger
 * /ads/{id}:
 *   get:
 *     tags: [Ads]
 *     summary: Retorna um anúncio pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do anúncio
 *       404:
 *         description: Anúncio não encontrado
 */
router.get('/:id', adsController.getAdById);

/**
 * @swagger
 * /ads:
 *   post:
 *     tags: [Ads]
 *     summary: Cria um novo anúncio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Ad'
 *     responses:
 *       201:
 *         description: Anúncio criado com sucesso
 */
router.post('/', adsController.createAd);

/**
 * @swagger
 * /ads/{id}:
 *   put:
 *     tags: [Ads]
 *     summary: Atualiza um anúncio
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
 *             $ref: '#/definitions/Ad'
 *     responses:
 *       200:
 *         description: Anúncio atualizado com sucesso
 *       404:
 *         description: Anúncio não encontrado
 */
router.put('/:id', adsController.updateAd);

module.exports = router;