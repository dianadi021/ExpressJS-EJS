/** @format */

const { CreateRolesUsersData, GetRoleData, GetRoleDetails, UpdateRoleData, DeleteRoleData } = require('../functions/rolesusers.function');
const { CheckingTokenAuthorization } = require('../middleware/auth');

const express = require('express');
const router = express.Router();

router.use(express.json());

router.post('/roles/users', async (req, res) => {
  try {
    await CreateRolesUsersData(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/roles/users', async (req, res) => {
  try {
    await GetRoleData(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/roles/users/:id', async (req, res) => {
  try {
    await GetRoleDetails(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.put('/roles/users/:id', async (req, res) => {
  try {
    await UpdateRoleData(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.delete('/roles/users/:id', async (req, res) => {
  try {
    await DeleteRoleData(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

module.exports = router;
