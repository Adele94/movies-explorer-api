const validator = require('validator');
const { celebrate, Joi, Segments } = require('celebrate');

const EmailAndPasswordValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const SignUpValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const NameAndEmailValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

const MovieIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

const MovieValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    trailer: Joi.string().required(),
    thumbnail: Joi.string().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports = {
  EmailAndPasswordValidation,
  SignUpValidation,
  NameAndEmailValidation,
  MovieIdValidation,
  MovieValidation,
};
