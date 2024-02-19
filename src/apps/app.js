/** @format */

import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const express = require('express');
const app = express();
const port = 9000;

import { brands, categories, ejsIndex, main, restockItems, sellingItems, totalStockItem } from '../bridges.js';

try {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Display EJS
  app.set('views', path.join(__dirname, '../../public/views/'));
  app.set('view engine', 'ejs');
  app.use('/public/', express.static(path.join(__dirname, '../../public/')));

  app.use('/', ejsIndex);

  // API ENDPOINT
  app.use('/api/main/', main);
  app.use('/api/brands', brands);
  app.use('/api/categories', categories);
  app.use('/api/items/total/stock', totalStockItem);
  app.use('/api/items/restock', restockItems);
  app.use('/api/items/selling', sellingItems);

  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
  });
} catch (error) {
  console.log(`App listening on port Error: ${error}`);
}
