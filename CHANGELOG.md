
# 1.4.8

* Dependency update: eslint-airbnb-base & husky
* Fix eslint errors due to udpate
* Write test cases for helper functions

# 1.4.6

* Fix query issue
* Default query will send all data, use limit and skip if you want to get limited data
* Update eslint & husky dev deps
* Add new limit var in get api response

# 1.4.4

* Fix ```in``` and ```nin``` queries

# 1.4.3

* All queries shall be case sensitive

# 1.4.2

* Fix the issue where reference ids are not working with filters
* Update dev dependencies

## 1.4.0

* As we are not handling error in this module. But now you can use your custom error handling function. Just plug it into your request object with the key name ```errorHandler```. If we don't find that error handler in request object you will be sent response object with default error message.

Code example, you can view full example in README.md.

```Javascript
app.use((req, res, next) => {
  req.errorHandler = (err) => {
    return res.send({ status: false, message: 'Something went wrong' });
  }
  next();
});
```
