const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { EmailAndPasswordValidation, SignUpValidation } = require('../middlewares/validation');

router.post('/signin', EmailAndPasswordValidation, login);
router.post('/signup', SignUpValidation, createUser);

module.exports = router;
