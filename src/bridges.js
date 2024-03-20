/** @format */

import brands from './routes/api/brands.js';
import categories from './routes/api/categories.js';
import restockItems from './routes/api/restockItems.js';
import sellingItems from './routes/api/sellingItems.js';
import totalStockItem from './routes/api/totalStockItems.js';
import users from './routes/api/users.js';
import ejsHOME from './routes/ejs/home.js';
import ejsnotfound from './routes/ejs/notfound.js';

export const API_ENDPOINT_URL = (app) => {
  // API ENDPOINT
  app.use('/api/users', users);
  app.use('/api/brands', brands);
  app.use('/api/categories', categories);
  app.use('/api/items/total/stock', totalStockItem);
  app.use('/api/items/restock', restockItems);
  app.use('/api/items/selling', sellingItems);

  // EJS ENDPOINT
  app.use('/', ejsHOME);
  app.use(ejsnotfound);
};
