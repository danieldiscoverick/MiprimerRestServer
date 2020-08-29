const express = require('express');
const fileUpload = require('express-fileupload');
let app = express();

const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se selecciono ningun archivo'
            }
        })
    };

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo no valido',
                tipos: 'Tipos validos: ' + tiposValidos.join(', ')
            }
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    //Extenciones permitidas
    let extencionesV = ['png', 'jpg', 'jpeg', 'gif', 'svg'];
    let nombreArch = archivo.name.split('.');
    let extencion = nombreArch[nombreArch.length - 1]

    if (extencionesV.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extención del archivo no valida',
                extenciones: 'Extenciones validas: ' + extencionesV.join(', ')
            }
        })
    }

    //Cmabiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });

});

function imagenUsuario(id, res, nombre) {
    Usuario.findById(id, (err, ususarioDB) => {
        if (err) {
            borrarArchivo('usuarios', nombre);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!ususarioDB) {
            borrarArchivo('usuarios', nombre);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe ningun usuario con ese ID'
                }
            });
        }

        //borrar archivo
        borrarArchivo('usuarios', ususarioDB.img);

        ususarioDB.img = nombre;
        ususarioDB.save((err, usuarioG) => {
            res.json({
                ok: true,
                usuario: usuarioG,
                img: nombre
            })
        })

    });
}

function imagenProducto(id, res, nombre) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo('productos', nombre);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borrarArchivo('productos', nombre);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe ningun producto con ese ID'
                }
            });
        }

        //borrar archivo

        borrarArchivo('productos', productoDB.img);
        productoDB.img = nombre;
        productoDB.save((err, productoG) => {
            res.json({
                ok: true,
                producto: productoG,
                img: nombre
            })
        })
    })
}

function borrarArchivo(tipo, nombreImg) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;