//jshint esversion:6

//require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
//const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        // Store hash in userDB.
        const newUser = new User({
            user: req.body.username,
            //password: md5(req.body.password)//----access hash function
            password: hash
        });
        newUser.save()
            .then(() => {
                console.log("Successfully saved new user");
                res.render("secrets");
            })
            .catch((err) => {
                console.log(err);
            });
    });
});

app.post("/login", function (req, res) {
    const user = req.body.username;
    const password = req.body.password;

    User.findOne({ user: user })
        .then((foundUser) => {
            console.log(foundUser);
            bcrypt.compare(password, foundUser.password, function (err, result) {
                if (result === true) {
                    res.render("secrets");
                    console.log("Successfully login");
                    console.log(foundUser.password);
                } else {
                    console.log(err);
                }
            })
        })
        .catch((err) => {
            console.log(err);
        });

});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});