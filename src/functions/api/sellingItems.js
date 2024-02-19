/** @format */

import { FormatSellingItem, ProdukModel, SellingItemModel, mongoose } from '../../models/sellingItems.js';
import { CheckingIsNilValue, CheckingKeyReq } from '../../utils/utils.js';

export const CreateSellingItem = async (req, res) => {
  try {
    const { _idItemName, totalSellStock, description, isSelling } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyIDItem = CheckingIsNilValue(_idItemName);
    const isEmptySelling = CheckingIsNilValue(isSelling);

    if (!_idItemName || isEmptyIDItem || isEmptySelling) {
      res.status(404).json({ status: 'failed', messages: `Format tidak sesuai atau input value kosong!`, format: FormatSellingItem });
      return;
    }

    const documentsInDB = await ProdukModel.findById(_idItemName);

    if (!documentsInDB || !documentsInDB.length) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    const { uniqFilter, itemSellPerPcs } = !documentsInDB.length ? documentsInDB : documentsInDB[0];

    const newSellStock = SellingItemModel({ _idItemName, totalSellStock, description, itemSellPerPcs, uniqFilter });

    await newSellStock.save().catch((err) => {
      return res.status(500).json({ status: 'failed', messages: `Gagal menyimpan data Produk! Function Catch: ${err}` });
    });

    const isUniqCodeUsed = await SellingItemModel.aggregate([{ $match: { uniqFilter: uniqFilter } }]);
    const { _id } = !isUniqCodeUsed.length ? null : isUniqCodeUsed[0];

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const [isSuccessSaved, msg] = await UpdateTotalStockByID(req, res, _id).then((result) => result);
        if (!isSuccessSaved) {
          reject(res.status(500).json({ status: 'failed', messages: `Gagal menyimpan data Produk! Function Catch: ${msg}` }));
        }
        resolve(res.status(201).json({ status: 'success', messages: `Berhasil menyimpan data Produk. ${msg}` }));
      }, 3000);
    });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};

export const GetSellingItems = async (req, res) => {
  try {
    const syntaxExec = ['_idItemName', 'page', 'document'];
    const { _idItemName, page, document } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);

    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length) {
      return res.status(404).json({ status: 'failed', messages: `Gagal mengambil data! Query tidak sesuai.` });
    }

    if (isHasSyntax && _idItemName) {
      let toFilter = itemName ? { itemName: itemName.toLowerCase() } : false;
      toFilter = _idItemName ? { _idItemName: mongoose.Types.ObjectId(_idItemName) } : toFilter;

      const documentsInDB = await SellingItemModel.aggregate([
        { $project: { _id: 1, itemName: 1, itemCategories: 1, itemBrand: 1 } },
        {
          $lookup: {
            from: 'restockitems',
            localField: '_idItemName',
            foreignField: '_id',
            as: '_idItemName',
          },
        },
        { $match: toFilter },
      ]);

      if (documentsInDB.length) {
        return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
      }
    }

    if (page && document) {
      const documentsInDB = await SellingItemModel.aggregate([
        { $project: { _id: 1, _idItemName: 1, totalSellStock: 1 } },
        { $skip: (parseInt(page) - 1) * parseInt(document) },
        { $limit: parseInt(document) },
      ]);

      return documentsInDB;
    }

    const documentsInDB = await SellingItemModel.aggregate([{ $project: { _id: 1, _idItemName: 1, totalSellStock: 1 } }]);

    if (documentsInDB.length) {
      return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
    }

    return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};

export const GetSellingItemByID = async (req, res) => {
  try {
    const { id } = req.params;

    let documentsInDB = await SellingItemModel.aggregate([{ $match: { _id: mongoose.Types.ObjectId(id) } }]);

    documentsInDB = !documentsInDB ? await SellingItemModel.findById(id) : documentsInDB;

    if (!documentsInDB || !documentsInDB.length) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};

export const UpdateSellingItemByID = async (req, res) => {
  try {
    const { _idItemName, totalSellStock, description, itemSellPerPcs, isSelling } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyIDItem = CheckingIsNilValue(_idItemName);
    const isEmptySelling = CheckingIsNilValue(isSelling);

    if (!_idItemName || isEmptyIDItem || isEmptySelling) {
      res.status(404).json({ status: 'failed', messages: `Format tidak sesuai atau input value kosong!`, format: FormatSellingItem });
      return;
    }

    const documentsInDB = await ProdukModel.findById(_idItemName);

    if (!documentsInDB || !documentsInDB.length) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    let updateItem = {};

    updateItem = CheckingObjectValue(updateItem, { _idItemName });
    updateItem = CheckingObjectValue(updateItem, { totalSellStock });
    updateItem = CheckingObjectValue(updateItem, { description });
    updateItem = CheckingObjectValue(updateItem, { itemSellPerPcs });

    const [isSuccessSaved, msg] = await UpdateTotalStockByID(req, res).then((result) => result);

    if (!isSuccessSaved) {
      return res.status(500).json({ status: 'failed', messages: `Gagal memperbaharui produk Catch: ${msg}` });
    }

    return await SellingItemModel.findByIdAndUpdate(id, updateItem)
      .then((result) => res.status(201).json({ status: 'success', messages: `Berhasil memperbaharui Produk. ${msg}` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal memperbaharui produk Catch: ${msg}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};

export const DeleteSellingItemByID = async (req, res, idListItems) => {
  try {
    const { id } = req.params;
    const documentsInDB = await SellingItemModel.findById(id);

    if (!documentsInDB) {
      if (idListItems) {
        return await SellingItemModel.findOneAndRemove({ _idItemName: mongoose.Types.ObjectId(idListItems) })
          .then((result) => [true, 'Berhasil menghapus data Produk'])
          .catch((err) => [false, err]);
      }
      return res.status(404).json({ status: 'success', messages: `Tidak ada data Produk.` });
    }

    return await SellingItemModel.findByIdAndRemove(id)
      .then((result) => res.status(200).json({ status: 'success', messages: `Berhasil menghapus data Produk.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal menghapus data Produk. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Fail. Function Catch: ${err}` });
  }
};
