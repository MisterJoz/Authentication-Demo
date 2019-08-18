var express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('./models/user.js');

mongoose.connect("mongodb://localhost/auth_demo_app", {
    useNewUrlParser: true
});

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(require('express-session')({
    secret: "Luna is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));
//next two lines are needed to run passport
app.use(passport.initialize());
app.use(passport.session());

//importand passport-local-mongoose methods
//
//serializeUser serializes(encodes) the data and puts it back in the session
//
//deserializeUser encoded data from session
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=================
// ROUTES
//=================

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/secret", isLoggedIn, function (req, res) {
    res.render("secret");
});

// AUTH ROUTES

//show sign up form
app.get("/register", function (req, res) {
    res.render("register");
});

//handling user sign up
app.post("/register", function (req, res) {
    //passport handles everthing
    User.register(new User({
        username: req.body.username
    }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        //logs user in
        passport.authenticate('local')(req, res, function () {
            res.redirect('/secret');
        });
    });
});

//LOGIN ROUTES
//render login form
app.get("/login", function (req, res) {
    res.render("login");
});

//login logic  
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "login"
}), function (req, res) {
    res.render("login");
})

//logout
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect("/");
})

//middleware function to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.listen(PORT = 3000, function (req, res) {
    console.log("Server started.....");
});