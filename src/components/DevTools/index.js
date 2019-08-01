/* eslint-disable no-undef */
const { DEVTOOLS_ENABLED_IN_DEV } = require('../../constants');

if (process.env.NODE_ENV === 'production' || !DEVTOOLS_ENABLED_IN_DEV) {
  // eslint-disable-next-line global-require
  module.exports = require('./index.prod.js');
} else {
  // eslint-disable-next-line global-require
  module.exports = require('./index.dev');
}
