/** @format */

const { CategoryArticlesModel, FormatInputCategoryArticles } = require('../models/categoryarticles.model');
const { CheckingKeyReq, CheckingKeyReqSyntax, CheckingIsNilValue } = require('../utils/utils');

const CreateCategoryArticleData = async (req, res) => {
  try {
    const { categoryname, description } = req.body.data ? JSON.parse(req.body.data) : req.body;
    if (!categoryname) {
      return res.status(404).json({ status: 'failed', message: `Format tidak sesuai!`, format: FormatInputCategoryArticles });
    }
    const isCategoryNameEmptyValue = CheckingIsNilValue(categoryname);
    if (isCategoryNameEmptyValue) {
      return res
        .status(404)
        .json({ status: 'failed', message: `Format tidak sesuai atau input value kosong!`, format: FormatInputCategoryArticles });
    }
    const isCategoryNameWasUsed = await CategoryArticlesModel.find({ categoryname: categoryname.toLowerCase() });
    if (isCategoryNameWasUsed.length >= 1) {
      return res.status(403).json({ status: 'failed', message: `Nama Kategori sudah tersedia! harap untuk menggunakan yang lain.` });
    }
    const newCategory = CategoryArticlesModel({ categoryname: categoryname.toLowerCase(), description });
    return await newCategory
      .save()
      .then((result) => res.status(201).json({ status: 'success', message: `Berhasil membuat kategori.` }))
      .catch((err) => res.status(500).json({ status: 'failed', message: `Gagal membuat kategori. Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal membuat kategori. Function Catch: ${err}` });
  }
};

const GetCategoryArticlesData = async (req, res) => {
  try {
    const syntaxExec = ['categoryname', 'document', 'page'];
    const { categoryname, page, document } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);
    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length >= 1) {
      return res.status(404).json({ status: 'failed', message: `Gagal mengambil data! Query tidak sesuai.` });
    }
    if (isHasSyntax && categoryname) {
      let toFilter = categoryname ? { categoryname: categoryname.toLowerCase() } : false;
      const isDocumentHasInDatabase = await CategoryArticlesModel.aggregate([
        { $project: { _id: 1, categoryname: 1 } },
        { $match: toFilter },
      ]);
      if (isDocumentHasInDatabase.length < 1) {
        return res.status(404).json({ status: 'success', message: `Tidak ada data kategori tersebut.` });
      }
      return res.status(200).json({ status: 'success', message: `Berhasil mengambil data kategori.`, data: isDocumentHasInDatabase });
    }

    // START PAGINATION ($SKIP & $LIMIT)
    const isDocumentHasInDatabase =
      !page && !document
        ? await CategoryArticlesModel.aggregate([{ $project: { _id: 1, categoryname: 1 } }])
        : await CategoryArticlesModel.aggregate([
            { $project: { _id: 1, categoryname: 1 } },
            { $skip: (parseInt(page) - 1) * parseInt(document) },
            { $limit: parseInt(document) },
          ]);
    // END PAGINATION ($SKIP & $LIMIT)
    if (isDocumentHasInDatabase.length > 0) {
      return res.status(200).json({ status: 'success', message: `Berhasil mengambil data kategori.`, data: isDocumentHasInDatabase });
    }
    return res.status(404).json({ status: 'success', message: `Tidak ada data kategori.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal mengambil data kategori. Function Catch: ${err}` });
  }
};

const GetCategoryArticleDetails = async (req, res) => {
  try {
    let { id } = req.params;
    const isDocumentHasInDatabase = await CategoryArticlesModel.findById(id);
    if (isDocumentHasInDatabase) {
      return res.status(200).json({ status: 'success', message: `Berhasil mengambil data kategori.`, data: isDocumentHasInDatabase });
    }
    return res.status(404).json({ status: 'success', message: `Tidak ada data kategori.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal mengambil data kategori. Function Catch: ${err}` });
  }
};

const UpdateCategoryArticleData = async (req, res) => {
  try {
    const { id } = req.params;
    const isDocumentHasInDatabase = await CategoryArticlesModel.findById(id);
    if (!isDocumentHasInDatabase) {
      return res.status(404).json({ status: 'success', message: `Tidak ada data kategori.` });
    }
    const { categoryname, description } = req.body.data ? JSON.parse(req.body.data) : req.body;
    if (!categoryname) {
      return res.status(404).json({ status: 'failed', message: `Format tidak sesuai!`, format: FormatInputCategoryArticles });
    }
    const isCategoryNameWasUsed = await CategoryArticlesModel.find({ categoryname: categoryname.toLowerCase() });
    const isCategoryNameIDReady = isCategoryNameWasUsed.length >= 1 ? isCategoryNameWasUsed[0]._id : id;
    if (isCategoryNameIDReady != id) {
      return res.status(403).json({ status: 'failed', message: `Nama Kategori sudah tersedia! harap untuk menggunakan yang lain.` });
    }
    const isCategoryNameEmptyValue = CheckingIsNilValue(categoryname);
    if (isCategoryNameEmptyValue) {
      return res
        .status(404)
        .json({ status: 'failed', message: `Format tidak sesuai atau input value kosong!`, format: FormatInputCategoryArticles });
    }
    const updateCategory = { categoryname: categoryname.toLowerCase() };
    return await CategoryArticlesModel.findByIdAndUpdate(id, updateCategory)
      .then((result) => res.status(200).json({ status: 'success', message: `Berhasil memperbaharui data kategori.` }))
      .catch((err) => res.status(500).json({ status: 'failed', message: `Gagal memperbaharui data kategori. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal memperbaharui data kategori. Function Catch: ${err}` });
  }
};

const DeleteCategoryArticleData = async (req, res) => {
  try {
    const { id } = req.params;
    const isDocumentHasInDatabase = await CategoryArticlesModel.findById(id);
    if (!isDocumentHasInDatabase) {
      return res.status(404).json({ status: 'success', message: `Tidak ada data kategori.` });
    }
    return await CategoryArticlesModel.findByIdAndRemove(id)
      .then((result) => res.status(200).json({ status: 'success', message: `Berhasil menghapus data kategori.` }))
      .catch((err) => res.status(500).json({ status: 'failed', message: `Gagal menghapus data kategori. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal menghapus data kategori. Function Catch: ${err}` });
  }
};

module.exports = {
  CreateCategoryArticleData,
  GetCategoryArticlesData,
  GetCategoryArticleDetails,
  UpdateCategoryArticleData,
  DeleteCategoryArticleData,
};
