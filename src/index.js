require('dotenv').config();
const express = require('express');
// const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const { Server: Httperver } = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();
const httpServer = new Httperver(app);

const { logConsole } = require('./helpers/loggers.js');
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// app.use(session({
//   secret: 'keyboard cat',
//   cookie: {
//     httpOnly: false,
//     secure: false,
//     maxAge: +process.env.COOKIES_MAXAGE
//   },
//   rolling: true,
//   resave: true,
//   saveUninitialized: false,
// }));
app.use(passport.initialize());
// app.use(passport.session());

// Ejs
var path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Router
const productRouter = require('./routers/products');
app.use('/api/products', productRouter);

const cartRouter = require('./routers/cart');
app.use('/api/cart', cartRouter);

const authRouter = require('./routers/auth');
app.use('/api/auth', authRouter);

const configRouter = require('./routers/config');
app.use('/api/config', configRouter);


const daoSelection = require('./helpers/daoSelection').messageDaoSelection;
const messages = daoSelection();

let users = {};

// -- Version Nueva -- //
const io = new IOServer(httpServer);

io.on('connection', socket => {
  console.log(`Nuevo cliente conectado: ${socket.id}`);

  socket.on('mensajeNuevo', async (data) => {
    console.log('Mensaje nuevo', socket.id, data);

    users[data.from] = socket.id;

    await messages.create(data);

    io.to(users[data.to]).emit('mensajes', data.message);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });

});

// // -- Express -- //
const server = httpServer.listen(port, () => {
  console.log(`HTTP Server in port: ${server.address().port}`)
})

server.on("error", error => console.log(`Error en servidor ${error}`))


