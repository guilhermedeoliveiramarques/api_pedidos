const errorHandler = (err, req, res, next) => {
    console.error('Erro:', err);

    // Erro de chave duplicada (PostgreSQL)
    if (err.code === '23505') {
        return res.status(409).json({
            success: false,
            message: 'Pedido já existe com este número'
        });
    }

    // Erro de chave estrangeira
    if (err.code === '23503') {
        return res.status(400).json({
            success: false,
            message: 'Referência inválida'
        });
    }

    // Erro genérico
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
    });
};

module.exports = errorHandler;