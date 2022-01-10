require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routesUser = require('./routes/users');
const routesMovie = require('./routes/movies');
const routesAuth = require('./routes/auth');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NotFoundError } = require('./errors/NotFoundError');

const app = express();
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
}).then(() => console.log('Connection Successful'))
  .catch((err) => console.log(err));

app.use(requestLogger); // подключаем логгер запросов

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routesAuth);
app.use(auth, routesUser);
app.use(auth, routesMovie);
app.use('*', () => { throw new NotFoundError('Ресурс не найден'); });

app.use(errorLogger); // подключаем логгер ошибок

// здесь централизованно обрабатываем все ошибки
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        // ? 'На сервере произошла ошибка'
        ? err.message
        : message,
    });
});

module.exports = app;
