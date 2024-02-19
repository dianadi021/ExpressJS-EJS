/** @format */

import { createRequire } from 'module';
import { GetIndex } from '../../functions/ejs/index.js';
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    return await GetIndex(req, res);
  } catch (err) {
    res.render('index', {
      head_title: 'CV. Satya Utama Mandiri',
      head_description: 'Merupakan perusahaan yang bekerja dibidang kesehatan keluarga dan pariwisata.',
      head_author: 'Dian Adi Nugroho',
      head_keywords: 'satya utama mandiri',
      errMsg: `Router error Catch: ${err}`,
    });
  }
});

export default router;
