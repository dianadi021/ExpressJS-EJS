/** @format */

import { createRequire } from 'module';
import { CreateItemBrand, DeleteBrandByID, GetBrandByID, GetBrands, UpdateBrandByID } from '../../functions/api/brands.js';
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        return await CreateItemBrand(req, res);
      }, 7500);
    });
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/', async (req, res) => {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        return await GetBrands(req, res);
      }, 7500);
    });
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/:id', async (req, res) => {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        return await GetBrandByID(req, res);
      }, 7500);
    });
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.post('/update/:id', async (req, res) => {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        return await UpdateBrandByID(req, res);
      }, 7500);
    });
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.put('/:id', async (req, res) => {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        return await UpdateBrandByID(req, res);
      }, 7500);
    });
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        return await DeleteBrandByID(req, res);
      }, 7500);
    });
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        return await DeleteBrandByID(req, res);
      }, 7500);
    });
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

export default router;
