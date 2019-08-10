const {
  CONTAINS, CONTAINSS, NCONTAINS, NCONTAINSS, IN, NIN,
  LIMIT, SKIP, SORT, ASC, DESC, allFilterSuffix, sortSuffix,
} = require('../constants');

module.exports.getPopulateAndSelect = (param) => {
  const obj = { populate: [], select: {} };
  const rawArr = param ? param.split('/') : '';

  if (!rawArr || !Array.isArray(rawArr) || rawArr.length === 0) return obj;

  const arr = rawArr.map((x) => x.replace(/[^a-zA-Z1-9_.]/g, ''));

  arr.filter((x) => !!x).forEach((x) => {
    const fields = x.split('.');

    if (fields[0][0] === '_' && fields.length > 1) {
      const fieldExist = obj.populate.find((i) => i.path === fields[0]);
      if (!fieldExist) {
        obj.populate.push({ path: fields[0], select: { [fields[1]]: true } });
      } else if (!fieldExist.select[fields[1]]) {
        fieldExist.select[fields[1]] = true;
      }
    }

    obj.select[fields[0]] = true;
  });

  return obj;
};

module.exports.getQueryObj = (queryObj = {}) => {
  const obj = {
    query: {}, sort: {}, limit: 0, skip: 0,
  };
  const keys = Object.keys(queryObj);
  if (keys.length === 0) return obj;

  keys.filter((x) => !!x).forEach((x) => {
    // mongo id filter
    if (x === '_id') {
      obj.query._id = queryObj[x];
      return;
    }

    // sorting and pagination
    if (x.includes('_') && sortSuffix.includes(x)) {
      if (x === LIMIT) {
        obj.limit = Math.round(parseInt(queryObj[x], 10)) || 0;
        return;
      }

      if (x === SKIP) {
        obj.skip = Math.round(parseInt(queryObj[x], 10)) || 0;
        return;
      }

      if (x === SORT) {
        queryObj[x].split(',').forEach((z) => {
          const [field, order] = z.split(':');
          if (order && (order.toLowerCase() === ASC || order.toLowerCase() === DESC)) {
            obj.sort[field] = order.toLowerCase();
          }
        });
        return;
      }
    }

    // filters
    allFilterSuffix.forEach((y) => {
      if (x.includes(y)) {
        const index = x.lastIndexOf('_');
        const queryEle = x.slice(index).toLowerCase().substr(1);
        const field = x.substr(0, index);

        switch (queryEle) {
          case (CONTAINS):
            obj.query[field] = { $regex: new RegExp(queryObj[x], 'i') };
            break;
          case (CONTAINSS):
            obj.query[field] = { $regex: new RegExp(queryObj[x]) };
            break;
          case (NCONTAINS):
            obj.query[field] = { $not: { $regex: new RegExp(queryObj[x], 'i') } };
            break;
          case (NCONTAINSS):
            obj.query[field] = { $not: { $regex: new RegExp(queryObj[x]) } };
            break;
          case (IN):
          case (NIN):
            // eslint-disable-next-line no-case-declarations
            const ele = typeof queryObj[x] === 'string' ? [queryObj[x]] : queryObj[x];
            obj.query[field] = { [`$${queryEle}`]: ele };
            break;
          default:
            obj.query[field] = { [`$${queryEle}`]: queryObj[x] };
            break;
        }
      }
    });
  });

  return obj;
};
