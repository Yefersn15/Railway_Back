const pool = require('../../config/database');

const ESTADOS_VALIDOS = ['pendiente', 'en_camino', 'entregado', 'cancelado'];

const getDomicilios = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT d.*, v.total, v.metodo_pago, v.fecha, v.usuario_id, u.nombre as usuario_nombre
             FROM domicilios d
             JOIN ventas v ON d.venta_id = v.id
             LEFT JOIN usuarios u ON v.usuario_id = u.id
             ORDER BY d.created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMisDomicilios = async (req, res) => {
    try {
        const usuario_id = req.usuario.id;

        const result = await pool.query(
            `SELECT d.*, v.total, v.metodo_pago, v.fecha
             FROM domicilios d
             JOIN ventas v ON d.venta_id = v.id
             WHERE v.usuario_id = $1
             ORDER BY d.created_at DESC`,
            [usuario_id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!ESTADOS_VALIDOS.includes(estado)) {
            return res.status(400).json({
                error: `Estado inválido. Debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`
            });
        }

        const result = await pool.query(
            `UPDATE domicilios SET estado = $1 WHERE id = $2 RETURNING *`,
            [estado, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Domicilio no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getDomicilios,
    getMisDomicilios,
    cambiarEstado,
    ESTADOS_VALIDOS
};
