/** @format */
export const CheckingIsNilValue = (key) => {
  if (typeof key === 'bool' || typeof key === 'boolean') {
    return (key = key ? false : key);
  }

  if (key == '' || key == ' ') {
    return true;
  }

  if (typeof key === 'undefined' || key == null) {
    return true;
  }

  return false;
};

export const CheckingKeyReq = (Req1, Req2, Req3) => {
  let RequestSyntax = Object.keys(Req1).length >= 1 ? Req1 : false;
  RequestSyntax = !RequestSyntax ? Req2 : RequestSyntax;
  RequestSyntax = !RequestSyntax ? JSON.parse(Req3) : RequestSyntax;
  return RequestSyntax;
};

export const CheckingKeyReqSyntax = (ValidSyntax, Req1, Req2, Req3) => {
  let RequestSyntax = Object.keys(Req1).length > 0 ? Req1 : false;
  RequestSyntax = !RequestSyntax ? Req2 : RequestSyntax;
  RequestSyntax = !RequestSyntax ? JSON.parse(Req3) : RequestSyntax;

  let flag = false;
  if (Object.keys(RequestSyntax).length > 0) {
    for (const key in RequestSyntax) {
      if (ValidSyntax.includes(key)) {
        flag = ValidSyntax.includes(key);
        break;
      }
    }
  }
  return flag;
};

export const CheckingObjectValue = (ParentObject, AddKeyObject) => {
  if (AddKeyObject[Object.keys(AddKeyObject)]) {
    ParentObject[Object.keys(AddKeyObject)] = AddKeyObject[Object.keys(AddKeyObject)] ? AddKeyObject[Object.keys(AddKeyObject)] : null;
  }
  return ParentObject;
};

export const GetFilteredDocumentByCategories = async (Model, MatchQueries) => {
  let result = await Model.aggregate([
    {
      $lookup: {
        from: 'categoryarticles',
        localField: 'category',
        foreignField: '_id',
        as: 'categories_article',
      },
    },
    {
      $match: {
        categories_article: {
          $elemMatch: {
            categoryname: MatchQueries,
          },
        },
      },
    },
  ]);
  result = result.length < 1 ? (result = await Model.find()) : result;
  return result;
};

export const GetUniqFilteredCode = async (Model, length) => {
  let uniqCode = '';
  let isDone = false;
  const char = '1234567890qwertyuiopQWERTYUIOPASDFGHJKLasdfghjklzxcvbnmZXCVBNM';

  while (!isDone) {
    for (let i = 0; i <= length; i++) {
      const randomIndex = Math.floor(Math.random() * ((i * char.length) / new Date().getDay()));

      if (randomIndex < char.length) {
        uniqCode += char[randomIndex];
      } else {
        i--;
      }

      if (i == length) {
        break;
      }
    }

    const isUniqCodeUsed = await Model.aggregate([{ $match: { uniqFilter: uniqCode } }]);

    if (!isUniqCodeUsed.length) {
      isDone = true;
      return uniqCode;
    }
  }
};
