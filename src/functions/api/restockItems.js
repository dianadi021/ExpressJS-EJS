/** @format */

import { FormatRestockItem, RestockItemModel, mongoose } from '../../models/restockItems.js';
import { CheckingIsNilValue, CheckingKeyReq, CheckingKeyReqSyntax, CheckingObjectValue, GetUniqFilteredCode } from '../../utils/utils.js';
import { UpdateSellingItemByID } from './sellingItems.js';
import { DeleteTotalStockByID, UpdateTotalStockByID } from './totalStockItems.js';

export const CreateItem = async (req, res) => {
  try {
    const { unitOfMeasurement, _idItemName, itemQuantity } = CheckingKeyReq(req.body, req.query, req.body.data);
    const { itemModalPerPcs, barCode, description, itemSellPerPcs, isSelling } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyItemName = CheckingIsNilValue(_idItemName);
    const isEmptySelling = CheckingIsNilValue(isSelling);

    if (!_idItemName || isEmptyItemName || isEmptySelling) {
      return ReturnEJSViews(req, res, 'home', 400, false, `Format tidak sesuai atau input value kosong!`, FormatRestockItem);
    }

    const uniqFilter = await GetUniqFilteredCode(RestockItemModel, 12);

    const newItem = RestockItemModel({
      unitOfMeasurement,
      _idItemName,
      itemQuantity,
      itemModalPerPcs,
      barCode,
      description,
      itemSellPerPcs,
      uniqFilter,
    });

    await newItem.save().catch((err) => {
      return ReturnEJSViews(req, res, 'home', 500, false, `Gagal menyimpan data Produk. Function Catch: ${err}`);
    });

    const isUniqCodeUsed = await RestockItemModel.aggregate([{ $match: { uniqFilter: uniqFilter } }]);
    const { _id } = !isUniqCodeUsed.length ? null : isUniqCodeUsed[0];

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const [isSuccessSaved, msg] = await UpdateTotalStockByID(req, res, _id).then((result) => result);
        if (!isSuccessSaved) {
          reject(ReturnEJSViews(req, res, 'home', 500, false, `Gagal menyimpan data Produk. Function Catch: ${err}`));
        }
        console.log(`201 Success created Items`);
        resolve(ReturnEJSViews(req, res, 'home', 201, true, `Berhasil menyimpan data Produk.`));
      }, 3000);
    });
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal menyimpan data Produk. Function Catch: ${err}`);
  }
};

export const GetItems = async (req, res) => {
  try {
    const syntaxExec = ['itemName', 'itemCategories', 'itemProduk', '_idItemName', 'page', 'document'];
    const { itemName, _idItemName, itemCategories, itemProduk, page, document } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);

    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length) {
      return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data! Query filter tidak sesuai.`);
    }

    if (isHasSyntax && (itemName || itemCategories || itemProduk || _idItemName)) {
      let toFilter = itemName ? { itemName: itemName.toLowerCase() } : false;
      toFilter = itemCategories ? { itemCategories: itemCategories } : toFilter;
      toFilter = _idItemName ? { _idItemName: mongoose.Types.ObjectId(_idItemName) } : toFilter;
      toFilter = itemProduk ? { itemProduk: itemProduk } : toFilter;

      const documentsInDB = await RestockItemModel.aggregate([
        { $project: { _id: 1, itemName: 1, itemCategories: 1, itemProduk: 1 } },
        {
          $lookup: {
            from: 'categories',
            localField: 'itemCategories',
            foreignField: '_id',
            as: 'itemCategories',
          },
        },
        {
          $lookup: {
            from: 'Produks',
            localField: 'itemProduk',
            foreignField: '_id',
            as: 'itemProduk',
          },
        },
        { $match: toFilter },
      ]);

      if (documentsInDB.length) {
        return ReturnEJSViews(req, res, 'home', 201, true, `Berhasil mengambil data Produk.`, documentsInDB);
      }
    }

    if (page && document) {
      const documentsInDB = await RestockItemModel.aggregate([
        { $project: { _id: 1, itemName: 1, itemCategories: 1, itemProduk: 1 } },
        { $skip: (parseInt(page) - 1) * parseInt(document) },
        { $limit: parseInt(document) },
      ]);

      return documentsInDB;
    }

    const documentsInDB = await RestockItemModel.aggregate([
      { $project: { _id: 1, itemName: 1, itemCategories: 1, itemProduk: 1 } },
      {
        $lookup: {
          from: 'categories',
          localField: 'itemCategories',
          foreignField: '_id',
          as: 'itemCategories',
        },
      },
      {
        $lookup: {
          from: 'Produks',
          localField: 'itemProduk',
          foreignField: '_id',
          as: 'itemProduk',
        },
      },
    ]);

    if (documentsInDB.length) {
      return ReturnEJSViews(req, res, 'home', 201, true, `Berhasil mengambil data Produk.`, documentsInDB);
    }

    return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Produk.`);
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Produk. Function Catch: ${err}`);
  }
};

export const GetItemByID = async (req, res) => {
  try {
    const { id } = req.params;

    let documentsInDB = await RestockItemModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'totalstockitems',
          localField: '_idItemName',
          foreignField: '_id',
          as: '_idItemName',
        },
      },
    ]);

    documentsInDB = !documentsInDB ? await RestockItemModel.findById(id) : documentsInDB;

    if (!documentsInDB || !documentsInDB.length) {
      return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Produk.`);
    }

    return ReturnEJSViews(req, res, 'home', 201, true, `Berhasil mengambil data Produk.`, documentsInDB);
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Produk. Function Catch: ${err}`);
  }
};

export const UpdateItemByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await RestockItemModel.findById(id);

    if (!documentsInDB) {
      return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Produk.`);
    }

    const { unitOfMeasurement, _idItemName, itemQuantity, itemModalPerPcs } = CheckingKeyReq(req.body, req.query, req.body.data);
    const { barCode, description, itemSellPerPcs, totalSellStock, isSelling } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyItemName = CheckingIsNilValue(_idItemName);
    const isEmptySelling = CheckingIsNilValue(isSelling);

    if (!_idItemName || isEmptyItemName || isEmptySelling) {
      return ReturnEJSViews(req, res, 'home', 400, false, `Format tidak sesuai atau input value kosong!`, FormatRestockItem);
    }

    let updateItem = {};

    updateItem = CheckingObjectValue(updateItem, { _idItemName });
    updateItem = CheckingObjectValue(updateItem, { unitOfMeasurement });
    updateItem = !isSelling
      ? CheckingObjectValue(updateItem, { itemQuantity })
      : CheckingObjectValue(updateItem, { itemQuantity: -totalSellStock });
    updateItem = CheckingObjectValue(updateItem, { itemModalPerPcs });
    updateItem = CheckingObjectValue(updateItem, { barCode });
    updateItem = CheckingObjectValue(updateItem, { description });
    updateItem = CheckingObjectValue(updateItem, { itemSellPerPcs });

    await UpdateTotalStockByID(req, res).catch((err) => {
      const [_, msg] = err;
      return ReturnEJSViews(req, res, 'home', 500, false, `Gagal menyimpan data Produk! Function Catch: ${msg}`);
    });

    const [isSuccessSaved, msg] = await UpdateSellingItemByID(req, res).then((result) => result);

    if (!isSuccessSaved) {
      return ReturnEJSViews(req, res, 'home', 500, true, `Gagal memperbaharui data Produk. Function Catch: ${err}`);
    }

    return await RestockItemModel.findByIdAndUpdate(id, updateItem)
      .then((result) => {
        console.log(`201 Success updated Brands`);
        ReturnEJSViews(req, res, 'home', 201, true, `Berhasil memperbaharui data Produk.`);
      })
      .catch((err) => ReturnEJSViews(req, res, 'home', 500, true, `Gagal memperbaharui data Produk. Function Catch: ${err}`));
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Produk. Function Catch: ${err}`);
  }
};

export const DeleteItemByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await RestockItemModel.findById(id);

    if (!documentsInDB) {
      return ReturnEJSViews(req, res, 'home', 201, true, `Tidak ada data Produk.`);
    }

    const [isSuccessSaved, msg] = await DeleteTotalStockByID(req, res, id).then((result) => result);

    if (!isSuccessSaved) {
      return ReturnEJSViews(req, res, 'home', 500, true, `Gagal memperbaharui data Produk. Function Catch: ${err}`);
    }

    return await RestockItemModel.findByIdAndRemove(id)
      .then((result) => {
        console.log(`201 Success deleted Items`);
        ReturnEJSViews(req, res, 'home', 201, true, `Berhasil menghapus data Produk.`);
      })
      .catch((err) => ReturnEJSViews(req, res, 'home', 500, false, `Gagal menghapus data Produk. Function Catch: ${err}`));
  } catch (err) {
    return ReturnEJSViews(req, res, 'home', 500, false, `Gagal mengambil data Produk. Function Catch: ${err}`);
  }
};
