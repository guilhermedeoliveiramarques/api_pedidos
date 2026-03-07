const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

// Obrigatórios
router.post('/order', orderController.create);
router.get('/order/:orderId', orderController.findByOrderId);

// Opcionais
router.get('/order/list', orderController.findAll);
router.put('/order/:orderId', orderController.update);
router.delete('/order/:orderId', orderController.delete);

module.exports = router;