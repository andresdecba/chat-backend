/// importaciones
const {response} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const usuario = require('../models/usuario');


///////////////////////////
/// CREAR UN USUARIO
///////////////////////////

const crearUsuario = async (req, res = response) => {

    const{ email, password } = req.body;

    try {

        /// verificar si ya un email igual
        const existeEmail = await Usuario.findOne({email:email});
        if (existeEmail) {
            return res.status(400).json({
                ok:false,
                msg:'El correo ya esta registado'
            })
        }

        /// crear nuevo usuario
        const usuario = new Usuario(req.body);

        /// encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        /// grabar en base de datos
        await usuario.save();

        /// generar json web token
        const token = await generarJWT(usuario.id);

        /// enviar respuesta de la peticion rest
        res.json({
            ok:true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'error, hable con el admin'
        });
    }    
}

///////////////////////////
/// HACER LOGIN
///////////////////////////

const login = async (req, res = response)=>{

    const {email, password} = req.body;

    try {

        // buscar usuario en la db
        const usuarioDB = await Usuario.findOne({email});

        // corroborar si existe el email en db
        if (!usuarioDB) {
            return res.status(404).json({
                ok:false,
                msg: 'email no enconreado'
            });            
        }

        // validar el password comparando el del body con el de la db
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok:false,
                msg: 'La contraseña no es valida'
            });            
        }

        // si llegó hasta acá, generar el JWT
        const token = await generarJWT(usuarioDB.id);

        // enviar la respuesta al cliente
        res.json({
            ok:true,
            usuario : usuarioDB,
            token
        });
        
    } catch (error) {

        return res.status(500).json({
            ok: false,
            msg: 'Hable con el adminitrador'
        })        
    }


    
}

///////////////////////////
///RENOVAR EL TOKEN CUANDO EXPIRÓ
///////////////////////////

const renewToken = async (req, res = response) => {

    // obtener el uid
    const uid = req.uid;
    // generar el JWT
    const token = await generarJWT(uid);
    // obetener el usuario por el uid
    const usuario = await Usuario.findById(uid);
    // devolver esto
    res.json({
        ok : true,
        usuario,
        token
    })
}


/// exportaciones
module.exports = {
    crearUsuario,
    login,
    renewToken
}