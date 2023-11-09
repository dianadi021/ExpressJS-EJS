/** @format */

const { CreateUsersData, GetUsersData, GetUserDetails, UpdateUserData, DeleteUserData } = require('../functions/users.function');
const { CheckingTokenAuthorization } = require('../middleware/auth');

const express = require('express');
const router = express.Router();

router.use(express.json());

router.post('/users', async (req, res) => {
  try {
    await CreateUsersData(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/users', async (req, res) => {
  try {
    await GetUsersData(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    await GetUserDetails(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    await UpdateUserData(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await DeleteUserData(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

module.exports = router;
