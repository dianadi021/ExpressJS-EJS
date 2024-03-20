/** @format */

import { BrandModel, FormatBrand } from '../../models/brands.js';
import { CheckingIsNilValue, CheckingKeyReq, CheckingKeyReqSyntax, CheckingObjectValue, ReturnEJSViews } from '../../utils/utils.js';

export const CreateItemBrand = async (req, res) => {
  try {
    const { brandName, description } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyBrandName = CheckingIsNilValue(brandName);

    if (!brandName || isEmptyBrandName) {
      return ReturnEJSViews(req, res, 'home', 400, false, `Format tidak sesuai atau input value kosong!`, FormatBrand);
    }

    const isBrandNameUsed = await BrandModel.aggregate([{ $match: { brandName: brandName.toLowerCase() } }]);

    if (isBrandNameUsed.length) {
      return ReturnEJSViews(req, res, 'home', 500, false, `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama data Brand.`);
    }

    const newBrand = BrandModel({ brandName: brandName.toLowerCase(), description });

    return await newBrand
      .save()
      .then((result) => {
        console.log(`201 Success created Brands`);
        ReturnEJSViews(req, res, 'home', 201, true, `Berhasil menyimpan data Brand.`);
      })
      .catch((err) => ReturnEJSViews(req, res, 'home', 500, false, `Gagal menyimpan data Brand. Catch: ${err}`));
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal menyimpan data Brand. Function Catch: ${err}`);
  }
};

export const GetBrands = async (req, res) => {
  try {
    const syntaxExec = ['brandName', 'page', 'document'];
    const { brandName, page, document } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);

    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length) {
      return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data! Query filter tidak sesuai.`);
    }

    const toFilter = brandName ? { brandName: brandName.toLowerCase() } : false;

    let documentsInDB = await BrandModel.aggregate([{ $project: { _id: 1, brandName: 1 } }]);
    documentsInDB =
      isHasSyntax && brandName ? await BrandModel.aggregate([{ $project: { _id: 1, brandName: 1 } }, { $match: toFilter }]) : documentsInDB;
    documentsInDB =
      page && document
        ? await BrandModel.aggregate([
            { $project: { _id: 1, brandName: 1 } },
            { $skip: (parseInt(page) - 1) * parseInt(document) },
            { $limit: parseInt(document) },
          ])
        : documentsInDB;

    if (documentsInDB.length) {
      return ReturnEJSViews(req, res, 'home', 201, true, `Berhasil mengambil data Brand.`, documentsInDB);
    }

    return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Brand.`);
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Brand. Function Catch: ${err}`);
  }
};

export const GetBrandByID = async (req, res) => {
  try {
    const { id } = req.params;

    const documentsInDB = await BrandModel.findById(id);

    if (!documentsInDB) {
      return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Brand.`);
    }

    return ReturnEJSViews(req, res, 'home', 201, true, `Berhasil mengambil data Brand.`, documentsInDB);
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Brand. Function Catch: ${err}`);
  }
};

export const UpdateBrandByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await BrandModel.findById(id);

    if (!documentsInDB) {
      return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Brand.`);
    }

    let updateBrand = {};
    const { brandName, description, isForceUpdate } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyBrandName = CheckingIsNilValue(brandName);
    const isEmptyForceUpdate = CheckingIsNilValue(isForceUpdate);

    if (!brandName || isEmptyBrandName || isEmptyForceUpdate) {
      return ReturnEJSViews(req, res, 'home', 400, false, `Format tidak sesuai atau input value kosong!`, FormatBrand);
    }

    const isBrandNameUsed = await BrandModel.aggregate([{ $match: { brandName: brandName.toLowerCase() } }]);

    if (!isForceUpdate && isBrandNameUsed.length) {
      return ReturnEJSViews(req, res, 'home', 500, false, `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama data Brand.`);
    }

    updateBrand = CheckingObjectValue(updateBrand, { brandName });
    updateBrand = CheckingObjectValue(updateBrand, { description });

    return await BrandModel.findByIdAndUpdate(id, updateBrand)
      .then((result) => {
        console.log(`201 Success updated Brands`);
        ReturnEJSViews(req, res, 'home', 201, true, `Berhasil memperbaharui data Brand.`);
      })
      .catch((err) => ReturnEJSViews(req, res, 'home', 500, true, `Gagal memperbaharui data Brand. Function Catch: ${err}`));
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Brand. Function Catch: ${err}`);
  }
};

export const DeleteBrandByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await BrandModel.findById(id);

    if (!documentsInDB) {
      return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Brand.`);
    }

    return await BrandModel.findByIdAndRemove(id)
      .then((result) => {
        console.log(`201 Success deleted Brands`);
        ReturnEJSViews(req, res, 'home', 201, true, `Berhasil menghapus data Brand.`);
      })
      .catch((err) => ReturnEJSViews(req, res, 'home', 500, false, `Gagal menghapus data Brand. Function Catch: ${err}`));
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Brand. Function Catch: ${err}`);
  }
};
