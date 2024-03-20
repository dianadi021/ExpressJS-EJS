/** @format */

import { createRequire } from 'module';
import { ReturnEJSViews } from '../../utils/utils.js';

const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

router.get('*', async (req, res) => {
  try {
    return await ReturnEJSViews(req, res, '404', 404, false, `Router error Catch: Not Found!`);
  } catch (err) {
    return await ReturnEJSViews(req, res, '404', 404, false, `Router error Catch: ${err}`);
  }
});

export default router;
