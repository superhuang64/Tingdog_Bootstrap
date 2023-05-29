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
⭐️ unique **session id**
Session data is stored server-side.
Only session id is stored in cookie. 

[express-session](https://www.npmjs.com/package/express-session)
Session cookies
cookies that last for a session
contain information that is stored in a temporary memory location
never stored on your device.
once request(init),server creates the session id that temporarily stores the session cookie.
allow websites to remember users 
vital for user experience 
[understand saveUninitialized and resave in express-session](https://stackoverflow.com/questions/40381401/when-to-use-saveuninitialized-and-resave-in-express-session)

[passport.js](https://www.passportjs.org/)
authentication middleware for Node.js
make it easy to implement authentication and authorization

## Level6 
**OAuth2.0 implement sign in with google**
OAuth 2.0- open authentication
