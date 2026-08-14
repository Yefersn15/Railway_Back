const express = require('express');
const router = express.Router();
const {
    getVentas,
    getMisCompras,
    getVentaById,
    createVenta,
    getEstadisticas
} = require('./ventas.controller');
const { verificarToken, verificarAdmin } = require('../auth/auth.middleware');

router.get('/', verificarToken, verificarAdmin, getVentas);
router.get('/estadisticas', verificarToken, getEstadisticas);
router.get('/mis-compras', verificarToken, getMisCompras);
router.get('/:id', verificarToken, getVentaById);
router.post('/', verificarToken, createVenta);

module.exports = router;