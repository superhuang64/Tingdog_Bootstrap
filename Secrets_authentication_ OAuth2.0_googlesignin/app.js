//jshint esversion:6

require('dotenv').config();
const express = require("express");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
//const md5 = require('md5');
//const bcrypt = require('bcrypt');
//const saltRounds = 10;
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const env = require("dotenv").config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//initial configuration/ session
app.use(session({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/userDB");
    console.log("connected!");
}

//create user schema
const userSchema = new mongoose.Schema({
    user: String,
    password: String,
    googleId: {
        type: String,
        unique: true
    },
    secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);

//Configure Passport/Passport-Local
//create a new local login strategy

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(async function (id, done) {
    let err, user;
    try {
        user = await User.findById(id).exec();
    }
    catch (e) {
        err = e;
    }
    done(err, user);
});

// passport.serializeUser(function (user, done) {
//     process.nextTick(function () {
//         done(null, { id: user.id });
//     });
// });

// passport.deserializeUser(async function (user, done) {

//     process.nextTick(function () {
//         return done(null, user);
//     });
// });

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ username: profile.displayName, googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });

    }
));

//-------home

app.get("/", function (req, res) {
    res.render("home");
});

//-------login

app.route("/login")

    .get(function (req, res) {
        res.render("login");
    })

    .post(async (req, res) => {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });
        req.login(user, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets");
            });
        });
    });

//-------register

app.route("/register")

    .get(function (req, res) {
        res.render("register");
    })

    .post(function (req, res) {
        //Authenticate the user- passportlocalmongoose
        User.register({ username: req.body.username, active: false }, req.body.password, function (err, user) {
            if (err) {
                req.flash('error', err.message);
                res.redirect("/register");
            } else {
                //setup the login session for the authenticated user- passport
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/secrets");
                });
            }
        }
        );
    });

//-------logout

app.get('/logout', function (req, res, next) {
    req.logout(function (err) { //passport
        if (err) { return next(err); }
        res.redirect('/');
    });
});

//-------/auth/google

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

//-------/auth/google/secrets

app.get('/auth/google/secrets',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.render("secrets");
    }
);

//-------secrets

app.get("/secrets", function (req, res) {

    User.find({ "secret": { $ne: null } })
        .then((foundUsers) => {
            res.render("secrets", { usersWithSecrets: foundUsers });
        })
        .catch((err) => {
            console.log("err");
        });

});

//-------submit

app.route("/submit")

    .get(function (req, res) {
        if (req.isAuthenticated()) { // middleware to test if authenticated/ express-session
            res.render("submit");
        } else {
            res.redirect("/login");
        }

    })

    .post(async function (req, res) {
        if (req.isAuthenticated()) {
            const submittedSecret = req.body.secret;
            const user = await User.findById(req.user._id).exec();
            //.exec()-- from Mongoose API, when retrive and find it.
            user.secret = submittedSecret;
            await user.save().then(() => res.redirect("/secrets"));
            return;
        }
        res.redirect("/login");
    });


app.listen(3000, function () {
    console.log("Server started on port 3000");
});

