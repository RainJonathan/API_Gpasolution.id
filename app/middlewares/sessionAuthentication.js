const express = require('express');
const session = require('express-session');

const router = express.Router();

// Mock user data for authentication
const users = {
  'admin': 'password123', // Replace with real user data
};

// Middleware to check if user is authenticated
function checkAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = {
  checkAuth: checkAuth
};
