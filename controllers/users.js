const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SALT_ROUNDS, JWT_DEV_TOKEN } = require('../config/index');

const { NODE_ENV, JWT_SECRET } = process.env;

const { ConflictError } = require('../errors/ConflictError');
const { BadRequestError } = require('../errors/BadRequestError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');
const { NotFoundError } = require('../errors/NotFoundError');

const getProfile = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному userId не найден.');
      }
      res.status(200).send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  ).orFail(new NotFoundError('Пользователь с указанным userId не найден.'))
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному userId не найден.');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
      }
      next(err);
    });
};

// Регистрация пользователя
const createUser = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    throw new BadRequestError('Отсутствует электронная почта или пароль');
  }

  bcrypt.hash(req.body.password, SALT_ROUNDS)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => {
      res.status(201).send(user.serialize());
    })
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователем с таким email уже существует'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
    });
};

const findUserByCredentials = function (email, password) {
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          return user; // теперь user доступен
        });
    });
};

// Авторизация пользователя
const login = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    throw new BadRequestError('Отсутствует электронная почта или пароль');
  }
  findUserByCredentials(req.body.email, req.body.password)
    .then((user) => {
      // создадим токен
      console.log('user._id', user._id);
      console.log('NODE_ENV', NODE_ENV);
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV_TOKEN, { expiresIn: '7d' });
      console.log('token', token);
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getProfile, updateUser, createUser, login,
};
