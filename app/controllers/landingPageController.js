// Controller methods

const express = require('express');
const session = require('express-session');
// landingPageController.js
const users = {
"admin" : "password123"
}
exports.getLandingPage = (req, res) => {
    res.render('landing_page', { data: 'anyDataYouWantToPass' });
};

exports.getLoginPage = (req, res) => {
    res.render('login', { error: null });
};

exports.postLogin = (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        req.session.user = username;
        res.redirect('/documentation');
    } else {
        res.render('login', { error: 'Invalid username or password' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};
