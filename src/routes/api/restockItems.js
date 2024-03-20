/** @format */

import { Router } from 'express';
import { CreateItem, DeleteItemByID, GetItemByID, GetItems, UpdateItemByID } from '../../functions/api/restockItems.js';

const router = new Router();

router.post('/', async (req, res) => {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        return await CreateItem(req, res);
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
        return await GetItems(req, res);
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
        return await GetItemByID(req, res);
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
        return await UpdateItemByID(req, res);
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
        return await UpdateItemByID(req, res);
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
        return await DeleteItemByID(req, res);
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
        return await DeleteItemByID(req, res);
      }, 7500);
    });
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

export default router;
