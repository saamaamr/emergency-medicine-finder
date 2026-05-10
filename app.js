const express = require('express');
const cookieParser = require('cookie-parser');
const env = require('dotenv');
const router = require('./routers/routes');
const errorHandler = require('./middleware/errorHandler');
const UserModels = require('./models/UserModels');

const app = express();
env.config();

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./middleware/AuthMiddleware').checkUser)

app.use(router);
app.use(errorHandler);

require('./cron')();

setInterval(async () => {
  try {
    await UserModels.cleanupExpiredSessions();
  } catch (err) {
    console.error('Session cleanup error:', err.message);
  }
}, 10 * 60 * 1000);

const PORT = process.env.PORT || 3480;
app.listen(PORT, () => {
  console.log(`Server Running http://localhost:${PORT}`);
});