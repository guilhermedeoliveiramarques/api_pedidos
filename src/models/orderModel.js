const pool = require('../database/connection');

const orderModel = {
    async create(orderData) {
        console.log('💾 orderModel.create recebeu:', orderData);
        
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Inserir pedido - usando os nomes REAIS da tabela
            const orderQuery = `
                INSERT INTO orders (orderid, value, creationdate)
                VALUES ($1, $2, $3)
            `;
            
            await client.query(orderQuery, [
                orderData.orderId,
                orderData.value,
                orderData.creationDate
            ]);

            // Inserir itens
            for (const item of orderData.items) {
                const itemQuery = `
                    INSERT INTO items (orderid, productid, quantity, price)
                    VALUES ($1, $2, $3, $4)
                `;
                
                await client.query(itemQuery, [
                    orderData.orderId,
                    item.productId,
                    item.quantity,
                    item.price
                ]);
            }

            await client.query('COMMIT');
            return orderData;
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('❌ Erro na transação:', error);
            throw error;
        } finally {
            client.release();
        }
    },

    async findByOrderId(orderId) {
        const orderQuery = 'SELECT orderid, value, creationdate FROM orders WHERE orderid = $1';
        const orderResult = await pool.query(orderQuery, [orderId]);
        
        if (orderResult.rows.length === 0) return null;

        const itemsQuery = 'SELECT productid, quantity, price FROM items WHERE orderid = $1';
        const itemsResult = await pool.query(itemsQuery, [orderId]);

        return {
            orderId: orderResult.rows[0].orderid,
            value: parseFloat(orderResult.rows[0].value),
            creationDate: orderResult.rows[0].creationdate,
            items: itemsResult.rows.map(item => ({
                productId: item.productid,
                quantity: item.quantity,
                price: parseFloat(item.price)
            }))
        };
    },

    async findAll() {
        const ordersQuery = 'SELECT orderid, value, creationdate FROM orders ORDER BY creationdate DESC';
        const ordersResult = await pool.query(ordersQuery);

        const orders = [];
        for (const order of ordersResult.rows) {
            const itemsQuery = 'SELECT productid, quantity, price FROM items WHERE orderid = $1';
            const itemsResult = await pool.query(itemsQuery, [order.orderid]);
            
            orders.push({
                orderId: order.orderid,
                value: parseFloat(order.value),
                creationDate: order.creationdate,
                items: itemsResult.rows.map(item => ({
                    productId: item.productid,
                    quantity: item.quantity,
                    price: parseFloat(item.price)
                }))
            });
        }
        return orders;
    },

    async update(orderId, orderData) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const updateOrderQuery = `
                UPDATE orders 
                SET value = $1, creationdate = $2
                WHERE orderid = $3
            `;
            await client.query(updateOrderQuery, [
                orderData.value,
                orderData.creationDate,
                orderId
            ]);

            await client.query('DELETE FROM items WHERE orderid = $1', [orderId]);
            
            for (const item of orderData.items) {
                const itemQuery = `
                    INSERT INTO items (orderid, productid, quantity, price)
                    VALUES ($1, $2, $3, $4)
                `;
                await client.query(itemQuery, [
                    orderId,
                    item.productId,
                    item.quantity,
                    item.price
                ]);
            }

            await client.query('COMMIT');
            return { ...orderData, orderId };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    async delete(orderId) {
        const result = await pool.query('DELETE FROM orders WHERE orderid = $1', [orderId]);
        return result.rowCount > 0;
    }
};

module.exports = orderModel;