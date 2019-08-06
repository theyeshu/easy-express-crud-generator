const EQ = 'eq';
const NE = 'ne';
const LT = 'lt';
const GT = 'gt';
const LTE = 'lte';
const GTE = 'gte';
const IN = 'in';
const NIN = 'nin';
const CONTAINS = '_contains';
const NCONTAINS = '_ncontains';
const CONTAINSS = '_containss';
const NCONTAINSS = '_ncontainss';
const SKIP = '_skip';
const LIMIT = '_limit';
const SORT = '_sort';
const ASC = 'asc';
const DESC = 'desc';

module.exports.CONTAINS = CONTAINS;
module.exports.NCONTAINS = NCONTAINS;
module.exports.CONTAINSS = CONTAINSS;
module.exports.NCONTAINSS = NCONTAINSS;
module.exports.IN = IN;
module.exports.NIN = NIN;
module.exports.SKIP = SKIP;
module.exports.LIMIT = LIMIT;
module.exports.SORT = SORT;
module.exports.ASC = ASC;
module.exports.DESC = DESC;
module.exports.sortSuffix = [SKIP, LIMIT, SORT];
module.exports.allFilterSuffix = [
  EQ, NE, LT, GT, LTE, GTE, IN, NIN, CONTAINS, NCONTAINS, CONTAINSS, NCONTAINSS,
];
