/** @format */

import { MainModel, mongoose } from '../../models/main.js';
import { CheckingIsNilValue, CheckingKeyReq, ReturnEJSViews } from '../../utils/utils.js';

export const CreateMain = async (req, res) => {
  try {
    const { brandName, description } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyBrandName = CheckingIsNilValue(brandName);

    if (!brandName || isEmptyBrandName) {
      return ReturnEJSViews(req, res, 'home', 500, false, `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama data Brand.`);
    }

    MainModel.find();
    mongoose;
    return ReturnEJSViews(req, res, 'home', 500, false, `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama data Brand.`);
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama data Brand.`);
  }
};

export const GetMain = async (req, res) => {
  try {
    const { brandName, description } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyBrandName = CheckingIsNilValue(brandName);
    MainModel.find();
    mongoose;
    return ReturnEJSViews(req, res, 'home', 500, false, `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama data Brand.`);
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama data Brand.`);
  }
};

export const GetMainByID = async (req, res) => {
  try {
    const { id } = req.params;
    MainModel.find();
    mongoose;
    return ReturnEJSViews(req, res, 'home', 500, false, `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama data Brand.`);
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama data Brand.`);
  }
};

export const UpdateMainByID = async (req, res) => {
  try {
    const { id } = req.params;
    const { brandName, description, isForceUpdate } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyBrandName = CheckingIsNilValue(brandName);
    const isEmptyForceUpdate = CheckingIsNilValue(isForceUpdate);

    const isMainNameUsed = await MainModel.aggregate([{ $match: { brandName: brandName.toLowerCase() } }]);

    if (!isEmptyForceUpdate && isMainNameUsed.length) {
      res.status(403).json({
        status: 'failed',
        messages: `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama data Brand.`,
        format: { isForceUpdate: true },
      });
      return;
    }

    mongoose;
    return ReturnEJSViews(req, res, 'home', 500, false, `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama data Brand.`);
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama data Brand.`);
  }
};

export const DeleteMainByID = async (req, res) => {
  try {
    const { id } = req.params;
    MainModel.find();
    mongoose;
    return ReturnEJSViews(req, res, 'home', 500, false, `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama data Brand.`);
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama data Brand.`);
  }
};
