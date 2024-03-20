/** @format */

import Bcrypt from 'bcrypt';
import { FormatUsers, UsersModel, mongoose } from '../../models/users.js';
import {
  CheckingIsNilValue,
  CheckingKeyReq,
  CheckingKeyReqSyntax,
  DecodePasswordToHash,
  IsInputWasValidString,
  ReturnEJSViews,
} from '../../utils/utils.js';

export const CreateUsers = async (req, res) => {
  try {
    const { username, email, password, name, address } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyUsername = CheckingIsNilValue(username);
    const isEmptyEmail = CheckingIsNilValue(email);
    const isEmptyPassword = CheckingIsNilValue(password);
    const isEmptyName = CheckingIsNilValue(name);

    if (!username || isEmptyUsername || isEmptyEmail || isEmptyPassword || isEmptyName) {
      return ReturnEJSViews(req, res, 'users', 400, false, `Format tidak sesuai atau input value kosong!`, FormatUsers);
    }

    if (!IsInputWasValidString('username', username) || !IsInputWasValidString('email', email)) {
      return ReturnEJSViews(req, res, 'users', `Format Username atau Email tidak sesuai!`);
    }

    const isUsernameUsed = await UsersModel.aggregate([{ $match: { username: username.toLowerCase() } }]);

    if (isUsernameUsed.length) {
      return ReturnEJSViews(req, res, 'users', 500, false, `Username sudah terdaftar! Silahkan untuk mengganti Username.`);
    }

    const isEmailUsed = await UsersModel.aggregate([{ $match: { email: email.toLowerCase() } }]);

    if (isEmailUsed.length) {
      return ReturnEJSViews(req, res, 'users', 500, false, `Email sudah terdaftar! Silahkan untuk mengganti Email.`);
    }

    const encryptPass = await Bcrypt.hash(DecodePasswordToHash(password), 12)
      .then((result) => {
        console.log(`Success encrypt the password`);
        return result;
      })
      .catch((err) => {
        console.log(`failed to encrypt the password catch err: ${err}`);
        return;
      });

    console.log(encryptPass);

    if (!encryptPass.length) {
      return ReturnEJSViews(req, res, 'users', 500, false, `Password gagal terenkripsi.`);
    }

    const newUsers = UsersModel({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: encryptPass,
      name: name.toLowerCase(),
      address,
    });

    return await newUsers
      .save()
      .then((result) => {
        console.log(`201 Success created Items`);
        ReturnEJSViews(req, res, 'users', 201, true, `Berhasil menyimpan data Users.`);
      })
      .catch((err) => ReturnEJSViews(req, res, 'users', 500, false, `Gagal menyimpan data Users. Catch: ${err}`));
  } catch (err) {
    return ReturnEJSViews(req, res, 'users', 500, false, `Fail. Function Catch: ${err}`);
  }
};

export const GetUsers = async (req, res) => {
  try {
    const syntaxExec = ['username', 'email', 'name', 'search', 'page', 'document'];
    const { search } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);

    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length) {
      return res.status(404).json({ status: 'failed', messages: `Gagal mengambil data! Query filter tidak sesuai.` });
    }

    const username = IsInputWasValidString('username', search) ? search : false;
    const email = IsInputWasValidString('email', search) ? search : false;
    const name = IsInputWasValidString('name', search) ? search : false;

    let toFilter = username ? { username: username.toLowerCase() } : false;
    toFilter = !toFilter ? { email: email.toLowerCase() } : toFilter;
    toFilter = !toFilter ? { name: name.toLowerCase() } : toFilter;

    const isHadDocument = await UsersModel.findOne(toFilter);

    if (isHadDocument) {
      return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: isHadDocument });
    }

    return res.status(200).json({ status: 'success', messages: `Tidak ada data.`, data: FormatUsers });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};

export const GetUsersByID = async (req, res) => {
  try {
    const { id } = req.params;
    UsersModel.find();
    mongoose;
    return res.status(200).json({ status: 'success', messages: `Oke.`, data: FormatUsers });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};

export const UpdateUsersByID = async (req, res) => {
  try {
    const { id } = req.params;
    const { brandName, description, isForceUpdate } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyBrandName = CheckingIsNilValue(brandName);
    const isEmptyForceUpdate = CheckingIsNilValue(isForceUpdate);

    const isUsersNameUsed = await UsersModel.aggregate([{ $match: { brandName: brandName.toLowerCase() } }]);

    if (!isEmptyForceUpdate && isUsersNameUsed.length) {
      res.status(403).json({
        status: 'failed',
        messages: `Nama Brand sudah terdaftar! Silahkan untuk mengganti nama data Brand.`,
        format: { isForceUpdate: true },
      });
      return;
    }

    mongoose;
    return res.status(200).json({ status: 'success', messages: `Oke.`, data: FormatUsers });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};

export const DeleteUsersByID = async (req, res) => {
  try {
    const { id } = req.params;
    UsersModel.find();
    mongoose;
    return res.status(200).json({ status: 'success', messages: `Oke.`, data: FormatUsers });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};
