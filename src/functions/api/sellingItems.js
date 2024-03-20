/** @format */

import { FormatSellingItem, ProdukModel, SellingItemModel, mongoose } from '../../models/sellingItems.js';
import { CheckingIsNilValue, CheckingKeyReq } from '../../utils/utils.js';

export const CreateSellingItem = async (req, res) => {
  try {
    const { _idItemName, totalSellStock, description, isSelling } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyIDItem = CheckingIsNilValue(_idItemName);
    const isEmptySelling = CheckingIsNilValue(isSelling);

    if (!_idItemName || isEmptyIDItem || isEmptySelling) {
      return ReturnEJSViews(req, res, 'home', 400, false, `Format tidak sesuai atau input value kosong!`, FormatSellingItem);
    }

    const documentsInDB = await ProdukModel.findById(_idItemName);

    if (!documentsInDB || !documentsInDB.length) {
      return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Produk.`);
    }

    const { uniqFilter, itemSellPerPcs } = !documentsInDB.length ? documentsInDB : documentsInDB[0];

    const newSellStock = SellingItemModel({ _idItemName, totalSellStock, description, itemSellPerPcs, uniqFilter });

    await newSellStock.save().catch((err) => {
      return ReturnEJSViews(req, res, 'home', 500, false, `Gagal menyimpan data Produk. Function Catch: ${err}`);
    });

    const isUniqCodeUsed = await SellingItemModel.aggregate([{ $match: { uniqFilter: uniqFilter } }]);
    const { _id } = !isUniqCodeUsed.length ? null : isUniqCodeUsed[0];

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const [isSuccessSaved, msg] = await UpdateTotalStockByID(req, res, _id).then((result) => result);
        if (!isSuccessSaved) {
          reject(ReturnEJSViews(req, res, 'home', 500, false, `Gagal menyimpan data Produk. Function Catch: ${err}`));
        }
        console.log(`201 Success created Items`);
        resolve(ReturnEJSViews(req, res, 'home', 201, false, `Berhasil menyimpan data Produk.`));
      }, 3000);
    });
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal menyimpan data Produk. Function Catch: ${err}`);
  }
};

export const GetSellingItems = async (req, res) => {
  try {
    const syntaxExec = ['_idItemName', 'page', 'document'];
    const { _idItemName, page, document } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);

    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length) {
      return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data! Query filter tidak sesuai.`);
    }

    if (isHasSyntax && _idItemName) {
      let toFilter = itemName ? { itemName: itemName.toLowerCase() } : false;
      toFilter = _idItemName ? { _idItemName: mongoose.Types.ObjectId(_idItemName) } : toFilter;

      const documentsInDB = await SellingItemModel.aggregate([
        { $project: { _id: 1, itemName: 1, itemCategories: 1, itemProduk: 1 } },
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
        return ReturnEJSViews(req, res, 'home', 201, true, `Berhasil mengambil data Produk.`, documentsInDB);
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
      return ReturnEJSViews(req, res, 'home', 201, true, `Berhasil mengambil data Produk.`, documentsInDB);
    }

    return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Produk.`);
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Produk. Function Catch: ${err}`);
  }
};

export const GetSellingItemByID = async (req, res) => {
  try {
    const { id } = req.params;

    let documentsInDB = await SellingItemModel.aggregate([{ $match: { _id: mongoose.Types.ObjectId(id) } }]);

    documentsInDB = !documentsInDB ? await SellingItemModel.findById(id) : documentsInDB;

    if (!documentsInDB || !documentsInDB.length) {
      return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Produk.`);
    }

    return ReturnEJSViews(req, res, 'home', 201, true, `Berhasil mengambil data Produk.`, documentsInDB);
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Produk. Function Catch: ${err}`);
  }
};

export const UpdateSellingItemByID = async (req, res) => {
  try {
    const { _idItemName, totalSellStock, description, itemSellPerPcs, isSelling } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyIDItem = CheckingIsNilValue(_idItemName);
    const isEmptySelling = CheckingIsNilValue(isSelling);

    if (!_idItemName || isEmptyIDItem || isEmptySelling) {
      return ReturnEJSViews(req, res, 'home', 400, false, `Format tidak sesuai atau input value kosong!`, FormatSellingItem);
    }

    const documentsInDB = await ProdukModel.findById(_idItemName);

    if (!documentsInDB || !documentsInDB.length) {
      return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Produk.`);
    }

    let updateItem = {};

    updateItem = CheckingObjectValue(updateItem, { _idItemName });
    updateItem = CheckingObjectValue(updateItem, { totalSellStock });
    updateItem = CheckingObjectValue(updateItem, { description });
    updateItem = CheckingObjectValue(updateItem, { itemSellPerPcs });

    const [isSuccessSaved, msg] = await UpdateTotalStockByID(req, res).then((result) => result);

    if (!isSuccessSaved) {
      return ReturnEJSViews(req, res, 'home', 500, true, `Gagal memperbaharui data Produk. Function Catch: ${msg}`);
    }

    return await SellingItemModel.findByIdAndUpdate(id, updateItem)
      .then((result) => {
        console.log(`201 Success updated Items`);
        ReturnEJSViews(req, res, 'home', 201, true, `Berhasil memperbaharui Produk. ${msg}`);
      })
      .catch((err) => ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Produk. Function Catch: ${err}`));
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Produk. Function Catch: ${err}`);
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
      return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Produk.`);
    }

    return await SellingItemModel.findByIdAndRemove(id)
      .then((result) => {
        console.log(`201 Success deleted Items`);
        ReturnEJSViews(req, res, 'home', 201, true, `Berhasil menghapus data Produk.`);
      })
      .catch((err) => ReturnEJSViews(req, res, 'home', 500, false, `Gagal menghapus data Produk. Function Catch: ${err}`));
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Produk. Function Catch: ${err}`);
  }
};
