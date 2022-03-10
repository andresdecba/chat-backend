const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {

    // capturar el token
    const token = req.header('x-token');
    
    // comprobar si viene un token en la peticion
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay tal token'
        });        
    }

    // verificar si el token es valido
    try {

        const {uid} = jwt.verify(token, process.env.JWT_KEY);
        req.uid = uid;        
        next();
    } catch (error) {

        return res.status(401).json({
            ok: false,
            msg: 'el token no es valido'
        })        
    }
}

module.exports = {
    validarJWT
}