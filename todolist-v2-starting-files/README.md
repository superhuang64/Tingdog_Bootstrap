# Todolist with databse
This is a Todolist APP. 
Database: [mongodb atalas](https://cloud.mongodb.com/v2/6454c12558a967594bc25391#/metrics/replicaSet/6454c2275811954f1c29705f/explorer/todolistDB/lists/find)

deploy:
[glitch](https://defiant-brawny-stag.glitch.me/)

### Tech:
1. server-side development: node.js
  - express, body-parser, ejs, export module
2. templating systems: **EJS**
3. mongoDB atlas
  - **MongoDB, Mongoose**
4. .gitignore

📷
- main todolist page
- custom list pages
- about page

📜
- technological process(summary and detailed)
- function blocks
  - how to get real-time date with customized format
  - how to delete the term in an array which has been ticked in the checkbox
    - identifier of the checkbox
    - delete term in the array with mongoose manipulation
- other notes

---

## technological process
1. **HTML**:EJS template(bootstrap+css style sheet)
  - views-partials
    - header and footer
  - pages:
    - main list page
    - parameter list page
    - about
2. ⭐️ node.js export module 
3. **Database**: MongoDB atlas(node.js)
  - MongoDB atalas(create todolistDB)
      - mongoose:schema,model(collection)
        - schema
          - two collections:
            - items: default items
            - ⭐️ lists: custom lists array
              - deault items + items for each list
              - schema relationship(embedded schema)
4. ⭐️ render content to page(database to user interface)
    - get:route parameter page
    - post:
      - parse html data(⭐️ element id)
      - database manipulation
        - CRUD
      - ejs template script

---

1. EJS templating
- [Embedded JavaScript templating](https://ejs.co/)
  - run code inside template
  - add to the **views** folder
  - send **template string/data** to .ejs page:
    - `res.render("list", { listTitle: day, newListItems: items });`
- ejs-Script tag(used in html)
  - `<% %>` for the script code; 
  - `<%= %>` for ejs value--template string/data is the control 
    object
- ejs partials
  - reuse the same HTML across multiple views
  - `<%- include('header'); -%>`

2. node.js export module 
- pass functions and data between files
- module.exports:
  - module:variable that represents the current module
  - exports:object as an module, includes properties or methods
- same level folder of app.js
  - local path- date.js(module- functions)- app.js(require module)
`exports.getDate = function(){}`
```
const date = require("./date.js");
const day = date.getDay();
```

3. MongoDB Atlas
- Connect
  - create todolistDB in mongodb atalas sever
- schema
  - create collections

4. connect database with html(pass data to user interface)
**get data**
- get"/": 
  - whether default items has been added to the collection(for the first time render)
- get"/:params": 
  - whether the custom list is new or not
**post data**(add or delete item)
- place
  - whether the posted data is in main list or custom list(which)
- object
  - parse form data
  - ⭐️ id for the targeted item
    - form data: set attributes(name and value), connect to the template string 
- manipulation
  - the method to find and update

## function blocks
### get real-time date with customized format
- select and formate date
`.toLocaleDateString(locales,options)`
```
const today = new Date();
    const options = {
        weekday: "long",
        month: "long",
        day: "numeric"
    };
    return today.toLocaleDateString("en-US", options);
```
### Delete the term in array which has been ticked in the checkbox
- form data: check box and input
- submit the checkbox when ticked
`onchange="this.form.submit()"`
- identifier of the item which has been ticked
  - ⭐️⭐️ use templating string&item id as checkbox **value**
```
<input type="checkbox" name="checkbox" onchange="this.form.submit()" value=<%=item.id%>>
```
- delete the term in an array
```
 List.findOneAndUpdate(
    { name: listName }, 
    { $pull: { items: { _id: checkedBoxId } } })
```

### other notes
1. css- public file
serving static files in express
pre-made stylesheet
`app.use(express.static("public"));`
2. `res.write()` to send multiple pieces of data


