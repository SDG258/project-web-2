const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
var path = require('path');
const db = require('./services/db');

const port = process.env.PORT || 3000;

const app = express();

//Session
app.use(cookieSession({
    name: 'session',
    keys: ['123456'],
    maxAge: 24 * 60 * 60 * 1000, //24h
}));

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
//Auth middlewares
app.use(require('./middlewares/auth'));

//Route
app.get('/', require('./routes/index'));
app.use('/signin', require('./routes/signin'))
app.use('/signup', require('./routes/signup'));
app.get('/logout', require('./routes/logout'));
app.use('/profile', require('./routes/profile'));


db.sync().then(function() {
    app.listen(port);
    console.log(`Server is listening on port ${port}`);
}).catch(function(err) {
    console.log(err);
});