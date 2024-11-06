import db from '../conf/db.js';

/* CRUD - flowers CONTROLLER */
const addflower = (req, res) => {
    const { name, species, color, price_per_unit } = req.body;
    const query = `INSERT INTO flowers (uuid, name, species, color, price_per_unit) VALUES (uuid(), ?, ?, ?, ?)`;

    db.query(query, [name, species, color, price_per_unit], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao adicionar a Planta' });
        res.json({ message: 'Planta adicionada com sucesso', result });
    });
};

const getflower = (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM flowers WHERE uuid = ?`;

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao obter a Planta' });
        if (result.length === 0) return res.status(404).json({ error: 'Planta não encontrada' });
        res.json(result[0]);
    });
};

const getflowers = (req, res) => {
    let query = 'SELECT * FROM flowers';
    const filters = [];
    
    // Aplicação de filtro de pesquisa
    if (req.query.search) {
        const search = req.query.search;
        filters.push(`(name LIKE '%${search}%' OR species LIKE '%${search}%' OR color LIKE '%${search}%' OR price_per_unit LIKE '%${search}%')`);
    }
    
    // Aplicação de ordenação
    const orderKey = req.query.sortKey || 'name';
    const orderValue = req.query.sortOrder || 'asc';
    query += filters.length ? ' WHERE ' + filters.join(' AND ') : '';
    query += ` ORDER BY ${orderKey} ${orderValue}`;

    // Paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';

    db.query(query, [limit, offset], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar as Plantas' });
        
        // Contagem total para paginação
        db.query('SELECT COUNT(*) AS total FROM flowers', (err, countResult) => {
            if (err) return res.status(500).json({ error: 'Erro ao obter a contagem total' });
            res.json({ data: result, total: countResult[0].total });
        });
    });
};

const updateflower = (req, res) => {
    const id = req.params.id;
    const { name, species, color, price_per_unit } = req.body;
    const query = `UPDATE flowers SET name = ?, species = ?, color = ?, price_per_unit = ? WHERE uuid = ?`;

    db.query(query, [name, species, color, price_per_unit, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar a Planta' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Planta não encontrada' });
        res.json({ message: 'Planta atualizada com sucesso', result });
    });
};

const deleteflower = (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM flowers WHERE uuid = ?`;

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao deletar a Planta' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Planta não encontrada' });
        res.json({ message: 'Planta deletada com sucesso' });
    });
};

export default { addflower, getflower, getflowers, updateflower, deleteflower };
