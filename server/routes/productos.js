const express = require('express');
let { verificaToken, verificaAdminRole } = require('../middlewares/auntenticacion');

let Producto = require('../models/producto')

let app = express();

//==============================
//  Mostrar todos los productos
//==============================
app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let hasta = req.query.hasta || 10;
    hasta = Number(hasta);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                })
            }
            res.json({
                ok: true,
                productos
            })
        })
})

//==============================
//  Mostrar producto por id
//==============================
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                })
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    error: err
                })
            }
            res.json({
                ok: true,
                producto: productoDB
            })
        })
})

//==============================
//  Buscar productos
//==============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                })
            }
            res.json({
                ok: true,
                productos
            })
        })
})

//==============================
//  Agregar producto
//==============================
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

//==============================
//  Actualizar un producto
//==============================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El producto no existe'
                }
            })
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                })
            }
            res.json({
                ok: true,
                producto: productoGuardado
            })
        })
    })
})

//==============================
//  Borrar un producto
//==============================
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El producto no existe'
                }
            })
        }
        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                })
            }
            res.json({
                ok: true,
                produto: productoBorrado,
                message: 'Producto eliminado'
            })
        })
    })
})




module.exports = app;