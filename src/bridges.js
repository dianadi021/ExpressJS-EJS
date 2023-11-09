/** @format */

require('./apps/connect');
const RouterToken = require('./routes/token.router');
const RouterMain = require('./routes/main.router');
const RouterUsers = require('./routes/users.router');
const RouterArticles = require('./routes/articles.router');
const RouterRolesUsers = require('./routes/rolesusers.router');
const RouterCategoryArticles = require('./routes/categoryarticles.router');

module.exports = {
  RouterToken,
  RouterMain,
  RouterUsers,
  RouterArticles,
  RouterRolesUsers,
  RouterCategoryArticles,
};
