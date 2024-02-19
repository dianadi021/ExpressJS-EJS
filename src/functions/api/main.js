/** @format */

import { FormatMain, MainModel, mongoose } from '../../models/main.js';
import { CheckingIsNilValue, CheckingKeyReq } from '../../utils/utils.js';

export const CreateMain = async (req, res) => {
  try {
    const { brandName, description } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyBrandName = CheckingIsNilValue(brandName);

    if (!brandName || isEmptyBrandName) {
      return res.status(404).json({ status: 'failed', messages: `Format tidak sesuai atau input value kosong!`, format: FormatMain });
    }

    MainModel.find();
    mongoose;
    return res.status(200).json({ status: 'success', messages: `Oke.`, data: FormatMain });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};

export const GetMain = async (req, res) => {
  try {
    const { brandName, description } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyBrandName = CheckingIsNilValue(brandName);
    MainModel.find();
    mongoose;
    return res.status(200).json({ status: 'success', messages: `Oke.`, data: FormatMain });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};

export const GetMainByID = async (req, res) => {
  try {
    const { id } = req.params;
    MainModel.find();
    mongoose;
    return res.status(200).json({ status: 'success', messages: `Oke.`, data: FormatMain });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
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
    return res.status(200).json({ status: 'success', messages: `Oke.`, data: FormatMain });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};

export const DeleteMainByID = async (req, res) => {
  try {
    const { id } = req.params;
    MainModel.find();
    mongoose;
    return res.status(200).json({ status: 'success', messages: `Oke.`, data: FormatMain });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};
