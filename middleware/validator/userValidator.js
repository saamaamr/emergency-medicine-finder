const { check } = require('express-validator')
/* ==== Signup validator ===== */
const signupValidator = [
  check('firstName').isLength({ min: 1 }).withMessage('Name is required'),
  check('email').isLength({ min: 1 }).withMessage('Email is required'),
  check('pass').isLength({ min: 1 }).withMessage('Password is required'),
]
/* ===== Login validator ===== */
const loginValidator = [
  check('email').isLength({ min: 1 }).withMessage('Email is required'),
  check('pass').isLength({ min: 1 }).withMessage('Password is required'),
]
module.exports = { signupValidator, loginValidator }
