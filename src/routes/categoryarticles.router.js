/** @format */

const {
  CreateCategoryArticleData,
  GetCategoryArticlesData,
  GetCategoryArticleDetails,
  UpdateCategoryArticleData,
  DeleteCategoryArticleData,
} = require('../functions/categoryarticles.function');
const { CheckingTokenAuthorization } = require('../middleware/auth');

const express = require('express');
const router = express.Router();

router.use(express.json());

router.post('/category/articles', async (req, res) => {
  // router.post('/category/articles', async (req, res) => {
  try {
    await CreateCategoryArticleData(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/category/articles', async (req, res) => {
  try {
    await GetCategoryArticlesData(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.get('/category/articles/:id', async (req, res) => {
  try {
    await GetCategoryArticleDetails(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.put('/category/articles/:id', async (req, res) => {
  try {
    await UpdateCategoryArticleData(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

router.delete('/category/articles/:id', async (req, res) => {
  try {
    await DeleteCategoryArticleData(req, res);
  } catch (err) {
    res.status(500).json({ status: 'failed', message: `Endpoint error: ${err}` });
  }
});

module.exports = router;
