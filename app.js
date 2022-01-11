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

// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://movies.adel.nabiullina.nomoredomains.rocks',
  'http://movies.adel.nabiullina.nomoredomains.rocks',
  'https://localhost:3000',
  'http://localhost:3000',
];

// eslint-disable-next-line consistent-return
app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых

  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  // сохраняем список заголовков исходного запроса
  const requestHeaders = req.headers['access-control-request-headers'];

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);

    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);

    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }

  next();
});

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
