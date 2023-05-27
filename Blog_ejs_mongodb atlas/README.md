# Blog website with database
This is a blog website with MongoDB database. 

Tech:
- NoSQL database technology: **MongoDB**
  - **mongoose**
  - [mongodb atalas](https://cloud.mongodb.com/v2/6454c12558a967594bc25391#/clusters/detail/Cluster0)
- **Bootstrap**
- node.js:
  - **Ejs**/express/bodyParser/lodash 
    - express: route parameters

📷
pages:
  - main page/home/about/compose
  - params page:post(for each blog)

📜
1. technological process
2. MongoDB
set Route parameters
Truncate string javascript


---

### technological process(detailed in structure & knowledge base)
1. ejs template(bootstrap+css style sheet)
  - views-partials
    - header and footer:
      - CDN,scripts,link
      - templating contents
  - pages:
    - what
      - include partials
      - html
        - element:form,input,textarea,button;navbar
        - set sttributes
      - script tag
      - templating data/string
    - parameter page
2. MongoDB(node.js)
  - route:app.js
    - setup mongodb(connect&define)
      - mongodb atlas(db)
      - mongoose:schema,model(collection)
        - schema:data validation
        - schema relationship(embedded schema)
  - render page
    - get:route parameter page
    - post:
      - parse html data
      - database manipulation
        - CRUD
      - ejs template script

---

## MongoDB
Database:CRUD
NoSQL
JSON objects
stores structured data as JSON-like documents with dynamic schemas

### install mongodb and mongosh
Mongosh
	• mongo shell, connect to the mongodb server
Mongodb[CRUD operations](https://docs.mongodb.com/manual/crud/)
[Mongosh command line help](https://www.mongodb.com/docs/mongodb-shell/reference/access-mdb-shell-help/)
normal commands
```
test> help
test> show dbs
test> use shopDB
test> db
use fruitsDB
db.dropDatabase()
db.lists.drop()
```

### native mongodb driver
  - [Mongodb node.js driver](https://mongodb.github.io/node-mongodb-native/?jmp=docs)
  - install:`npm install mongodb@5.3`
  - connection url:
  `const url = "mongodb://127.0.0.1:27017";`
  - close down mondodb connection once finished
  `sudo pkill -f mongod`

### mongoose 
Mongodb object modelling for node.js
  - install: 
  `npm i mongoose`
  - require, connect, close
  ```
  const mongoose = require("mongoose");
  mongoose.connect("mongodb://localhost:27017/blogDB");
  mongoose.connection.close(); //once finished using mongoose
  ```
  - ⭐️ define: schema,model;use model
    - schema:data validation

    ```
    name: {
        type: String,
        required: [true, "please check your data 
                   entry, no name specificed"]
    },
    score: {
        type: Number,
        min: 1,
        max: 10
    }
    ```
    - schema relationship(embedded schema)
    ```
     const personSchema = new mongoose.Schema({
        name: String,
        age: Number,
        favouriteFruit: fruitSchema
    });
    ```
  - ⭐️ database manipulation: CRUD
    - [mongoose doc](https://mongoosejs.com/docs/documents.html#updating-using-save)

### mongodb native driver vs mongoose
mongodb native driver: 
  - for interacting with a mongodb instance
  - repetitive creating objects and insert
mongoose:
  - an Object modeling tool for MongoDB
  - define the schema for the documents in a particular collection
  - convenience in the creation and management of data in MongoDB

### MongoDB Atlas
  - Setup mongodb atlas
  - Connection string: 
`mongodb+srv://<username>:<password>@cluster0.zf5jj9v.mongodb.net/`

### MongoDB Atlas vs MongoDB
MongoDB Atlas:
  - multi-cloud database service by the same people
  - automated managed cloud service
MongoDB:
  - community service

---

### other notes:

Route parameters(express.js)
`app.get("/posts/:postName",function)`
`console.log(req.params.postName)`

Deal with lowercase and uppercase in url customize title
`npm i lodash `
 _.upperFirst
Lodash
`<script src="lodash.js"></script>`(included in `<header>` section)
`const _ = require("lodash");`
- lowerCase:standardize the value
  - `_.lowerCase(post.title);`

Truncate string javascript



create js object
```
 var objectName = {
 key:value,
Key:value
}
```

loop
forEach


