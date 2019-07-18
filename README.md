# Easy Express CRUD Generator

Simple express, mongoose based ```crud api generator```.

> Inspired by [GraphQL](https://graphql.org/) and [Strapi](https://strapi.io)

## Basic requirements

You should have [express](https://www.npmjs.com/package/express) app ready with [mongoose](https://www.npmjs.com/package/mongoose) and [body-parser](https://www.npmjs.com/package/body-parser) setup properly.

> Detailed Documentation and an example app will be added shortly!

## Minimal Setup Guide

Following example will create four endpoints for CRUD operations

* **/city**
  * **get** => get one or more records, ```including search, filter, pagination```
  * **post** => add new record
  * **put** => update existing record and send back the updated record, **```_id shall be passed in body```**
  * **delete** => delete one record, **```_id shall be passed in body```**

**The main thing is:** If you make get query to ```/city``` you will get complete records. But if you want to get only name of cities then you shall query like ```/city/name``` and you will get only the names of the cities along with their _ids.

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
const citySchema = new mongoose.Schema({
  name: String,
});
const CityModel = mongoose.model('City', citySchema);

// Creating crud operations
const cityRouter = new CRUD(CityModel).getRouter(express.Router());

// Basic express app setup
const app = express();
app.use(bodyParser.json());
app.listen(3000);

const apiRouter = express.Router();

apiRouter.use('/city', cityRouter);

app.use(apiRouter);
```

## RoadMap

- [ ] Write documentation/how-to guide
- [ ] Add an example app
- [ ] Write test cases
- [ ] Swtich to typescript
- [ ] Support for mongoose plugins
- [ ] Error handling
