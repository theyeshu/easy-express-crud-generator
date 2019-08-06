/* global describe test expect */

const { getPopulateAndSelect, getQueryObj } = require('.');

describe('Test getPopulateAndSelect', () => {
  test('Sending no value should not throw error!', () => {
    const result = getPopulateAndSelect();
    const output = { populate: [], select: {} };

    expect(result).toEqual(output);
  });

  test('Should handle the required result!', () => {
    const result = getPopulateAndSelect('_id/_city/_state/name/age');

    const output = {
      populate: [],
      select: {
        _id: true, _city: true, _state: true, name: true, age: true,
      },
    };

    expect(result).toEqual(output);
  });

  test('Populating ref ids, starting with "_"!', () => {
    const result = getPopulateAndSelect('/_id/_city.name/_state.name/name');

    const output = {
      populate: [
        { path: '_city', select: { name: true } },
        { path: '_state', select: { name: true } },
      ],
      select: {
        _id: true, _city: true, _state: true, name: true,
      },
    };

    expect(result).toEqual(output);
  });

  test('Populating shall not support non "_" ref ids', () => {
    const result = getPopulateAndSelect('/_city.name/org.name');

    const output = {
      populate: [{ path: '_city', select: { name: true } }],
      select: { _city: true, org: true },
    };

    expect(result).toEqual(output);
  });

  test('Populating shall ignore grand child requirement', () => {
    const result = getPopulateAndSelect('/_city._area.name/_city.area.name');

    const output = {
      populate: [{ path: '_city', select: { area: true, _area: true } }],
      select: { _city: true },
    };

    expect(result).toEqual(output);
  });

  test('Populating shall support multiple children', () => {
    const result = getPopulateAndSelect('/_city.name/_city.url');

    const output = {
      populate: [{ path: '_city', select: { url: true, name: true } }],
      select: { _city: true },
    };

    expect(result).toEqual(output);
  });

  test('It should remove all unnecessary characters from query!', () => {
    const result = getPopulateAndSelect('///_?city.&&?<>name');

    const output = {
      populate: [{ path: '_city', select: { name: true } }],
      select: { _city: true },
    };

    expect(result).toEqual(output);
  });
});

describe('Test getQueryObj', () => {
  test('Sending no value should not throw error!', () => {
    const result = getQueryObj();
    const output = {
      query: {}, sort: {}, limit: 0, skip: 0,
    };

    expect(result).toEqual(output);
  });

  test('Should handle "_id" as findById!', () => {
    const result = getQueryObj({ _id: 1 });

    const output = {
      query: { _id: 1 }, sort: {}, limit: 0, skip: 0,
    };

    expect(result).toEqual(output);
  });

  test('Should limit the no of documents required!', () => {
    const result = getQueryObj({ _limit: 100 });

    const output = {
      query: {}, sort: {}, limit: 100, skip: 0,
    };

    expect(result).toEqual(output);
  });

  test('Should skip the no of documents!', () => {
    const result = getQueryObj({ _skip: 100 });

    const output = {
      query: {}, sort: {}, limit: 0, skip: 100,
    };

    expect(result).toEqual(output);
  });

  test('Should add multiple sorts in query!', () => {
    const result = getQueryObj({ _sort: 'name:asc,age:desc' });

    const output = {
      query: {}, limit: 0, skip: 0, sort: { name: 'asc', age: 'desc' },
    };

    expect(result).toEqual(output);
  });

  test('Should ignore sorting in query if ASC || DESC not found!', () => {
    const result = getQueryObj({ _sort: 'name:aesc,age:dsc' });

    const output = {
      query: {}, limit: 0, skip: 0, sort: {},
    };

    expect(result).toEqual(output);
  });

  test('Should case sensitive support for ASC && DESC', () => {
    const result = getQueryObj({ _sort: 'name:AsC,age:DesC' });

    const output = {
      query: {}, limit: 0, skip: 0, sort: { name: 'asc', age: 'desc' },
    };

    expect(result).toEqual(output);
  });

  test('Should supports "_contains"!', () => {
    const result = getQueryObj({ name_contains: 'foo' });

    const name = { $regex: new RegExp('foo', 'i') };
    const output = {
      sort: {}, limit: 0, skip: 0, query: { name },
    };

    expect(result).toEqual(output);
  });

  test('Should supports "_containss"!', () => {
    const result = getQueryObj({ name_containss: 'foo' });

    const name = { $regex: new RegExp('foo') };
    const output = {
      sort: {}, limit: 0, skip: 0, query: { name },
    };

    expect(result).toEqual(output);
  });

  test('Should supports "_ncontains"!', () => {
    const result = getQueryObj({ name_ncontains: 'foo' });

    const name = { $not: { $regex: new RegExp('foo', 'i') } };
    const output = {
      sort: {}, limit: 0, skip: 0, query: { name },
    };

    expect(result).toEqual(output);
  });

  test('Should supports "_ncontainss"!', () => {
    const result = getQueryObj({ name_ncontainss: 'foo' });

    const name = { $not: { $regex: new RegExp('foo') } };
    const output = {
      sort: {}, limit: 0, skip: 0, query: { name },
    };

    expect(result).toEqual(output);
  });

  test('Should supports "in" with string element', () => {
    const result = getQueryObj({ name_in: 'foo' });

    const name = { $in: ['foo'] };
    const output = {
      sort: {}, limit: 0, skip: 0, query: { name },
    };

    expect(result).toEqual(output);
  });

  test('Should supports "in" with array element', () => {
    const result = getQueryObj({ name_in: ['foo', 'bar'] });

    const name = { $in: ['foo', 'bar'] };
    const output = {
      sort: {}, limit: 0, skip: 0, query: { name },
    };

    expect(result).toEqual(output);
  });

  test('Should supports "nin" with string element', () => {
    const result = getQueryObj({ name_nin: 'foo' });

    const name = { $nin: ['foo'] };
    const output = {
      sort: {}, limit: 0, skip: 0, query: { name },
    };

    expect(result).toEqual(output);
  });

  test('Should supports "nin" with array element', () => {
    const result = getQueryObj({ name_nin: ['foo', 'bar'] });

    const name = { $nin: ['foo', 'bar'] };
    const output = {
      sort: {}, limit: 0, skip: 0, query: { name },
    };

    expect(result).toEqual(output);
  });

  test('Should support "eq"', () => {
    const result = getQueryObj({ name_eq: 'foo' });

    const name = { $eq: 'foo' };
    const output = {
      sort: {}, limit: 0, skip: 0, query: { name },
    };

    expect(result).toEqual(output);
  });

  test('Should support "ne"', () => {
    const result = getQueryObj({ name_ne: 'foo' });

    const name = { $ne: 'foo' };
    const output = {
      sort: {}, limit: 0, skip: 0, query: { name },
    };

    expect(result).toEqual(output);
  });

  test('Should support "lt"', () => {
    const result = getQueryObj({ name_lt: 'foo' });

    const name = { $lt: 'foo' };
    const output = {
      sort: {}, limit: 0, skip: 0, query: { name },
    };

    expect(result).toEqual(output);
  });

  test('Should support "gt"', () => {
    const result = getQueryObj({ name_gt: 'foo' });

    const name = { $gt: 'foo' };
    const output = {
      sort: {}, limit: 0, skip: 0, query: { name },
    };

    expect(result).toEqual(output);
  });

  test('Should support "lte"', () => {
    const result = getQueryObj({ name_lte: 'foo' });

    const name = { $lte: 'foo' };
    const output = {
      sort: {}, limit: 0, skip: 0, query: { name },
    };

    expect(result).toEqual(output);
  });

  test('Should support "gte"', () => {
    const result = getQueryObj({ name_gte: 'foo' });

    const name = { $gte: 'foo' };
    const output = {
      sort: {}, limit: 0, skip: 0, query: { name },
    };

    expect(result).toEqual(output);
  });

  test('Should not support any other element!', () => {
    const result = getQueryObj({ name_yk: 'foo' });

    const output = {
      sort: {}, limit: 0, skip: 0, query: {},
    };

    expect(result).toEqual(output);
  });
});
