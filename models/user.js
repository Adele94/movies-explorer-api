const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    unique: true,
    type: String,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Не соответсвует формату почты',
    },
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.methods.serialize = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
  };
};

module.exports = mongoose.model('user', userSchema);
