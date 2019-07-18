class CRUD {
  constructor(model) {
    this.model = model;
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

  async addController(req, res) {
    try {
      const data = await this.addDataToDb(req.body);
      if (!data) throw new Error('Unable to add data!');

      res.send({ status: true, data });
    } catch (err) {
      res.send({ status: false, message: err.message || 'Something went wrong!' });
    }
  }

  async getController(req, res) {
    try {
      const options = req.getPopulateAndSelect(req.params[0], req.query);
      const query = req.getQueryObj(req.query);

      const data = await this.getDataFromDb({ ...options, ...query });
      if (!data) throw new Error('Unable to get data!');

      res.send({ status: true, data });
    } catch (err) {
      res.send({ status: false, message: err.message || 'Something went wrong!' });
    }
  }

  async updateController(req, res) {
    try {
      const { _id } = req.body;
      const options = {
        ...req.getPopulateAndSelect(req.params[0]),
        query: { _id },
        update: req.body,
      };

      const data = await this.updateDataToDb(options);
      if (!data) throw new Error('Unable to update data!');

      res.send({ status: true, data });
    } catch (err) {
      res.send({ status: false, message: err.message || 'Something went wrong!' });
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

      res.send({ status: true, data });
    } catch (err) {
      res.send({ status: false, message: err.message || 'Something went wrong!' });
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
