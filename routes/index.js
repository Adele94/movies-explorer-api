const router = require('express').Router();
const routesUser = require('./users');
const routesMovie = require('./movies');
const routesAuth = require('./auth');
const auth = require('../middlewares/auth');
const { NotFoundError } = require('../errors/NotFoundError');

router.use(routesAuth);
router.use(auth, routesUser);
router.use(auth, routesMovie);

router.use('*', () => { throw new NotFoundError('Ресурс не найден'); });

module.exports = { router };
