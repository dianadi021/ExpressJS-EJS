/** @format */

require('./apps/connect');
const RouterMain = require('./routes/main');
const RouterToken = require('./routes/token');
const RouterUsers = require('./routes/users');

module.exports = {
  RouterMain,
  RouterToken,
  RouterUsers,
};
