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
