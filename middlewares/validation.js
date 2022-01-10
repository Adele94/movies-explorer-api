const validator = require('validator');
const { celebrate, Joi, Segments } = require('celebrate');

const EmailAndPasswordValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email()
      .custom((value, helpers) => {
        if (validator.isEmail(value)) {
          return value;
        }
        return helpers.message('Не соответсвует формату почты');
      }).required(),
    password: Joi.string().required(),
  }),
});

const SignUpValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().email()
      .custom((value, helpers) => {
        if (validator.isEmail(value)) {
          return value;
        }
        return helpers.message('Не соответсвует формату почты');
      }).required(),
    password: Joi.string().required(),
    avatar: Joi.string()
      .custom((value, helpers) => {
        if (validator.isURL(value, { require_protocol: true })) {
          return value;
        }
        return helpers.message('Не соответсвует формату ссылки');
      }),
  }),
});

const NameAndEmailValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email()
      .custom((value, helpers) => {
        if (validator.isEmail(value)) {
          return value;
        }
        return helpers.message('Не соответсвует формату почты');
      }).required(),
  }),
});

const MovieIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().required()
      .custom((value, helpers) => {
        if (value.length === 24) {
          return value;
        }
        return helpers.message('Не соответсвует формату id карточки');
      }),
  }),
});

const MovieValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required()
      .custom((value, helpers) => {
        if (validator.isURL(value, { require_protocol: true })) {
          return value;
        }
        return helpers.message('Не соответсвует формату ссылки');
      }),
  }),
});

module.exports = {
  EmailAndPasswordValidation,
  SignUpValidation,
  NameAndEmailValidation,
  MovieIdValidation,
  MovieValidation,
};
