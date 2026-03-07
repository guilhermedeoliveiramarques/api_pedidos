const orderModel = require('../models/orderModel');

// Função de mapeamento (transformação dos dados)
const mapIncomingOrder = (incomingData) => {
    return {
        orderId: incomingData.numeroPedido.replace('-01', ''),
        value: incomingData.valorTotal,
        creationDate: new Date(incomingData.dataCriacao).toISOString(),
        items: incomingData.items.map(item => ({
            productId: parseInt(item.idItem),
            quantity: item.quantidadeItem,
            price: item.valorItem
        }))
    };
};

const orderController = {
    // Criar pedido
    async create(req, res, next) {
        try {
            const mappedOrder = mapIncomingOrder(req.body);
            const result = await orderModel.create(mappedOrder);
            
            res.status(201).json({
                success: true,
                message: 'Pedido criado com sucesso',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    // Buscar por orderId
    async findByOrderId(req, res, next) {
        try {
            const { orderId } = req.params;
            const order = await orderModel.findByOrderId(orderId);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Pedido não encontrado'
                });
            }

            res.json({
                success: true,
                data: order
            });
        } catch (error) {
            next(error);
        }
    },

    // Listar todos
    async findAll(req, res, next) {
        try {
            const orders = await orderModel.findAll();
            res.json({
                success: true,
                count: orders.length,
                data: orders
            });
        } catch (error) {
            next(error);
        }
    },

    // Atualizar
    async update(req, res, next) {
        try {
            const { orderId } = req.params;
            const mappedOrder = mapIncomingOrder(req.body);
            
            const existing = await orderModel.findByOrderId(orderId);
            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: 'Pedido não encontrado'
                });
            }

            const updated = await orderModel.update(orderId, mappedOrder);
            res.json({
                success: true,
                message: 'Pedido atualizado com sucesso',
                data: updated
            });
        } catch (error) {
            next(error);
        }
    },

    // Deletar
    async delete(req, res, next) {
        try {
            const { orderId } = req.params;
            const deleted = await orderModel.delete(orderId);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Pedido não encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Pedido deletado com sucesso'
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = orderController;