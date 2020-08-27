const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
var path = require('path');
const CronJob = require('cron').CronJob;
const db = require('./services/db');
const User = require('./services/user');

const port = process.env.PORT || 3000;

const app = express();

const job = new CronJob('0 */1440 * * * *',function() { //Chạy sau mỗi 30p
    db.sync().then(async function(){
        const user = await User.findAll()
        user.forEach(x => {
            x.limit = 500000;
            x.save();
        });
    }).catch(console.error);

})
job.start();

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
app.use('/signin', require('./routes/signin'));
app.use('/signup', require('./routes/signup'));
app.use('/reset', require('./routes/reset'));
app.use('/otp-1', require('./routes/otp'));
app.use('/otp-2', require('./routes/otpAuthentication'));
app.use('/accounts', require('./routes/accounts'));
app.use('/saving', require('./routes/saving'));
app.use('/accounts-admin', require('./routes/accounts-admin'));
app.use('/accounts-admin-activate', require('./routes/account-admin-activate'));
app.use('/settings', require('./routes/settings'));
app.use('/settings-security', require('./routes/settings-security'));
app.get('/logout', require('./routes/logout'));


db.sync().then(function() {
    app.listen(port);
    console.log(`Server is listening on port ${port}`);
}).catch(function(err) {
    console.log(err);
});