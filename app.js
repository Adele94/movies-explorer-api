require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { routesUser, routesMovie, routesAuth } = require('./routes/index');
const { limiter } = require('./config/constants');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NotFoundError } = require('./errors/NotFoundError');

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
}).then(() => console.log('Connection Successful'))
  .catch((err) => console.log(err));

app.use(limiter);
app.use(helmet());
app.use(requestLogger); // подключаем логгер запросов
app.use(cors);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routesAuth);
app.use(auth, routesUser);
app.use(auth, routesMovie);
app.use('*', () => { throw new NotFoundError('Ресурс не найден'); });

app.use(errorLogger); // подключаем логгер ошибок

// здесь централизованно обрабатываем все ошибки
app.use(errorHandler);

module.exports = app;
