const express = require('express');
const cookieParser = require('cookie-parser');
const env = require('dotenv');
const router = require('./routers/routes');

const app = express();
env.config();

// Remove localStorage usage - it's not appropriate for server-side Node.js
// if (typeof localStorage === "undefined" || localStorage === null) {
//    let LocalStorage = require('node-localstorage').LocalStorage;
//    global.localStorage = new LocalStorage('./scratch');
// } else {
//    global.localStorage = localStorage;
// }

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./middleware/AuthMiddleware').checkUser)
app.use(router);

const PORT = process.env.PORT || 3480;
app.listen(PORT, () => {
  console.log(`Server Running http://localhost:${PORT}`);
});


