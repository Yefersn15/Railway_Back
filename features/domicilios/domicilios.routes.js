const express = require('express');
const router = express.Router();
const {
    getDomicilios,
    getMisDomicilios,
    cambiarEstado
} = require('./domicilios.controller');
const { verificarToken, verificarAdmin } = require('../auth/auth.middleware');

router.get('/mis-domicilios', verificarToken, getMisDomicilios);
router.get('/', verificarToken, verificarAdmin, getDomicilios);
router.patch('/:id/estado', verificarToken, verificarAdmin, cambiarEstado);

module.exports = router;
