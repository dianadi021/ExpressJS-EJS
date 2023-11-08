/** @format */

const { ArticlesModel, FormatInputArticle } = require('../models/articles.model');
const { CheckingKeyReq, CheckingKeyReqSyntax, CheckingIsNilValue } = require('../utils/utils');

const CreateDataArticles = async (req, res) => {
  try {
    let title, category, description, body, authorId;
    if (!req.body) {
      ({ title, category, description, body, authorId } = JSON.parse(req.body.data));
    } else {
      ({ title, category, description, body, authorId } = req.body);
    }
    if (!title || !category || !description || !body) {
      return res.status(404).json({ status: 'failed', message: `Format tidak sesuai!`, format: FormatInputArticle });
    }
    const { originalname, filename, path } = req.file;
    const isTitleEmptyString = title == '' || title == ' ';
    const isDescriptionEmptyString = description == '' || description == ' ';
    const isBodyEmptyString = body == '' || body == ' ';
    if (isTitleEmptyString || isDescriptionEmptyString || isBodyEmptyString) {
      return res
        .status(404)
        .json({ status: 'failed', message: `Format tidak sesuai atau input value kosong!`, format: FormatInputArticle });
    }
    const newArticle = ArticlesModel({
      title: title ? title : null,
      category: category ? category : null,
      description: description ? description : null,
      body: body ? body : null,
      authorId: authorId ? authorId : null,
      thumbnailImage: originalname ? originalname : null,
    });
    return await newArticle
      .save()
      .then((result) => res.status(201).json({ status: 'success', message: `Berhasil membuat artikel.` }))
      .catch((err) => res.status(500).json({ status: 'failed', message: `Gagal membuat artikel. Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal membuat artikel. Function Catch: ${err}` });
  }
};

const GetArticlesData = async (req, res) => {
  try {
    const queryParamsShouldExec = ['title', 'category', 'author'];
    let isCommandShouldExec = false;
    let { title, category, author } = req.body;
    for (const key in req.body) {
      if (queryParamsShouldExec.includes(key)) {
        isCommandShouldExec = queryParamsShouldExec.includes(key);
        break;
      }
    }
    if (!isCommandShouldExec) {
      for (const key in req.query) {
        if (queryParamsShouldExec.includes(key)) {
          isCommandShouldExec = queryParamsShouldExec.includes(key);
          ({ title, category, author } = req.query);
          break;
        }
      }
    }
    if (!isCommandShouldExec && (Object.keys(req.query).length > 0 || Object.keys(req.body).length > 0)) {
      return res.status(404).json({ status: 'failed', message: `Gagal mengambil data! Query tidak sesuai.` });
    }
    if (isCommandShouldExec) {
      if (title || category || author) {
        if (Object.keys(req.query).length > 1 || Object.keys(req.body).length > 1) {
          // const isDocumentHasInDatabase = await ArticlesModel.aggregate([
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
          //   return res.status(404).json({ status: 'success', message: `Tidak ada data artikel tersebut.` });
          // }
          // return res.status(200).json({ status: 'success', message: `Berhasil mengambil data artikel.`, data: isDocumentHasInDatabase });
          return res.status(404).json({ status: 'failed', message: `Gagal mengambil data! Query tidak sesuai.` });
        }
        let toFilter = title ? { title: title.toLowerCase() } : false;
        toFilter = category ? { category: category.toLowerCase() } : toFilter;
        toFilter = author ? { author: author.toLowerCase() } : toFilter;
        const isDocumentHasInDatabase = await ArticlesModel.aggregate([
          {
            $project: {
              _id: 1,
              title: 1,
              category: 1,
              author: 1,
            },
          },
          {
            $match: toFilter,
          },
        ]);
        if (isDocumentHasInDatabase.length < 1) {
          return res.status(404).json({ status: 'success', message: `Tidak ada data artikel tersebut.` });
        }
        return res.status(200).json({ status: 'success', message: `Berhasil mengambil data artikel.`, data: isDocumentHasInDatabase });
      }
      return res.status(404).json({ status: 'failed', message: `Tidak ada data artikel tersebut.` });
    }
    const isDocumentHasInDatabase = await ArticlesModel.aggregate([
      {
        $project: {
          _id: 1,
          title: 1,
          category: 1,
          author: 1,
        },
      },
    ]);
    if (isDocumentHasInDatabase.length > 0) {
      return res.status(200).json({ status: 'success', message: `Berhasil mengambil data artikel.`, data: isDocumentHasInDatabase });
    }
    return res.status(404).json({ status: 'success', message: `Tidak ada data artikel.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal mengambil data artikel. Function Catch: ${err}` });
  }
};

const GetDetailArticles = async (req, res) => {
  try {
    const { id } = req.params;
    const isDocumentHasInDatabase = await ArticlesModel.findById(id);
    if (isDocumentHasInDatabase) {
      return res.status(200).json({ status: 'success', message: `Berhasil mengambil data artikel.`, data: isDocumentHasInDatabase });
    }
    return res.status(404).json({ status: 'success', message: `Tidak ada data artikel.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal mengambil data artikel. Function Catch: ${err}` });
  }
};

const UpdateArticlesData = async (req, res) => {
  try {
    const { id } = req.params;
    const isDocumentHasInDatabase = await ArticlesModel.findById(id);
    if (!isDocumentHasInDatabase) {
      return res.status(404).json({ status: 'success', message: `Tidak ada data artikel.` });
    }
    const { username, password, email, full_name, contact_number, address, role } = req.body;
    const FormatInputArticle = {
      username: 'String',
      password: 'Combine (String/Number/Symbol)',
      email: 'String',
      full_name: { first_name: 'String', last_name: 'String' },
    };
    if (!username || !password || !email || !full_name) {
      return res.status(404).json({ status: 'failed', message: `Format tidak sesuai!`, format: FormatInputArticle });
    }
    let isDocumentsWasDupplicate = await ArticlesModel.aggregate([
      {
        $match: { username: username },
      },
    ]);
    if (isDocumentsWasDupplicate.length > 0) {
      return res.status(404).json({ status: 'success', message: `username atau email sudah terdaftar!` });
    }
    isDocumentsWasDupplicate = await ArticlesModel.aggregate([
      {
        $match: { email: email },
      },
    ]);
    if (isDocumentsWasDupplicate.length > 0) {
      return res.status(404).json({ status: 'success', message: `username atau email sudah terdaftar!` });
    }
    const { first_name, last_name } = full_name;
    const isUsernameNotEmptyValue = username == '' || username == ' ';
    const isPasswordNotEmptyValue = password == '' || password == ' ';
    const isEmailNotEmptyValue = email == '' || email == ' ';
    const isFullNameNotEmptyValue = first_name == '' || first_name == ' ' || last_name == '' || last_name == ' ';
    const isContactNumberNotEmptyValue = contact_number == '' || contact_number == ' ';
    const isAddressNotEmptyValue = address == '' || address == ' ';
    const isRoleNotEmptyValue = role == '' || role == ' ';
    if (isUsernameNotEmptyValue || isPasswordNotEmptyValue || isEmailNotEmptyValue || isFullNameNotEmptyValue) {
      return res
        .status(404)
        .json({ status: 'failed', message: `Format tidak sesuai atau input value kosong!`, format: FormatInputArticle });
    }
    const updateUser = {
      username: username.toLowerCase(),
      password,
      email: email.toLowerCase(),
      full_name,
      contact_number: isContactNumberNotEmptyValue ? null : contact_number,
      address: isAddressNotEmptyValue ? null : address,
      role: isRoleNotEmptyValue ? null : role,
    };
    return await ArticlesModel.findByIdAndUpdate(id, updateUser)
      .then((result) => res.status(200).json({ status: 'success', message: `Berhasil memperbaharui data artikel.` }))
      .catch((err) => res.status(500).json({ status: 'failed', message: `Gagal memperbaharui data artikel. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal memperbaharui data artikel. Function Catch: ${err}` });
  }
};

const DeleteAriclesData = async (req, res) => {
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
  CreateDataArticles,
  GetArticlesData,
  GetDetailArticles,
  UpdateArticlesData,
  DeleteAriclesData,
};
