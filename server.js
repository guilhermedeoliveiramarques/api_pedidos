require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/database/connection');

async function initTables() {
    try {
        console.log(' Verificando/criando tabelas...');
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                "orderId" VARCHAR(50) PRIMARY KEY,
                "value" DECIMAL(10,2) NOT NULL,
                "creationDate" TIMESTAMP NOT NULL
            );
        `);
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS items (
                id SERIAL PRIMARY KEY,
                "orderId" VARCHAR(50) REFERENCES orders("orderId") ON DELETE CASCADE,
                "productId" INTEGER NOT NULL,
                "quantity" INTEGER NOT NULL,
                "price" DECIMAL(10,2) NOT NULL
            );
        `);
        
        console.log('Tabelas prontas!');
    } catch (error) {
        console.error('❌ Erro ao criar tabelas:', error.message);
    }
}

// Chamar a função antes de iniciar o servidor
initTables().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Teste: http://localhost:${PORT}`);
    });
});