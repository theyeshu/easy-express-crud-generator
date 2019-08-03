const { getPopulateAndSelect, getQueryObj } = require('./src/helper');

class CRUD {
  constructor(model) {
    this.model = model;
    this.addDataToDb = this.addDataToDb.bind(this);
    this.getDataFromDb = this.getDataFromDb.bind(this);
    this.updateDataToDb = this.updateDataToDb.bind(this);
    this.deleteDataToDb = this.deleteDataToDb.bind(this);
    this.addController = this.addController.bind(this);
    this.getController = this.getController.bind(this);
    this.updateController = this.updateController.bind(this);
    this.deleteController = this.deleteController.bind(this);
    this.getRouter = this.getRouter.bind(this);
  }

  addDataToDb(obj) {
    return this.model.create(obj);
  }

  getDataFromDb({
    populate, query, select, sort, limit, skip,
  }) {
    return this.model.find(query)
      .lean()
      .populate(populate)
      .select(select)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  updateDataToDb({
    populate, query, select, update,
  }) {
    return this.model.findOneAndUpdate(query, update, { new: true })
      .lean()
      .populate(populate)
      .select(select);
  }

  deleteDataToDb({ query }) {
    return this.model.findOneAndDelete(query);
  }

  getCountFromDb({ query }) {
    return this.model.countDocuments(query);
  }

  async addController(req, res) {
    try {
      const data = await this.addDataToDb(req.body);
      if (!data) throw new Error('Unable to add data!');

      return res.send({ status: true, data });
    } catch (err) {
      if (req.errorHandler && typeof req.errorHandler === 'function') {
        return req.errorHandler(err);
      }
      return res.send({ status: false, message: err.message || 'Something went wrong!' });
    }
  }

  async getController(req, res) {
    try {
      const options = getPopulateAndSelect(req.params[0]);
      const query = getQueryObj(req.query);

      const data = await this.getDataFromDb({ ...options, ...query });
      if (!data) throw new Error('Unable to get data!');

      const count = await this.getCountFromDb(query);
      const skipped = query.skip || 0;
      const { limit } = query;

      return res.send({
        status: true, data, count, skipped, limit,
      });
    } catch (err) {
      if (req.errorHandler && typeof req.errorHandler === 'function') {
        return req.errorHandler(err);
      }
      return res.send({ status: false, message: err.message || 'Something went wrong!' });
    }
  }

  async updateController(req, res) {
    try {
      const { _id } = req.body;
      const options = {
        ...getPopulateAndSelect(req.params[0]),
        query: { _id },
        update: req.body,
      };

      const data = await this.updateDataToDb(options);
      if (!data) throw new Error('Unable to update data!');

      return res.send({ status: true, data });
    } catch (err) {
      if (req.errorHandler && typeof req.errorHandler === 'function') {
        return req.errorHandler(err);
      }
      return res.send({ status: false, message: err.message || 'Something went wrong!' });
    }
  }

  async deleteController(req, res) {
    try {
      const { _id } = req.body;
      const options = {
        query: { _id },
      };

      const data = await this.deleteDataToDb(options);
      if (!data) throw new Error('Unable to delete data!');

      return res.send({ status: true, data });
    } catch (err) {
      if (req.errorHandler && typeof req.errorHandler === 'function') {
        return req.errorHandler(err);
      }
      return res.send({ status: false, message: err.message || 'Something went wrong!' });
    }
  }

  getRouter(Router) {
    Router.route('/?*')
      .get(this.getController)
      .post(this.addController)
      .put(this.updateController)
      .delete(this.deleteController);

    return Router;
  }
}

module.exports = CRUD;
