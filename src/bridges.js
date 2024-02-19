/** @format */

import { mongoConnect } from './apps/connect.js';
import rBrands from './routes/api/brands.js';
import rCategories from './routes/api/categories.js';
import rMain from './routes/api/main.js';
import rRestockItems from './routes/api/restockItems.js';
import rSellingItems from './routes/api/sellingItems.js';
import rTotalStockItems from './routes/api/totalStockItems.js';
import ejsRIndex from './routes/ejs/index.js';

mongoConnect();

// API
export const main = rMain;
export const restockItems = rRestockItems;
export const categories = rCategories;
export const brands = rBrands;
export const totalStockItem = rTotalStockItems;
export const sellingItems = rSellingItems;

// EJS
export const ejsIndex = ejsRIndex;
