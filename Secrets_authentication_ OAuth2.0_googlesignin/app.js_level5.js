//jshint esversion:6

require('dotenv').config();
const express = require("express");
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

//init the passport---use passport to deal with the session
app.use(passport.initialize());
app.use(passport.session());

//mongoose set up and connect to the database
main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/userDB");
    console.log("connected!");
}

//create user schema
const userSchema = new mongoose.Schema({
    user: String,
    password: String
});
//--------------------add encrypt as a plugin
//--use the secret stored in .env
//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

//Plugin Passport-Local Mongoose
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

//Configure Passport/Passport-Local
//create a new local login strategy

passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


passport.serializeUser(function (user, done) {
    process.nextTick(function () {
        done(null, { id: user._id, username: user.user });
    });
});
passport.deserializeUser(function (user, done) {
    process.nextTick(function () {
        return done(null, user);
    });
});

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/secrets", function (req, res) {

    if (req.isAuthenticated()) { // middleware to test if authenticated/ express-session
        res.render("secrets");
    } else {
        res.redirect("/login");
    }

});

// app.post("/register", async (req, res) => {
//     try {
//         const registerUser = await User.register(
//             { username: req.body.username }, req.body.password
//         );
//         if (registerUser) {
//             passport.authenticate("local")(req, res, function () {
//                 res.redirect("/secrets");
//             });
//         } else {
//             res.redirect("/register");
//         }
//     } catch (err) {
//         res.send(err);
//     }
// });


app.post("/register", function (req, res) {
    //Authenticate the user- passportlocalmongoose
    User.register({ username: req.body.username, active: false }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            res.redirect("/register");
        } else {
            //setup the login session for the authenticated user- passport
            const authenticateUser = passport.authenticate('local', { successRedirect: '/secrets' });
            authenticateUser(req, res);

            // passport.authenticate('local', {
            //     successRedirect: '/secrets'
            // })(req, res);

            // passport.authenticate("local")(req, res, function () {
            //     res.redirect("/secrets");
            // });
        }
    }
    );
});

app.post("/login", function (req, res) {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, (err) => { //passport
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    })

});

app.get('/logout', function (req, res, next) {
    req.logout(function (err) { //passport
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});

