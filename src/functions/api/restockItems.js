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
      res.status(404).json({ status: 'failed', messages: `Format tidak sesuai atau input value kosong!`, format: FormatRestockItem });
      return;
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
      return res.status(500).json({ status: 'failed', messages: `Gagal menyimpan data Produk! Function Catch: ${err}` });
    });

    const isUniqCodeUsed = await RestockItemModel.aggregate([{ $match: { uniqFilter: uniqFilter } }]);
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
    return res.status(500).json({ status: 'failed', messages: `Gagal menyimpan Produk. Function Catch: ${err}` });
  }
};

export const GetItems = async (req, res) => {
  try {
    const syntaxExec = ['itemName', 'itemCategories', 'itemBrand', '_idItemName', 'page', 'document'];
    const { itemName, _idItemName, itemCategories, itemBrand, page, document } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isHasSyntax = CheckingKeyReqSyntax(syntaxExec, req.body, req.query, req.body.data);

    if (!isHasSyntax && Object.keys(CheckingKeyReq(req.body, req.query, req.body.data)).length) {
      return res.status(404).json({ status: 'failed', messages: `Gagal mengambil data! Query tidak sesuai.` });
    }

    if (isHasSyntax && (itemName || itemCategories || itemBrand || _idItemName)) {
      let toFilter = itemName ? { itemName: itemName.toLowerCase() } : false;
      toFilter = itemCategories ? { itemCategories: itemCategories } : toFilter;
      toFilter = _idItemName ? { _idItemName: mongoose.Types.ObjectId(_idItemName) } : toFilter;
      toFilter = itemBrand ? { itemBrand: itemBrand } : toFilter;

      const documentsInDB = await RestockItemModel.aggregate([
        { $project: { _id: 1, itemName: 1, itemCategories: 1, itemBrand: 1 } },
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
            from: 'brands',
            localField: 'itemBrand',
            foreignField: '_id',
            as: 'itemBrand',
          },
        },
        { $match: toFilter },
      ]);

      if (documentsInDB.length) {
        return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
      }
    }

    if (page && document) {
      const documentsInDB = await RestockItemModel.aggregate([
        { $project: { _id: 1, itemName: 1, itemCategories: 1, itemBrand: 1 } },
        { $skip: (parseInt(page) - 1) * parseInt(document) },
        { $limit: parseInt(document) },
      ]);

      return documentsInDB;
    }

    const documentsInDB = await RestockItemModel.aggregate([
      { $project: { _id: 1, itemName: 1, itemCategories: 1, itemBrand: 1 } },
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
          from: 'brands',
          localField: 'itemBrand',
          foreignField: '_id',
          as: 'itemBrand',
        },
      },
    ]);

    if (documentsInDB.length) {
      return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
    }

    return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil Produk. Function Catch: ${err}` });
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
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    return res.status(200).json({ status: 'success', messages: `Berhasil mengambil data.`, data: documentsInDB });
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil Produk. Function Catch: ${err}` });
  }
};

export const UpdateItemByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await RestockItemModel.findById(id);

    if (!documentsInDB) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }

    const { unitOfMeasurement, _idItemName, itemQuantity, itemModalPerPcs } = CheckingKeyReq(req.body, req.query, req.body.data);
    const { barCode, description, itemSellPerPcs, totalSellStock, isSelling } = CheckingKeyReq(req.body, req.query, req.body.data);
    const isEmptyItemName = CheckingIsNilValue(_idItemName);
    const isEmptySelling = CheckingIsNilValue(isSelling);

    if (!_idItemName || isEmptyItemName || isEmptySelling) {
      res.status(404).json({ status: 'failed', messages: `Format tidak sesuai atau input value kosong!`, format: FormatRestockItem });
      return;
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
      return res.status(500).json({ status: 'failed', messages: `Gagal menyimpan data Produk! Function Catch: ${msg}` });
    });

    const [isSuccessSaved, msg] = await UpdateSellingItemByID(req, res).then((result) => result);

    if (!isSuccessSaved) {
      return res.status(500).json({ status: 'failed', messages: `Gagal memperbaharui produk Catch: ${msg}` });
    }

    return await RestockItemModel.findByIdAndUpdate(id, updateItem)
      .then((result) => res.status(201).json({ status: 'success', messages: `Berhasil memperbaharui Produk. ${msg}` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal memperbaharui produk Catch: ${msg}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil Produk. Function Catch: ${err}` });
  }
};

export const DeleteItemByID = async (req, res) => {
  try {
    const { id } = req.params;
    const documentsInDB = await RestockItemModel.findById(id);

    if (!documentsInDB) {
      return res.status(404).json({ status: 'success', messages: `Tidak ada data.` });
    }


    const [isSuccessSaved, msg] = await DeleteTotalStockByID(req, res, id).then((result) => result);

    if (!isSuccessSaved) {
      return res.status(500).json({ status: 'failed', messages: `Gagal memperbaharui produk Catch: ${msg}` });
    }

    return await RestockItemModel.findByIdAndRemove(id)
      .then((result) => res.status(200).json({ status: 'success', messages: `Berhasil menghapus data.` }))
      .catch((err) => res.status(500).json({ status: 'failed', messages: `Gagal menghapus data. Function Catch: ${err}` }));
  } catch (err) {
    return res.status(500).json({ status: 'failed', messages: `Gagal mengambil Produk. Function Catch: ${err}` });
  }
};
