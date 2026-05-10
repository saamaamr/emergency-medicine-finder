const express = require('express');
const cookieParser = require('cookie-parser');
const env = require('dotenv');
const router = require('./routers/routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
env.config();

app.use(cookieParser())
app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./middleware/AuthMiddleware').checkUser)

app.use(router);
app.use(errorHandler);

const PORT = process.env.PORT || 3480;
app.listen(PORT, () => {
  console.log(`Server Running http://localhost:${PORT}`);
});
