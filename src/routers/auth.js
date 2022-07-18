const express = require('express');
const { faker } = require('@faker-js/faker');
const passport = require('passport');
const bCrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy
const router = express.Router();
const userDaoSelection = require('../helpers/daoSelection').userDaoSelection;
const logger = require('../middlewares/logger')
const sendEmail = require('../helpers/emails');
const jwt = require('jsonwebtoken');

router.use(logger);

const userDao = userDaoSelection();

// passport strategies
// login
passport.use('login', new LocalStrategy(
  async (username, password, done) => {
    const user = await userDao.findBy('email', username);

    if (!user || user.error) {
      return done(null, { error: 'usuario o contraseña incorrecto' });
    }

    if (!bCrypt.compareSync(password, user.password)) {
      return done(null, { error: 'usuario o contraseña incorrecto' });
    } 

    delete (user.password);

    const token = jwt.sign({
      data: user
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return done(null, {token});
  }
));

// signup
passport.use('signup', new LocalStrategy({
  passReqToCallback: true,
},
  async (req, email, password, done) => {
    try {
      const user = await userDao.findBy('email', email);

      if (user) {
        return done(null, { error: 'usuario ya existe' });
      }

      const newUser = await userDao.create({
        ...req.body,
        password: createHash(password)
      });
      delete (newUser.password);

      // mail de bienvenida
      await sendEmail(newUser.email, 'Bienvienido', '<b>Te has creado una cuenta en el sitio satisfactorriamente!</b>');

      // mail al administrador
      await sendEmail(process.env.EMAIL_ADMIN, 'Nuevo Registro', JSON.stringify(newUser));

      return done(null, newUser);
    } catch (error) {
      return done(null, error);
    }
  }
));

// passport serializers
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// helpers
const createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  // return bCrypt.hashSync(password, '$2b$10$bWDH0FuuSAOX/sOGgBP8zu', null);
};

// router
// login
router.post(
  '/login',
  passport.authenticate('login'),
  async (req, res) => res.json(req.user)
);

router.post(
  '/signup',
  passport.authenticate('signup'),
  async (req, res) => res.json(req.user)
);

router.post(
  '/migration',
  async (req, res) => {
    for (let i = 0; i < 10; i++) {
      await userDao.create({
        username: faker.internet.userName(),
        password: createHash(faker.internet.password()),
        email: faker.internet.email(),
        direccion: faker.address.streetAddress(true),
        edad: faker.random.numeric(2),
        telefono: faker.phone.number('501-###-###'),
        foto: faker.internet.avatar()
      });
    }

    const allUsers = await userDao.findAll();
    res.status(200).json(allUsers);
  });

module.exports = router;
