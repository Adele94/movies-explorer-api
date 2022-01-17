const jwt = require('jsonwebtoken');
const { JWT_DEV_TOKEN } = require('../config/index');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

// верификация токена из куки
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ForbiddenError('Доступ запрещен');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_TOKEN);
  } catch (e) {
    const err = new UnauthorizedError('Необходима авторизация');
    next(err);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
