/** @format */

import { BrandModel, FormatBrand } from '../../models/brands.js';
import { CheckingIsNilValue, CheckingKeyReq, CheckingKeyReqSyntax, CheckingObjectValue } from '../../utils/utils.js';

export const CreateItemBrand = async (req, res) => {
  try {
    const { brandName, description } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyBrandName = CheckingIsNilValue(brandName);

    if (!brandName || isEmptyBrandName) {
      return res.status(404).json({ status: 'failed', messages: `Format tidak sesuai atau input value kosong!`, format: FormatBrand });
    }

    const isBrandNameUsed = await BrandModel.aggregate([{ $match: { brandName: brandName.toLowerCase() } }]);

    if (isBrandNameUsed.length) {
      return res.status(403).json({ status: 'failed', messages: `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama data Brand.` });
    }

    const newBrand = BrandModel({ brandName: brandName.toLowerCase(), description });

    return await newBrand
      .save()
      .then((result) => res.status(201).json({ status: 'success', messages: `Berhasil menyimpan data Brand.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal menyimpan data Brand. Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal menyimpan data Brand. Function Catch: ${err}` });
  }
};

export const GetBrands = async (req, res) => {
  try {
    const syntaxExec = ['brandName', 'page', 'document'];
    const { brandName, page, document } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);

    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length) {
      return res.status(404).json({ status: 'failed', messages: `Gagal mengambil data! Query filter tidak sesuai.` });
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
      return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data Brand.`, data: documentsInDB });
    }

    return res.status(404).json({ status: 'success', messages: `Tidak ada data Brand.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil data Brand. Function Catch: ${err}` });
  }
};

export const GetBrandByID = async (req, res) => {
  try {
    const { id } = req.params;

    const documentsInDB = await BrandModel.findById(id);

    if (!documentsInDB) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data Brand.` });
    }

    return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data Brand.`, data: documentsInDB });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil data Brand. Function Catch: ${err}` });
  }
};

export const UpdateBrandByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await BrandModel.findById(id);

    if (!documentsInDB) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data Brand.` });
    }

    let updateBrand = {};
    const { brandName, description, isForceUpdate } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyBrandName = CheckingIsNilValue(brandName);
    const isEmptyForceUpdate = CheckingIsNilValue(isForceUpdate);

    if (!brandName || isEmptyBrandName || isEmptyForceUpdate) {
      res.status(404).json({ status: 'failed', messages: `Format tidak sesuai atau input value kosong!`, format: FormatBrand });
      return;
    }

    const isBrandNameUsed = await BrandModel.aggregate([{ $match: { brandName: brandName.toLowerCase() } }]);

    if (!isForceUpdate && isBrandNameUsed.length) {
      res.status(403).json({ status: 'failed', messages: `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama data Brand.` });
      return;
    }

    updateBrand = CheckingObjectValue(updateBrand, { brandName });
    updateBrand = CheckingObjectValue(updateBrand, { description });

    return await BrandModel.findByIdAndUpdate(id, updateBrand)
      .then((result) => res.status(200).json({ status: 'success', messages: `Berhasil memperbaharui data Brand.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal memperbaharui data Brand. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil data Brand. Function Catch: ${err}` });
  }
};

export const DeleteBrandByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await BrandModel.findById(id);

    if (!documentsInDB) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data Brand.` });
    }

    return await BrandModel.findByIdAndRemove(id)
      .then((result) => res.status(200).json({ status: 'success', messages: `Berhasil menghapus data Brand.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal menghapus data Brand. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil data Brand. Function Catch: ${err}` });
  }
};
