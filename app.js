require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { routes } = require('./routes/index');
const { limiter } = require('./config/constants');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { MONGODB_URL } = require('./config/index');

const app = express();

// подключаемся к серверу mongo
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
});

app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);
app.use(helmet());
app.use(cors);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate
// здесь централизованно обрабатываем все ошибки
app.use(errorHandler);

module.exports = app;
