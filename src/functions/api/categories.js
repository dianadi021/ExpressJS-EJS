/** @format */

import { CategoriesModel, FormatCategory } from '../../models/categories.js';
import { CheckingIsNilValue, CheckingKeyReq, CheckingKeyReqSyntax, CheckingObjectValue } from '../../utils/utils.js';

export const CreateCategory = async (req, res) => {
  try {
    const { categoryName, description } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyCategoryName = CheckingIsNilValue(categoryName);

    if (!categoryName || isEmptyCategoryName) {
      res.status(404).json({ status: 'failed', messages: `Format tidak sesuai atau input value kosong!`, format: FormatCategory });
      return;
    }

    const isCategoryNameUsed = await CategoriesModel.aggregate([{ $match: { categoryName: categoryName.toLowerCase() } }]);

    if (isCategoryNameUsed.length) {
      return res
        .status(403)
        .json({ status: 'failed', messages: `Nama kategori sudah terdaftar! Silahkan untuk mengganti nama data Kategori.` });
    }

    const newCategory = CategoriesModel({ categoryName: categoryName.toLowerCase(), description });

    return await newCategory
      .save()
      .then((result) => res.status(201).json({ status: 'success', messages: `Berhasil menyimpan data Kategori.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal menyimpan data Kategori. Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal menyimpan data Kategori. Function Catch: ${err}` });
  }
};

export const GetCategories = async (req, res) => {
  try {
    const syntaxExec = ['categoryName', 'page', 'document'];
    const { categoryName, page, document } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);

    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length) {
      return res.status(404).json({ status: 'failed', messages: `Gagal mengambil data! Query tidak sesuai.` });
    }

    const toFilter = categoryName ? { categoryName: categoryName.toLowerCase() } : false;

    let documentsInDB = await CategoriesModel.aggregate([{ $project: { _id: 1, categoryName: 1 } }]);
    documentsInDB =
      isHasSyntax && categoryName
        ? await CategoriesModel.aggregate([{ $project: { _id: 1, categoryName: 1 } }, { $match: toFilter }])
        : documentsInDB;
    documentsInDB =
      page && document
        ? await CategoriesModel.aggregate([
            { $project: { _id: 1, categoryName: 1 } },
            { $skip: (parseInt(page) - 1) * parseInt(document) },
            { $limit: parseInt(document) },
          ])
        : documentsInDB;

    if (documentsInDB.length) {
      return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data Kategori.`, data: documentsInDB });
    }

    return res.status(404).json({ status: 'success', messages: `Tidak ada data Kategori.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil data Kategori. Function Catch: ${err}` });
  }
};

export const GetCategoryByID = async (req, res) => {
  try {
    const { id } = req.params;

    const documentsInDB = await CategoriesModel.findById(id);

    if (documentsInDB.length) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data Kategori.` });
    }

    return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data Kategori.`, data: documentsInDB });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil data Kategori. Function Catch: ${err}` });
  }
};

export const UpdateCategoryByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await CategoriesModel.findById(id);

    if (!documentsInDB) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data Kategori.` });
    }

    let updateCategory = {};
    const { categoryName, description, isForceUpdate } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyCategoryName = CheckingIsNilValue(categoryName);
    const isEmptyForceUpdate = CheckingIsNilValue(isForceUpdate);

    if (!categoryName || isEmptyCategoryName || isEmptyForceUpdate) {
      res.status(404).json({ status: 'failed', messages: `Format tidak sesuai atau input value kosong!`, format: FormatCategory });
      return;
    }

    const isCategoryNameUsed = await CategoriesModel.aggregate([{ $match: { categoryName: categoryName.toLowerCase() } }]);

    if (!isForceUpdate && isCategoryNameUsed.length) {
      res.status(403).json({ status: 'failed', messages: `Nama kategori sudah terdaftar! Silahkan untuk mengganti nama data Kategori.` });
      return;
    }

    updateCategory = CheckingObjectValue(updateCategory, { categoryName });
    updateCategory = CheckingObjectValue(updateCategory, { description });

    return await CategoriesModel.findByIdAndUpdate(id, updateCategory)
      .then((result) => res.status(200).json({ status: 'success', messages: `Berhasil memperbaharui data Kategori.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal memperbaharui data Kategori. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil data Kategori. Function Catch: ${err}` });
  }
};

export const DeleteCategoryByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await CategoriesModel.findById(id);

    if (!documentsInDB) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data Kategori.` });
    }

    return await CategoriesModel.findByIdAndRemove(id)
      .then((result) => res.status(200).json({ status: 'success', messages: `Berhasil menghapus data Kategori.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal menghapus data Kategori. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil data Kategori. Function Catch: ${err}` });
  }
};
