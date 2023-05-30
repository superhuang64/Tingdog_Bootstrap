# Secrets APP
This is an app where you can share you secrets. 

Tech:
authentication

# Screenshot
<img src="screenshot/secrets-authentication.gif" alt="secrets app" >

---

Home---register/login---secrets

📜
- introduction of 6 levels authentication

---
## level 1 - username and passord
- store in mongodb
  - create userdb

## level 2
- data encryption
  - Password+key---Cipher method--cipher text
  - key + cipher text---Cipher method--Password

**level 2/1**
- data encryption-mongoose encryption&mongoose **plugins**
- module `mongoose-encryption`
  - create schema
  - Create a single secret string to encrypt
  - add a encrypt plugin to mongoose schema
`userSchema.plugin(encrypt, { secret: secret,encryptedFields:["passord"] });`
  - model
- Authentication
  - the passord stored in db has already been encrypted with 
    secret
	- can be decrypted with secret
  - Authentication: compare the body password and stored 
    password

**level 2/2**
- data encryption-Use **environmental variables** to store 
  secrets
- module `dotenv`
  - `require('dotenv').config();`(put in top of the modules)
  - create `.env` file, include it to `.gitignore`
  - Add secrets to .env `SECRET="Thisisourlittlesecret"`
  - use secret for plugin 
  `userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });`

## level 3
**hashing**
- Password---hash function----hash
- module `md5`
`const md5 = require('md5');`
  - hash the password when the user is registered(the password stored in db has already been hashed)
  `md5('password');`
- authentication:
  - hash the user input and compare

## level 4
**salting and hashing**
- use salt round the enhance security
- module `bcrypt` 
```
const bcrypt = require('bcrypt');
const saltRounds = 10;
```
- ⭐️ Technique:
  - Hash a password(register)
`bcrypt.hash(myPlaintextPassword,saltRounds,function(err,hash){// newuser:use hash as passord to store.});`
  - Check a password(login)
`bcrypt.compare(user input password, stored password, function(err, result) { // result == true });`

## ⭐️ level 5 
**Using passport.js to add Cookies and sessions**
- Store user's data across different pages of the site(during the time of the activity)
- ⭐️ unique **session id**
- Session data is stored server-side.
- Only session id is stored in cookie. 
1. Install four packages
`npm install passport passport-local passport-local-mongoose express-session`
2. Require the three modules
```
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
```
[express-session](https://www.npmjs.com/package/express-session)
Session cookies
cookies that last for a session
contain information that is stored in a temporary memory location
never stored on your device.
once request(init),server creates the session id that temporarily stores the session cookie.
allow websites to remember users 
vital for user experience 
[understand saveUninitialized and resave in express-session](https://stackoverflow.com/questions/40381401/when-to-use-saveuninitialized-and-resave-in-express-session)

---
## Passport.js
[passport.js](https://www.passportjs.org/)
- authentication middleware for Node.js
- make it easy to implement authentication and authorization
[passport module](https://www.npmjs.com/package/passport)
- maintain persistent login sessions
```
app.use(passport.initialize());//use Passport in an Express or Connect-based application
app.use(passport.session());//uses persistent login sessions
```
- authenticate() function ⭐️
  - as route middleware to authenticate requests
- has over 480 authentication strategies 

### verify password
Install passport and the passport-local strategy as dependencies.
```
$ npm install passport
$ npm install passport-local
```

**LocalStrategy configuration**
fetch the user record from the app's database and verify the hashed password against the password submitted by the user.
for authentication
```
passport.use(new LocalStrategy(function verify(username, password, cb) {
  db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, row) {
    if (err) { return cb(err); }
    if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

    crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, row);
    });
  });
}));
```
**authenticate when signin**⭐️
```
router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));
```
---

### Configure passport to establish session
```
$ npm install express-session
$ npm install connect-sqlite3 //session store
```
```
var passport = require('passport');
var session = require('express-session');
```

**add session support to the app, then authenticate the session**
- establish a login session after authenticating a username and password
- below `app.use(express.static(__dirname, 'public'));`
```⭐️
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.authenticate('session'));
```

**configure Passport to persist user information in the login session**
```⭐️
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});
```
---

### add signout to terninate the session
```
app.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
```
---
### add a signup page that allows users to create an account
1. get request
```
router.get('/signup', function(req, res, next) {
  res.render('signup');
});
```

2. create signup.ejs page with form element
```
<h1>Sign up</h1>
<form action="/signup" method="post">
    <section>
        <label for="username">Username</label>
        <input id="username" name="username" type="text" autocomplete="username" required>
    </section>
    <section>
        <label for="new-password">Password</label>
        <input id="new-password" name="password" type="password" autocomplete="new-password" required>
    </section>
    <button type="submit">Sign up</button>
</form>
```

3. handle the form submission(post)
- create a new user record in the app's database, storing the username and hashed password.
```
router.post('/signup', function(req, res, next) {
  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
    if (err) { return next(err); }
    db.run('INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
      req.body.username,
      hashedPassword,
      salt
    ], function(err) {
      if (err) { return next(err); }
      var user = {
        id: this.lastID,
        username: req.body.username
      };
      req.login(user, function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    });
  });
});
```
---
## [Express-session](https://www.npmjs.com/package/express-session)
### use express-session to keep a user log in session.
```
var express = require('express')
var session = require('express-session')
```
```
// middleware to test if authenticated
function isAuthenticated (req, res, next) {
  if (req.session.user) next()
  else next('route')
}

app.get('/', isAuthenticated, function (req, res) {
  // this is only called when there is an authentication user due to isAuthenticated ⭐️
  res.send('hello, ' + escapeHtml(req.session.user) + '!' +
    ' <a href="/logout">Logout</a>')
})

app.get('/', function (req, res) {
  res.send('<form action="/login" method="post">' +
    'Username: <input name="user"><br>' +
    'Password: <input name="pass" type="password"><br>' +
    '<input type="submit" text="Login"></form>')
})

app.post('/login', express.urlencoded({ extended: false }), function (req, res) {
  // login logic to validate req.body.user and req.body.pass
  // would be implemented here. for this example any combo works

  // regenerate the session, which is good practice to help
  // guard against forms of session fixation
  req.session.regenerate(function (err) {
    if (err) next(err)

    // store user information in session, typically a user id
    req.session.user = req.body.user

    // save the session before redirection to ensure page
    // load does not happen before session is saved
    req.session.save(function (err) {
      if (err) return next(err)
      res.redirect('/')
    })
  })
})

app.get('/logout', function (req, res, next) {
  // logout logic

  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  req.session.user = null
  req.session.save(function (err) {
    if (err) next(err)

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err)
      res.redirect('/')
    })
  })
})

```

## [passport-local-mongoose](https://www.npmjs.com/package/passport-local-mongoose)
a Mongoose **plugin** that simplifies building username and password login with Passport.
add a username, hash and salt field to store the username, the hashed password and the salt value.
```
> npm install passport-local-mongoose
const passportLocalMongoose = require('passport-local-mongoose');
const User = new Schema({});
User.plugin(passportLocalMongoose);
```

**setup Passport-Local Mongoose**
- provides static **authenticate method** of model in **LocalStrategy**
- Passport-Local Mongoose use the **pbkdf2** algorithm(hash algorithm) of the node crypto library.
```
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

//simplified version
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());⭐️

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
```

methods 
.authenticate()⭐️
.serializeUser()
.deserializeUser()
.register(user, password, cb)⭐️
.findByUsername()
.createStrategy()⭐️

passport-local-mongoose is async/await enabled

---

## Level6 
**OAuth2.0 implement sign in with google**
OAuth 2.0- open authentication
[google-oauth20](https://www.passportjs.org/packages/passport-google-oauth20/)
module:`passport-google-oauth20`
`$ npm install passport-google-oauth20
`
get google pauth2.0 client id and client secret
### Configure Google authentication strategy
