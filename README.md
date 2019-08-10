# Easy Express CRUD Generator

Simple express, mongoose based ```crud api generator```.

> Inspired by [GraphQL](https://graphql.org/) and [Strapi](https://strapi.io)

## Basic requirements

You should have [express](https://www.npmjs.com/package/express) app ready with [mongoose](https://www.npmjs.com/package/mongoose) and [body-parser](https://www.npmjs.com/package/body-parser) setup properly.

> **Apart from that must read minimal setup below before using it.**

> Detailed Documentation and example app will be added shortly!

## Breif Introduction

> **Query is case sensitive. All mentioned params and query stirngs are expected in lowercase.**

* **Normal query:** ```/city``` will fetch all records with all data.
* **Graphql style, Ask for data you need**: Simply add variable name in params e.g ```/city/name/country``` you will get _id, name and country only. Nothing else.
* **Search and filteration** can be done with following **query** keywords.
  ```eq, ne, lt, gt, lte, gte, in, nin, contains, ncontains, containss, ncontainss```
  Add any of the above mentioned keywords to apply filters.
  ```/city/name?name_eq=ambala``` will bring only the results where name is equal to ```ambala```
  Rest of the keywords work as follows
  * eq: equals
    ```/city/name?name_eq=ambala```
  * ne: not equals
    ```/city/name?name_ne=ambala```
  * lt: lower than
  * gt: greater than
  * lte: less than or equal to
  * gte: greater than or equal to
  * in: included in an array of values
    ```/city?name_in=ambala&name_in=mumbai&name_in=banglore```
  * nin: non included in an array of values
    ```/city?name_nin=ambala&name_nin=mumbai&name_nin=banglore```
  * contains: search by contains
    ```/city/name?name_contains=ambala```
  * ncontains: doesn't contains
    ```/city/name?name_ncontains=ambala```
  * containss: search by contains **Case Sensitive**
    ```/city/name?name_containss=ambala```
  * ncontains: doesn't contains **Case Sensitive**
    ```/city/name?name_ncontainss=ambala```
* **Sorting** can be done by following **query** keywords. ```_skip, _limit, _sort, asc, desc```
  * _skip: Skip ```n``` numbers of records
  ```/city/name?_skip=10```
  * _limit: Ask for ```n``` numbers or records (combine with _skip for pagination)
  ```/city/name?_limit=10```
  * _sort, asc, desc: Sort by a variable name ```asc || desc```
    ```/city/name?name_sort:asc```
    ```/city/name?name_sort:desc```
* **Populate:** Our model have relation with other collections as well. We can populate very easily. **There is one condition which we have to follow for connection. Library is expecting all related connections started with underscore(_). Then we can query like this** ```/city/name/_country.name/_country.shortCode```. We will get following response.
* **FindById** query can be make by following example:
```/city?_id=5d303bf55c05844dcfabf897```

```JSON
{
    "status": true,
    "data": [
        {
            "_id": "5d303bf55c05844dcfabf897",
            "name": "ambala",
            "_country": {
                "_id": "5d303bc65c05844dcfabf895",
                "name": "india"
            }
        }
    ],
    "count": 1
}
```

## Minimal example

```javascript
const bodyParser = require('body-parser');
const CRUD = require('easy-express-crud-generator');
const express = require('express');
const mongoose = require('mongoose');

// DB connection
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/dbName', (err) => {
  if (err) throw err;
  console.log('DB connected successfully!');
});
mongoose.Promise = global.Promise;

// Moongoose model define
const countrySchema = new mongoose.Schema({
  name: String,
  shortCode: String,
}, { timestamps: true });
const CountryModel = mongoose.model('Country', countrySchema);

const citySchema = new mongoose.Schema({
  _country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  name: String,
}, { timestamps: true });
const CityModel = mongoose.model('City', citySchema);

// Creating crud operations
const cityRouter = new CRUD(CityModel).getRouter(express.Router());
const countryRouter = new CRUD(CountryModel).getRouter(express.Router());

// Basic express app setup
const app = express();
app.use(bodyParser.json());
app.listen(3000);

// Custom error handler (optional)
app.use((req, res, next) => {
  req.errorHandler = (err) => {
    return res.send({ status: false, message: 'Something went wrong' });
  }
  next();
});

const apiRouter = express.Router();

apiRouter.use('/city', cityRouter);
apiRouter.use('/country', countryRouter);

app.use(apiRouter);
```

Above example will create four endpoints for every mongoose schema.

### **/city**

* **get** => get one or more records, ```including search, filter, pagination, populate```
* **post** => add new record
* **put** => update existing record and send back the updated record, **```_id shall be passed in body```**
* **delete** => delete one record, **```_id shall be passed in body```**

## RoadMap

This is not the roboust library with lot's of functionalities. I just tried to do my best. I need your support to make it better. You can join me by forking the repo or sending your suggestions, comments etc.

- [x] Write documentation/how-to guide
- [x] Add an example app
- [x] Write test cases
- [x] Error handling
- [ ] Swtich to typescript

I really hope my these small efforts may bring some help in your project.

Thank you :pray:

### **Best Wishes**
