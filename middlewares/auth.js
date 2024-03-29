const User = require('../services/user');
const asyncHandler = require('express-async-handler');

module.exports = asyncHandler(async function auth(req, res, next) {
    const userId = req.session.userId;
    res.locals.currentUser = null;
    if(!userId) {
        return next();
    }
    const user = await User.findUserById(userId);
    if(!userId) {
        return next();
    }
    req.currentUser = user;
    res.locals.currentUser = user; 
    next();
});