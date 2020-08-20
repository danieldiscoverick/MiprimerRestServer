const jwt = require('jsonwebtoken');

//======================================================
//             Verificar Token
//======================================================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, encoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = encoded.usuario;

        next();

    })

};

//======================================================
//             Verificar Admin Role
//======================================================
let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }


}

module.exports = {
    verificaToken,
    verificaAdminRole
}