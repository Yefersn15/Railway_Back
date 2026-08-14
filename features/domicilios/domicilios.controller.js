const pool = require('../../config/database');

const ESTADOS_VALIDOS = ['pendiente', 'en_camino', 'entregado', 'cancelado'];

const getDomicilios = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT d.*, v.total, v.metodo_pago, v.fecha, v.usuario_id, u.nombre as usuario_nombre,
                    r.nombre as repartidor_nombre
             FROM domicilios d
             JOIN ventas v ON d.venta_id = v.id
             LEFT JOIN usuarios u ON v.usuario_id = u.id
             LEFT JOIN usuarios r ON d.repartidor_id = r.id
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

const getMisEntregas = async (req, res) => {
    try {
        const repartidor_id = req.usuario.id;

        const result = await pool.query(
            `SELECT d.*, v.total, v.metodo_pago, v.fecha, u.nombre as usuario_nombre
             FROM domicilios d
             JOIN ventas v ON d.venta_id = v.id
             LEFT JOIN usuarios u ON v.usuario_id = u.id
             WHERE d.repartidor_id = $1
             ORDER BY d.created_at DESC`,
            [repartidor_id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const asignarRepartidor = async (req, res) => {
    try {
        const { id } = req.params;
        const { repartidor_id } = req.body;

        if (repartidor_id) {
            const repartidor = await pool.query(
                `SELECT id FROM usuarios WHERE id = $1 AND rol = 'domiciliario'`,
                [repartidor_id]
            );
            if (repartidor.rows.length === 0) {
                return res.status(400).json({ error: 'El usuario indicado no es un domiciliario' });
            }
        }

        const result = await pool.query(
            `UPDATE domicilios SET repartidor_id = $1 WHERE id = $2 RETURNING *`,
            [repartidor_id || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Domicilio no encontrado' });
        }

        res.json(result.rows[0]);
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

        if (req.usuario.rol === 'domiciliario') {
            const domicilio = await pool.query('SELECT repartidor_id FROM domicilios WHERE id = $1', [id]);
            if (domicilio.rows.length === 0) {
                return res.status(404).json({ error: 'Domicilio no encontrado' });
            }
            if (domicilio.rows[0].repartidor_id !== req.usuario.id) {
                return res.status(403).json({ error: 'No tienes permiso para modificar este domicilio' });
            }
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
    getMisEntregas,
    asignarRepartidor,
    cambiarEstado,
    ESTADOS_VALIDOS
};
