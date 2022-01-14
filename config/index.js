const {
  SALT_ROUNDS = 10,
  JWT_DEV_TOKEN = 'dev-secret-key',
  MONGODB_URL = 'mongodb://localhost:27017/moviesdb',
  PORT = '3000',
} = process.env;

module.exports = {
  SALT_ROUNDS,
  JWT_DEV_TOKEN,
  MONGODB_URL,
  PORT,
};
