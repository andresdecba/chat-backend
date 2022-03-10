/*
path: '/api/login'
*/

/// importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


/// instanciar
const router = Router();

/// ruta para crear un nuevo uuario
router.post(
    '/new',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El correo es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearUsuario,
);

/// ruta para loguearse
router.post(
    '/',
    [
        check('email', 'El correo es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
    ],
    login
);

/// ruta para renovar el token
router.get(
    '/renew',
    validarJWT,
    renewToken
);

/// exportaciones
module.exports = router;