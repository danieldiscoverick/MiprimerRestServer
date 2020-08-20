require('./config/config')

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Configuracion global de rutas
app.use(require('./routes/index'));



//conexion a mongoose
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, resp) => {
    if (err) {
        throw err;
    }
    console.log('Base de datos conectada');
});


app.listen(process.env.PORT, () => {
    console.log('excuchando en el puerto: ', process.env.PORT);
})