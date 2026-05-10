const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.urlencoded({ extended: true }));

let loginCount = 0;
let reqCount = 0;

app.post('/login', (req, res) => {
  loginCount++;
  const token = jwt.sign({ name: 'Test', mail: 'test@test.com', role: 'user' }, process.env.JWT_SECRET, { expiresIn: '3d' });
  res.clearCookie(process.env.COOKIE_NAME);
  res.cookie(process.env.COOKIE_NAME, token, { maxAge: 3 * 24 * 60 * 60 * 1000, httpOnly: true, signed: true, encode: String });
  res.json({ login: loginCount, token: token.substring(0, 20) + '...' });
});

app.get('/check', (req, res) => {
  const token = req.cookies[process.env.COOKIE_NAME];
  const signed = req.signedCookies[process.env.COOKIE_NAME];
  res.json({
    rawCookie: token ? token.substring(0, 20) : null,
    signedCookie: signed ? signed.substring(0, 20) : null,
    cookieName: process.env.COOKIE_NAME,
    jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
  });
});

app.get('/req', (req, res) => {
  reqCount++;
  const token = req.cookies[process.env.COOKIE_NAME];
  if (!token) return res.json({ error: 'no cookie', count: reqCount });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.json({ error: err.message, count: reqCount });
    res.json({ ok: true, role: decoded.role, count: reqCount });
  });
});

app.listen(4002, () => console.log('Debug server on 4002'));