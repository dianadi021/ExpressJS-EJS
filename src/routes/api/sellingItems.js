/** @format */

import { createRequire } from 'module';
import {
  CreateSellingItem,
  DeleteSellingItemByID,
  GetSellingItemByID,
  GetSellingItems,
  UpdateSellingItemByID,
} from '../../functions/api/sellingItems.js';
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        return await CreateSellingItem(req, res);
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
        return await GetSellingItems(req, res);
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
        return await GetSellingItemByID(req, res);
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
        return await UpdateSellingItemByID(req, res);
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
        return await UpdateSellingItemByID(req, res);
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
        return await DeleteSellingItemByID(req, res);
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
        return await DeleteSellingItemByID(req, res);
      }, 7500);
    });
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

export default router;
