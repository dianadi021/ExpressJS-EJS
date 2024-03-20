/** @format */

import { createRequire } from 'module';
import { CreateMain, DeleteMainByID, GetMain, GetMainByID, UpdateMainByID } from '../../functions/api/main.js';
const require = createRequire(import.meta.url);

import { Router } from 'express';
const router = new Router();

router.post('/', async (req, res) => {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        return await CreateMain(req, res);
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
        return await GetMain(req, res);
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
        return await GetMainByID(req, res);
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
        return await UpdateMainByID(req, res);
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
        return await UpdateMainByID(req, res);
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
        return await DeleteMainByID(req, res);
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
        return await DeleteMainByID(req, res);
      }, 7500);
    });
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

export default router;
