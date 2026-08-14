const express = require('express');
const router = express.Router();
const {
    getDomicilios,
    getMisDomicilios,
    getMisEntregas,
    asignarRepartidor,
    cambiarEstado
} = require('./domicilios.controller');
const { verificarToken, verificarAdmin, verificarRoles } = require('../auth/auth.middleware');

router.get('/mis-domicilios', verificarToken, getMisDomicilios);
router.get('/mis-entregas', verificarToken, verificarRoles('domiciliario'), getMisEntregas);
router.get('/', verificarToken, verificarAdmin, getDomicilios);
router.patch('/:id/asignar', verificarToken, verificarAdmin, asignarRepartidor);
router.patch('/:id/estado', verificarToken, verificarRoles('admin', 'domiciliario'), cambiarEstado);

module.exports = router;
