const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/', orderRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: 'API de Pedidos funcionando!' });
});

// Tratamento de erros (deve ser o último)
app.use(errorHandler);

module.exports = app;