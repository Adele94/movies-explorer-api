const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://movies.adel.nabiullina.nomoredomains.rocks',
  'http://movies.adel.nabiullina.nomoredomains.rocks',
  'https://localhost:3000',
  'http://localhost:3000',
];

// Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = { limiter, allowedCors, DEFAULT_ALLOWED_METHODS };
