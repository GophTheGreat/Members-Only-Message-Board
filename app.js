var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/user');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//Test user is:
//qwerty
//aAsSdDfF1!
//the password is password

const mongodb = "mongodb+srv://tealeverywhere:g0ph3rit@cluster0.87fskqd.mongodb.net/membersonly?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongodb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      const match = await bcrypt.compare(password, user.password);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      };
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    };
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});

module.exports = app;
