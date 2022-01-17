const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { MovieIdValidation, MovieValidation } = require('../middlewares/validation');

router.get('/movies', getMovies); // возвращает все фильмы
router.post('/movies', MovieValidation, createMovie); // создаёт фильм в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
router.delete('/movies/:movieId', MovieIdValidation, deleteMovie); // удаляет фильм по идентификатору

module.exports = router;
