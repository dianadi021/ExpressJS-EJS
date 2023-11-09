/** @format */

const { RolesUsersModel, FormatInputRolesUsers } = require('../models/rolesusers.model');
const { CheckingKeyReq, CheckingKeyReqSyntax, CheckingIsNilValue } = require('../utils/utils');

const CreateRolesUsersData = async (req, res) => {
  try {
    const { rolename, rolelevel } = req.body ? req.body : JSON.parse(req.body.data);
    if (!rolename || !rolelevel) {
      return res.status(404).json({ status: 'failed', message: `Format tidak sesuai!`, format: FormatInputRolesUsers });
    }
    const isRoleNameEmptyValue = CheckingIsNilValue(rolename);
    const isRoleLevelEmptyValue = CheckingIsNilValue(rolelevel);
    if (isRoleNameEmptyValue || isRoleLevelEmptyValue) {
      return res
        .status(404)
        .json({ status: 'failed', message: `Format tidak sesuai atau input value kosong!`, format: FormatInputRolesUsers });
    }
    const isRoleNameWasUsed = await RolesUsersModel.find({ rolename: rolename.toLowerCase() });
    const isRoleLevelWasUsed = await RolesUsersModel.find({ rolelevel: rolelevel.toLowerCase() });
    if (isRoleNameWasUsed.length >= 1 || isRoleLevelWasUsed.length >= 1) {
      return res
        .status(403)
        .json({ status: 'failed', message: `Nama Role atau Level Role sudah tersedia! harap untuk menggunakan yang lain.` });
    }
    const newRole = RolesUsersModel({ rolename: rolename.toLowerCase(), rolelevel: rolelevel.toLowerCase() });
    return await newRole
      .save()
      .then((result) => res.status(201).json({ status: 'success', message: `Berhasil membuat role.` }))
      .catch((err) => res.status(500).json({ status: 'failed', message: `Gagal membuat role. Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal membuat role. Function Catch: ${err}` });
  }
};

const GetRoleData = async (req, res) => {
  try {
    const syntaxExec = ['rolename', 'rolelevel', 'document', 'page'];
    const { rolename, rolelevel, page, document } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);
    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length >= 1) {
      return res.status(404).json({ status: 'failed', message: `Gagal mengambil data! Query tidak sesuai.` });
    }
    if (isHasSyntax && (rolename || rolelevel)) {
      let toFilter = rolename ? { rolename: rolename.toLowerCase() } : false;
      toFilter = rolelevel ? { rolelevel: rolelevel.toLowerCase() } : toFilter;
      const isDocumentHasInDatabase = await RolesUsersModel.aggregate([
        { $project: { _id: 1, rolename: 1, rolelevel: 1 } },
        { $match: toFilter },
      ]);
      if (isDocumentHasInDatabase.length < 1) {
        return res.status(404).json({ status: 'success', message: `Tidak ada data role tersebut.` });
      }
      return res.status(200).json({ status: 'success', message: `Berhasil mengambil data role.`, data: isDocumentHasInDatabase });
    }

    // START PAGINATION ($SKIP & $LIMIT)
    const isDocumentHasInDatabase =
      !page && !document
        ? await RolesUsersModel.aggregate([{ $project: { _id: 1, rolename: 1, rolelevel: 1 } }])
        : await RolesUsersModel.aggregate([
            { $project: { _id: 1, rolename: 1, rolelevel: 1 } },
            { $skip: (parseInt(page) - 1) * parseInt(document) },
            { $limit: parseInt(document) },
          ]);
    // END PAGINATION ($SKIP & $LIMIT)
    if (isDocumentHasInDatabase.length > 0) {
      return res.status(200).json({ status: 'success', message: `Berhasil mengambil data role.`, data: isDocumentHasInDatabase });
    }
    return res.status(404).json({ status: 'success', message: `Tidak ada data role.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal mengambil data role. Function Catch: ${err}` });
  }
};

const GetRoleDetails = async (req, res) => {
  try {
    let { id } = req.params;
    const isDocumentHasInDatabase = await RolesUsersModel.findById(id);
    if (isDocumentHasInDatabase) {
      return res.status(200).json({ status: 'success', message: `Berhasil mengambil data role.`, data: isDocumentHasInDatabase });
    }
    return res.status(404).json({ status: 'success', message: `Tidak ada data role.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal mengambil data role. Function Catch: ${err}` });
  }
};

const UpdateRoleData = async (req, res) => {
  try {
    const { id } = req.params;
    const isDocumentHasInDatabase = await RolesUsersModel.findById(id);
    if (!isDocumentHasInDatabase) {
      return res.status(404).json({ status: 'success', message: `Tidak ada data role.` });
    }
    const { rolename, rolelevel } = CheckingKeyReq(req.body, req.query, req.body.data);
    if (!rolename || !rolelevel) {
      return res.status(404).json({ status: 'failed', message: `Format tidak sesuai!`, format: FormatInputRolesUsers });
    }
    const isRoleNameWasUsed = await RolesUsersModel.find({ rolename: rolename.toLowerCase() });
    const isRoleLevelWasUsed = await RolesUsersModel.find({ rolelevel: rolelevel.toLowerCase() });
    const isRoleNameIDReady = isRoleNameWasUsed.length >= 1 ? isRoleNameWasUsed[0]._id : id;
    const isRoleLevelIDReady = isRoleLevelWasUsed.length >= 1 ? isRoleLevelWasUsed[0]._id : id;
    if (isRoleNameIDReady != id || isRoleLevelIDReady != id) {
      return res
        .status(403)
        .json({ status: 'failed', message: `Nama Role atau Level Role sudah tersedia! harap untuk menggunakan yang lain.` });
    }
    const isRoleNameEmptyValue = CheckingIsNilValue(rolename);
    const isRoleLevelEmptyValue = CheckingIsNilValue(rolelevel);
    if (isRoleNameEmptyValue || isRoleLevelEmptyValue) {
      return res
        .status(404)
        .json({ status: 'failed', message: `Format tidak sesuai atau input value kosong!`, format: FormatInputRolesUsers });
    }
    const updateRole = RolesUsersModel({ rolename: rolename.toLowerCase(), rolelevel: rolelevel.toLowerCase() });
    return await RolesUsersModel.findByIdAndUpdate(id, updateRole)
      .then((result) => res.status(200).json({ status: 'success', message: `Berhasil memperbaharui data role.` }))
      .catch((err) => res.status(500).json({ status: 'failed', message: `Gagal memperbaharui data role. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal memperbaharui data role. Function Catch: ${err}` });
  }
};

const DeleteRoleData = async (req, res) => {
  try {
    const { id } = req.params;
    const isDocumentHasInDatabase = await RolesUsersModel.findById(id);
    if (!isDocumentHasInDatabase) {
      return res.status(404).json({ status: 'success', message: `Tidak ada data role.` });
    }
    return await RolesUsersModel.findByIdAndRemove(id)
      .then((result) => res.status(200).json({ status: 'success', message: `Berhasil menghapus data role.` }))
      .catch((err) => res.status(500).json({ status: 'failed', message: `Gagal menghapus data role. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', message: `Gagal menghapus data role. Function Catch: ${err}` });
  }
};

module.exports = {
  CreateRolesUsersData,
  GetRoleData,
  GetRoleDetails,
  UpdateRoleData,
  DeleteRoleData,
};
