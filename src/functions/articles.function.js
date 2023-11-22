/** @format */

const { mongoose, ArticlesModel, FormatInputArticle } = require('../models/articles.model');
const { CheckingKeyReq, CheckingKeyReqSyntax, CheckingIsNilValue, CheckingObjectValue } = require('../utils/utils');

const CreateArticlesData = async (req, res) => {
  try {
    const { title, category, description, body, author, link } = req.body.data ? JSON.parse(req.body.data) : req.body;
    if (!title || !description || !body) {
      return res.status(404).json({ status: 'failed', message: `Format tidak sesuai!`, format: FormatInputArticle });
    }
    const isTitleEmptyValue = CheckingIsNilValue(title);
    const isDescriptionEmptyValue = CheckingIsNilValue(description);
    const isBodyEmptyValue = CheckingIsNilValue(body);
    if (isTitleEmptyValue || isDescriptionEmptyValue || isBodyEmptyValue) {
      return res
        .status(404)
        .json({ status: 'failed', message: `Format tidak sesuai atau input value kosong!`, format: FormatInputArticle });
    }
    const { path, filename } = req.file ? req.file : { path: null, filename: null };
    const newArticles = ArticlesModel({
      title,
      link: link ? link : null,
      category: CheckingIsNilValue(category) ? null : category.length == 1 ? category : new Set(category),
      description,
      body,
      thumbnailImage: filename ? filename : null,
      author: author ? author : null,
    });
    return await newArticles
      .save()
      .then((result) => res.status(201).json({ status: 'success', message: `Berhasil membuat artikel.` }))
      .catch((err) => res.status(500).json({ status: 'failed', message: `Gagal membuat artikel. Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal membuat artikel. Function Catch: ${err}` });
  }
};

const GetArticlesData = async (req, res) => {
  try {
    const syntaxExec = ['title', 'description', 'body', 'author', 'authorname', 'page', 'document'];
    const { title, description, body, author, authorname, page, document } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);
    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length >= 1) {
      return res.status(404).json({ status: 'failed', message: `Gagal mengambil data! Query tidak sesuai.` });
    }
    if (isHasSyntax && (title || body || authorname)) {
      let toFilter = title ? { title: title } : false;
      toFilter = body ? { body: body } : toFilter;
      toFilter = author ? { author: author } : toFilter;
      toFilter = authorname ? { authorname: authorname } : toFilter;
      const isDocumentHasInDatabase = await ArticlesModel.aggregate([
        { $project: { _id: 1, title: 1, description: 1, author: 1 } },
        { $match: toFilter },
      ]);
      if (isDocumentHasInDatabase.length < 1) {
        return res.status(404).json({ status: 'success', message: `Tidak ada data artikel tersebut.` });
      }
      return res.status(200).json({ status: 'success', message: `Berhasil mengambil data artikel.`, data: isDocumentHasInDatabase });
    }

    // START PAGINATION ($SKIP & $LIMIT)
    const isDocumentHasInDatabase =
      !page && !document
        ? await ArticlesModel.aggregate([{ $project: { _id: 1, title: 1, category: 1, description: 1, author: 1 } }])
        : await ArticlesModel.aggregate([
            { $project: { _id: 1, title: 1, category: 1, description: 1, author: 1 } },
            { $skip: (parseInt(page) - 1) * parseInt(document) },
            { $limit: parseInt(document) },
          ]);
    // END PAGINATION ($SKIP & $LIMIT)
    if (isDocumentHasInDatabase.length > 0) {
      return res.status(200).json({ status: 'success', message: `Berhasil mengambil data artikel.`, data: isDocumentHasInDatabase });
    }
    return res.status(404).json({ status: 'success', message: `Tidak ada data artikel.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal mengambil data artikel. Function Catch: ${err}` });
  }
};

const GetArticleDetails = async (req, res) => {
  try {
    let { id } = req.params;
    let isDocumentHasInDatabase = await ArticlesModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'categoryarticles',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
    ]);
    isDocumentHasInDatabase = !isDocumentHasInDatabase ? await ArticlesModel.findById(id) : isDocumentHasInDatabase;
    if (isDocumentHasInDatabase.length >= 1) {
      return res.status(200).json({ status: 'success', message: `Berhasil mengambil data artikel.`, data: isDocumentHasInDatabase });
    }
    return res.status(404).json({ status: 'success', message: `Tidak ada data artikel.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal mengambil data artikel. Function Catch: ${err}` });
  }
};

const UpdateArticleData = async (req, res) => {
  try {
    const { id } = req.params;
    const isDocumentHasInDatabase = await ArticlesModel.findById(id);
    if (!isDocumentHasInDatabase) {
      return res.status(404).json({ status: 'success', message: `Tidak ada data artikel.` });
    }
    const { title, category, description, body, thumbnailImage, author, link } = req.body.data ? JSON.parse(req.body.data) : req.body;
    let updateArticle = {};
    updateArticle = CheckingObjectValue(updateArticle, { title });
    updateArticle = CheckingObjectValue(updateArticle, { link });
    updateArticle = CheckingObjectValue(updateArticle, {
      category: CheckingIsNilValue(category) ? null : category ? Array.from(new Set(category)) : category,
    });
    updateArticle = CheckingObjectValue(updateArticle, { description });
    updateArticle = CheckingObjectValue(updateArticle, { body });
    updateArticle = CheckingObjectValue(updateArticle, { author });
    const { path, filename } = req.file ? req.file : { path: null, filename: null };
    updateArticle = CheckingObjectValue(updateArticle, { thumbnailImage: filename ? filename : null });
    return await ArticlesModel.findByIdAndUpdate(id, updateArticle)
      .then((result) => res.status(200).json({ status: 'success', message: `Berhasil memperbaharui data artikel.` }))
      .catch((err) => res.status(500).json({ status: 'failed', message: `Gagal memperbaharui data artikel. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal memperbaharui data artikel. Function Catch: ${err}` });
  }
};

const DeleteArticleData = async (req, res) => {
  try {
    const { id } = req.params;
    const isDocumentHasInDatabase = await ArticlesModel.findById(id);
    if (!isDocumentHasInDatabase) {
      return res.status(404).json({ status: 'success', message: `Tidak ada data artikel.` });
    }
    return await ArticlesModel.findByIdAndRemove(id)
      .then((result) => res.status(200).json({ status: 'success', message: `Berhasil menghapus data artikel.` }))
      .catch((err) => res.status(500).json({ status: 'failed', message: `Gagal menghapus data artikel. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal menghapus data artikel. Function Catch: ${err}` });
  }
};

module.exports = {
  CreateArticlesData,
  GetArticlesData,
  GetArticleDetails,
  UpdateArticleData,
  DeleteArticleData,
};
