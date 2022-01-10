const router = require('express').Router();
const { getProfile, updateUser } = require('../controllers/users');
const { NameAndEmailValidation } = require('../middlewares/validation');

router.get('/users/me', getProfile); // возвращает информацию о текущем пользователе (email и имя)
router.patch('/users/me', NameAndEmailValidation, updateUser); // обновляет профиль (email и имя)

module.exports = router;
