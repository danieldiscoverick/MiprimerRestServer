//====================================
//          Puerto
//====================================
process.env.PORT = process.env.PORT || 3000;

//====================================
//          Puerto
//====================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


//====================================
//       Vencimiento del token
//====================================
//60 seg * 60 min * 24 horas * 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 60;

//====================================
//       SEED de autenticación
//====================================
process.env.SEED = process.env.SEED || 'Mi_se--mil-la-d-e-a-u-t-h';

//====================================
//          Base de datos
//====================================

let urlDB = '';

// if (process.env.NODE_ENV === 'dev') {
// urlDB = 'mongodb://localhost:27017/cafe';
// } else {

// }


process.env.URLDB = urlDB;

//====================================
//          Google client ID
//====================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '805299546079-7d66i3qjrnmdmds0utfatujd1v91q1dh.apps.googleusercontent.com';