const { config } = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const path = require('path');
const session = require('express-session');
const MainRouter = require('./app/routers');
const errorHandlerMiddleware = require('./app/middlewares/error_middleware');
const whatsapp = require('wa-multi-session');
const bodyParser = require('body-parser');
const scheduler = require('./app/schedulers/whatsappCheck');

config();
scheduler.start();

var app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Session management
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret', // Change this to a secure key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using https
}));

app.set('view engine', 'ejs');
// Public Path
app.use('/p', express.static(path.resolve('public')));
app.use('/p/*', (req, res) => res.status(404).send('Media Not Found'));

app.use(MainRouter);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || '5000';
app.set('port', PORT);
var server = http.createServer(app);
server.on('listening', () => console.log('APP IS RUNNING ON PORT ' + PORT));

server.listen(PORT);

whatsapp.onConnected((session) => {
  console.log('connected => ', session);
});

whatsapp.onDisconnected((session) => {
  console.log('disconnected => ', session);
});

whatsapp.onConnecting((session) => {
  console.log('connecting => ', session);
});

whatsapp.loadSessionsFromStorage();
