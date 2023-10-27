/** @format */

const Convert = require('../utils/convert');
const UsersModel = require('../models/users.model');

const CreateUsersData = async (DataPostman, res) => {
  try {
    const { username, password, email, full_name } = DataPostman.body;
    const formatInputData = {
      username: 'String',
      password: 'Combine (String/Number/Symbol)',
      email: 'String',
      full_name: { first_name: 'String', last_name: 'String' },
    };
    const isUsernameNotEmptyValue = username == '' || username == ' ';
    const isPasswordNotEmptyValue = password == '' || password == ' ';
    const isEmailNotEmptyValue = email == '' || email == ' ';
    const isFullNameNotEmptyValue = full_name == '' || full_name == ' ';
    if (!username || !password || !email || !full_name) {
      return res.status(404).json({ status: 'failed', message: `Format tidak sesuai!`, format: formatInputData });
    } else if (isUsernameNotEmptyValue || isPasswordNotEmptyValue || isEmailNotEmptyValue || isFullNameNotEmptyValue) {
      return res.status(404).json({ status: 'failed', message: `Format tidak sesuai atau input value kosong!`, format: formatInputData });
    }
    const isUsernameDocumentHasInDatabase = await UsersModel.find({ username: username });
    const isEmailDocumentHasInDatabase = await UsersModel.find({ email: email.toLowerCase() });
    if (isUsernameDocumentHasInDatabase.length > 0 || isEmailDocumentHasInDatabase.length > 0) {
      return res.status(403).json({ status: 'failed', message: `username atau email sudah terdaftar! harap untuk menggunakan yang lain.` });
    }
    const newUser = UsersModel({ username, password, email: email.toLowerCase(), full_name, contact_number: '', address: '', role: '' });
    return await newUser
      .save()
      .then((result) => res.status(201).json({ status: 'success', message: `Berhasil membuat user.` }))
      .catch((err) => res.status(500).json({ status: 'failed', message: `Gagal membuat user. Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal membuat user. Function Catch: ${err}` });
  }
};

const GetUsersData = async (DataPostman, res) => {
  try {
    const queryParamsShouldExec = ['username', 'email', 'first_name', 'last_name'];
    let isCommandShouldExec = false;
    let { username, email, first_name, last_name } = DataPostman.body;
    for (const key in DataPostman.body) {
      if (queryParamsShouldExec.includes(key)) {
        isCommandShouldExec = queryParamsShouldExec.includes(key);
        break;
      }
    }
    if (!isCommandShouldExec) {
      for (const key in DataPostman.query) {
        if (queryParamsShouldExec.includes(key)) {
          isCommandShouldExec = queryParamsShouldExec.includes(key);
          ({ username, email, first_name, last_name } = DataPostman.query);
          break;
        }
      }
    }

    if (!isCommandShouldExec && (Object.keys(DataPostman.query).length > 0 || Object.keys(DataPostman.body).length > 0)) {
      return res.status(404).json({ status: 'failed', message: `Gagal mengambil data! Query tidak sesuai.` });
    }

    if (isCommandShouldExec) {
      if (username || email || first_name || last_name) {
        if (Object.keys(DataPostman.query).length > 1 || Object.keys(DataPostman.body).length > 1) {
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
          return res.status(404).json({ status: 'failed', message: `Gagal mengambil data! Query tidak sesuai.` });
        }
        let toFilter = username ? { username: username } : false;
        toFilter = email ? { email: email } : toFilter;
        toFilter = first_name ? { full_name: { first_name: first_name } } : toFilter;
        toFilter = last_name ? { full_name: { last_name: last_name } } : toFilter;
        const isDocumentHasInDatabase = await UsersModel.aggregate([
          {
            $project: {
              _id: 0,
              username: 1,
              email: 1,
              full_name: 1,
            },
          },
          {
            $match: toFilter,
          },
        ]);
        if (isDocumentHasInDatabase.length < 1) {
          return res.status(404).json({ status: 'success', message: `Tidak ada data user tersebut.` });
        }
        return res.status(200).json({ status: 'success', message: `Berhasil mengambil data user.`, data: isDocumentHasInDatabase });
      }
      return res.status(404).json({ status: 'failed', message: `Tidak ada data user tersebut.` });
    }

    const isDocumentHasInDatabase = await UsersModel.aggregate([
      {
        $project: {
          _id: 0,
          username: 1,
          email: 1,
          full_name: 1,
        },
      },
    ]);
    if (isDocumentHasInDatabase.length > 0) {
      return res.status(200).json({ status: 'success', message: `Berhasil mengambil data user.`, data: isDocumentHasInDatabase });
    }
    return res.status(200).json({ status: 'success', message: `Tidak ada data user.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal mengambil data user. Function Catch: ${err}` });
  }
};

module.exports = {
  CreateUsersData,
  GetUsersData,
};