const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

const sessionConfig = {
  
    name: 'monkey cookie', // default is connect.sid
    secret: 'cookiesscectetpasowrdontheheadpasswcookie',
    cookie: {
      maxAge: 1000 * 60 * 60, //36milisec 1 hour old max 
      secure: false,
      httpOnly: true 
    }, 
     // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,


    store: new knexSessionStore({
      knex: require('../database/dbConfig'),
      tablename: 'sessons',
      sidfieldname: 'sid',
      createtable: true,
      clearInterval: 1000 * 60 * 60
    })
  
  }


server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
