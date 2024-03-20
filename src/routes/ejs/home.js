/** @format */

import { createRequire } from 'module';
import { GetHOME } from '../../functions/ejs/home.js';
import { ReturnEJSViews } from '../../utils/utils.js';

const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    return await GetHOME(req, res);
  } catch (err) {
    return await ReturnEJSViews(req, res, '404', 500, false, `Router error Catch: ${err}`);
  }
});

export default router;
