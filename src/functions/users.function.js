/** @format */

const { UsersModel, FormatInputUser } = require("../models/users.model");
const { CheckingKeyReq, CheckingKeyReqSyntax, CheckingIsNilValue, CheckingObjectValue } = require("../utils/utils");

const CreateUsersData = async (req, res) => {
  try {
    const { username, password, email } = req.body.data ? JSON.parse(req.body.data) : req.body;
    if (!username || !password || !email) {
      return res.status(404).json({ status: "failed", message: `Format tidak sesuai!`, format: FormatInputUser });
    }
    // const { first_name, last_name } = full_name;
    const isUsernameEmptyValue = CheckingIsNilValue(username);
    const isPasswordEmptyValue = CheckingIsNilValue(password);
    const isEmailEmptyValue = CheckingIsNilValue(email);
    // const isFullNameEmptyValue = CheckingIsNilValue(first_name) || CheckingIsNilValue(last_name);
    if (isUsernameEmptyValue || isPasswordEmptyValue || isEmailEmptyValue) {
      return res
        .status(404)
        .json({ status: "failed", message: `Format tidak sesuai atau input value kosong!`, format: FormatInputUser });
    }
    const isUsernameWasUsed = await UsersModel.find({ username: username.toLowerCase() });
    const isEmailWasUsed = await UsersModel.find({ email: email.toLowerCase() });
    if (isUsernameWasUsed.length >= 1 || isEmailWasUsed.length >= 1) {
      return res
        .status(403)
        .json({ status: "failed", message: `username atau email sudah terdaftar! harap untuk menggunakan yang lain.` });
    }
    const newUser = UsersModel({
      username: username.toLowerCase(),
      password,
      email: email.toLowerCase(),
      full_name: username,
      contact_number: null,
      address: null,
      role: null,
    });
    return await newUser
      .save()
      // .then((result) => res.status(201).json({ status: 'success', message: `Berhasil membuat user.` }))
      .then((result) => res.render("users", { status: "success", message: `Berhasil membuat data user` }))
      .catch((err) => res.status(500).json({ status: "failed", message: `Gagal membuat user. Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: "failed", message: `Gagal membuat user. Function Catch: ${err}` });
  }
};

const LoginUsers = async (req, res) => {
  try {
    const { username, password, email } = req.body.data ? JSON.parse(req.body.data) : req.body;
    if (!username || !password || !email) {
      return res.status(404).json({ status: "failed", message: `Format tidak sesuai!`, format: FormatInputUser });
    }
    // const { first_name, last_name } = full_name;
    const isUsernameEmptyValue = CheckingIsNilValue(username);
    const isPasswordEmptyValue = CheckingIsNilValue(password);
    const isEmailEmptyValue = CheckingIsNilValue(email);
    // const isFullNameEmptyValue = CheckingIsNilValue(first_name) || CheckingIsNilValue(last_name);
    if (isUsernameEmptyValue || isPasswordEmptyValue || isEmailEmptyValue) {
      return res
        .status(404)
        .json({ status: "failed", message: `Format tidak sesuai atau input value kosong!`, format: FormatInputUser });
    }
    const isUsernameWasUsed = await UsersModel.find({ username: username.toLowerCase() });
    const isEmailWasUsed = await UsersModel.find({ email: email.toLowerCase() });
  } catch (err) {
    return res.status(500).json({ status: "failed", message: `Gagal membuat user. Function Catch: ${err}` });
  }
};

const GetUsersData = async (req, res) => {
  try {
    const syntaxExec = ["username", "email", "first_name", "last_name", "document", "page"];
    const { username, email, first_name, last_name, document, page } = CheckingKeyReq(
      req.body,
      req.query,
      req.body.data
    );
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);
    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length >= 1) {
      // const isDocumentHasInDatabase = await UsersModel.aggregate([
      //   {
      //     $project: {
      //       username: 1,
      //       email: 1,
      //       full_name: 1,
      //     },
      //   },
      //   {
      //     $match: toFilter,
      //   },
      // ]);
      // if (!isDocumentHasInDatabase) {
      //   return res.status(404).json({ status: 'success', message: `Tidak ada data user tersebut.` });
      // }
      // return res.status(200).json({ status: 'success', message: `Berhasil mengambil data user.`, data: isDocumentHasInDatabase });
      return res.status(404).json({ status: "failed", message: `Gagal mengambil data! Query tidak sesuai.` });
    }
    if (isHasSyntax && (username || email || first_name || last_name)) {
      let toFilter = username ? { username: username.toLowerCase() } : false;
      toFilter = email ? { email: email.toLowerCase() } : toFilter;
      toFilter = first_name ? { full_name: { first_name: first_name } } : toFilter;
      toFilter = last_name ? { full_name: { last_name: last_name } } : toFilter;
      const isDocumentHasInDatabase = await UsersModel.aggregate([
        { $project: { _id: 1, username: 1, email: 1, full_name: 1 } },
        { $match: toFilter },
      ]);
      if (isDocumentHasInDatabase.length < 1) {
        return res.status(404).json({ status: "success", message: `Tidak ada data user tersebut.` });
      }
      return res
        .status(200)
        .json({ status: "success", message: `Berhasil mengambil data user.`, data: isDocumentHasInDatabase });
    }

    // START PAGINATION ($SKIP & $LIMIT)
    const isDocumentHasInDatabase =
      !page && !document
        ? await UsersModel.aggregate([{ $project: { _id: 1, username: 1, email: 1, full_name: 1 } }])
        : await UsersModel.aggregate([
            { $project: { _id: 1, username: 1, email: 1, full_name: 1 } },
            { $skip: (parseInt(page) - 1) * parseInt(document) },
            { $limit: parseInt(document) },
          ]);
    // END PAGINATION ($SKIP & $LIMIT)
    if (isDocumentHasInDatabase.length > 0) {
      // return res.status(200).json({ status: 'success', message: `Berhasil mengambil data user.`, data: isDocumentHasInDatabase });
      res.render("users", {
        status: "success",
        message: `Berhasil mengambil data user`,
        data: JSON.stringify(isDocumentHasInDatabase),
      });
    }
    res.render("users", { status: "success", message: `Tidak ada data user`, data: false });
    // return res.status(404).json({ status: 'success', message: `Tidak ada data user.` });
  } catch (err) {
    return res.status(500).json({ status: "failed", message: `Gagal mengambil data user. Function Catch: ${err}` });
  }
};

const GetUserDetails = async (req, res) => {
  try {
    let { id } = req.params;
    const isDocumentHasInDatabase = await UsersModel.findById(id);
    if (isDocumentHasInDatabase) {
      return res
        .status(200)
        .json({ status: "success", message: `Berhasil mengambil data user.`, data: isDocumentHasInDatabase });
    }
    return res.status(404).json({ status: "success", message: `Tidak ada data user.` });
  } catch (err) {
    return res.status(500).json({ status: "failed", message: `Gagal mengambil data user. Function Catch: ${err}` });
  }
};

const UpdateUserData = async (req, res) => {
  try {
    const { id } = req.params;
    const isDocumentHasInDatabase = await UsersModel.findById(id);
    if (!isDocumentHasInDatabase) {
      return res.status(404).json({ status: "success", message: `Tidak ada data user.` });
    }
    const { username, password, email, full_name, contact_number, address, role } = CheckingKeyReq(
      req.body,
      req.query,
      req.body.data
    );
    if (!username || !password || !email || !full_name) {
      return res.status(404).json({ status: "failed", message: `Format tidak sesuai!`, format: FormatInputUser });
    }
    const isUsernameWasUsed = await UsersModel.find({ username: username.toLowerCase() });
    const isEmailWasUsed = await UsersModel.find({ email: email.toLowerCase() });
    const isUsernameIDReady = isUsernameWasUsed.length >= 1 ? isUsernameWasUsed[0]._id : id;
    const isEmailIDReady = isEmailWasUsed.length >= 1 ? isEmailWasUsed[0]._id : id;
    if (isUsernameIDReady != id || isEmailIDReady != id) {
      return res
        .status(403)
        .json({ status: "failed", message: `username atau email sudah terdaftar! harap untuk menggunakan yang lain.` });
    }
    const { first_name, last_name } = full_name;
    const isUsernameEmptyValue = CheckingIsNilValue(username);
    const isPasswordEmptyValue = CheckingIsNilValue(password);
    const isEmailEmptyValue = CheckingIsNilValue(email);
    const isFullNameEmptyValue = CheckingIsNilValue(first_name) || CheckingIsNilValue(last_name);
    if (isUsernameEmptyValue || isPasswordEmptyValue || isEmailEmptyValue || isFullNameEmptyValue) {
      return res
        .status(404)
        .json({ status: "failed", message: `Format tidak sesuai atau input value kosong!`, format: FormatInputUser });
    }
    let updateUser = { username: username.toLowerCase(), password, email: email.toLowerCase(), full_name };
    updateUser = CheckingObjectValue(updateUser, { role });
    updateUser = CheckingObjectValue(updateUser, { address });
    updateUser = CheckingObjectValue(updateUser, { contact_number });
    return await UsersModel.findByIdAndUpdate(id, updateUser)
      .then((result) => res.status(200).json({ status: "success", message: `Berhasil memperbaharui data user.` }))
      .catch((err) =>
        res.status(500).json({ status: "failed", message: `Gagal memperbaharui data user. Function Catch: ${err}` })
      );
  } catch (err) {
    return res.status(500).json({ status: "failed", message: `Gagal memperbaharui data user. Function Catch: ${err}` });
  }
};

const DeleteUserData = async (req, res) => {
  try {
    const { id } = req.params;
    const isDocumentHasInDatabase = await UsersModel.findById(id);
    if (!isDocumentHasInDatabase) {
      return res.status(404).json({ status: "success", message: `Tidak ada data user.` });
    }
    return await UsersModel.findByIdAndRemove(id)
      .then((result) => res.status(200).json({ status: "success", message: `Berhasil menghapus data user.` }))
      .catch((err) =>
        res.status(500).json({ status: "failed", message: `Gagal menghapus data user. Function Catch: ${err}` })
      );
  } catch (err) {
    return res.status(500).json({ status: "failed", message: `Gagal menghapus data user. Function Catch: ${err}` });
  }
};

module.exports = {
  CreateUsersData,
  LoginUsers,
  GetUsersData,
  GetUserDetails,
  UpdateUserData,
  DeleteUserData,
};
