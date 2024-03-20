/** @format */

import { CategoriesModel } from '../../models/categories.js';
import { CheckingIsNilValue, CheckingKeyReq, CheckingKeyReqSyntax, CheckingObjectValue, ReturnEJSViews } from '../../utils/utils.js';

export const CreateCategory = async (req, res) => {
  try {
    const { categoryName, description } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyCategoryName = CheckingIsNilValue(categoryName);

    if (!categoryName || isEmptyCategoryName) {
      return ReturnEJSViews(req, res, 'home', 400, false, `Format tidak sesuai atau input value kosong!`, FormatCategory);
    }

    const isCategoryNameUsed = await CategoriesModel.aggregate([{ $match: { categoryName: categoryName.toLowerCase() } }]);

    if (isCategoryNameUsed.length) {
      return ReturnEJSViews(req, res, 'home', 500, false, `Nama Kategori sudah terdaftar! Silahkan untuk mengganti nama data Kategori.`);
    }

    const newCategory = CategoriesModel({ categoryName: categoryName.toLowerCase(), description });

    return await newCategory
      .save()
      .then((result) => {
        console.log(`201 Success created Categories`);
        ReturnEJSViews(req, res, 'home', 201, true, `Berhasil menyimpan data Kategori.`);
      })
      .catch((err) => ReturnEJSViews(req, res, 'home', 500, false, `Gagal menyimpan data Kategori. Catch: ${err}`));
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal menyimpan data Kategori. Function Catch: ${err}`);
  }
};

export const GetCategories = async (req, res) => {
  try {
    const syntaxExec = ['categoryName', 'page', 'document'];
    const { categoryName, page, document } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);

    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length) {
      return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data! Query filter tidak sesuai.`);
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
      return ReturnEJSViews(req, res, 'home', 201, true, `Berhasil mengambil data Kategori.`, documentsInDB);
    }

    return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Kategori.`);
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Kategori. Function Catch: ${err}`);
  }
};

export const GetCategoryByID = async (req, res) => {
  try {
    const { id } = req.params;

    const documentsInDB = await CategoriesModel.findById(id);

    if (documentsInDB.length) {
      return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Kategori.`);
    }

    return ReturnEJSViews(req, res, 'home', 201, true, `Berhasil mengambil data Kategori.`, documentsInDB);
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Kategori. Function Catch: ${err}`);
  }
};

export const UpdateCategoryByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await CategoriesModel.findById(id);

    if (!documentsInDB) {
      return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Kategori.`);
    }

    let updateCategory = {};
    const { categoryName, description, isForceUpdate } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyCategoryName = CheckingIsNilValue(categoryName);
    const isEmptyForceUpdate = CheckingIsNilValue(isForceUpdate);

    if (!categoryName || isEmptyCategoryName || isEmptyForceUpdate) {
      return ReturnEJSViews(req, res, 'home', 400, false, `Format tidak sesuai atau input value kosong!`, FormatCategory);
    }

    const isCategoryNameUsed = await CategoriesModel.aggregate([{ $match: { categoryName: categoryName.toLowerCase() } }]);

    if (!isForceUpdate && isCategoryNameUsed.length) {
      return ReturnEJSViews(req, res, 'home', 500, false, `Nama Kategori sudah terdaftar! Silahkan untuk mengganti nama data Kategori.`);
    }

    updateCategory = CheckingObjectValue(updateCategory, { categoryName });
    updateCategory = CheckingObjectValue(updateCategory, { description });

    return await CategoriesModel.findByIdAndUpdate(id, updateCategory)
      .then((result) => {
        console.log(`201 Success updated Categories`);
        ReturnEJSViews(req, res, 'home', 201, true, `Berhasil memperbaharui data Kategori.`);
      })
      .catch((err) => ReturnEJSViews(req, res, 'home', 500, true, `Gagal memperbaharui data Kategori. Function Catch: ${err}`));
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Kategori. Function Catch: ${err}`);
  }
};

export const DeleteCategoryByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await CategoriesModel.findById(id);

    if (!documentsInDB) {
      return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Kategori.`);
    }

    return await CategoriesModel.findByIdAndRemove(id)
      .then((result) => {
        console.log(`201 Success deleted Categories`);
        ReturnEJSViews(req, res, 'home', 201, true, `Berhasil menghapus data Kategori.`);
      })
      .catch((err) => ReturnEJSViews(req, res, 'home', 500, false, `Gagal menghapus data Kategori. Function Catch: ${err}`));
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Kategori. Function Catch: ${err}`);
  }
};
