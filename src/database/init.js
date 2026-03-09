const pool = require('./connection');

async function initDatabase() {
    
    try {
        // Criar tabela orders
        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                "orderId" VARCHAR(50) PRIMARY KEY,
                "value" DECIMAL(10,2) NOT NULL,
                "creationDate" TIMESTAMP NOT NULL
            );
        `);

        // Criar tabela items
        await pool.query(`
            CREATE TABLE IF NOT EXISTS items (
                id SERIAL PRIMARY KEY,
                "orderId" VARCHAR(50) REFERENCES orders("orderId") ON DELETE CASCADE,
                "productId" INTEGER NOT NULL,
                "quantity" INTEGER NOT NULL,
                "price" DECIMAL(10,2) NOT NULL
            );
        `);

        // Verificar se as tabelas existem
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);

    } catch (error) {
        console.error('Erro ao criar tabelas:', error.message);
    } finally {
        await pool.end();
    }
}

initDatabase();