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

export const ReturnEJSViews = async (req, res, views = `index`, status = 200, isErr = true, message = `Connected.`, datas) => {
  const userPlatform = req.headers ? req.headers['user-agent'] : 'Browser';

  if (userPlatform.includes('Postman')) {
    if (!datas) {
      return res.status(status).json({ status: isErr, messages: message });
    }

    return res.status(status).json({ status: isErr, messages: message, datas });
  }

  if (!datas) {
    return res.status(status).render(views, {
      head_title: process.env.PROJECT_TITLE_NAME,
      head_description: process.env.PROJECT_DESCRIPTION,
      head_author:  process.env.AUTHOR_PROJECT,
      head_keywords: process.env.PROJECT_KEYWOARD,
      description: process.env.PROJECT_DESCRIPTION,
      status: isErr,
      messages: message,
    });
  }

  return res.status(status).render(views, {
    head_title: process.env.PROJECT_TITLE_NAME,
    head_description: process.env.PROJECT_DESCRIPTION,
    head_author:  process.env.AUTHOR_PROJECT,
    head_keywords: process.env.PROJECT_KEYWOARD,
    description: process.env.PROJECT_DESCRIPTION,
    status: isErr,
    messages: message,
    datas,
  });
};

import Crypto from 'crypto';
export const EncodePasswordToHash = (method, pass) => {
  const hash = Crypto.createHash(method);
  hash.update(pass);
  return hash.digest('base64');
};

export const DecodePasswordToHash = (pass) => {
  const md5 = EncodePasswordToHash('md5', pass);
  const sha1 = EncodePasswordToHash('sha1', md5);
  const sha256 = EncodePasswordToHash('sha256', sha1);
  return EncodePasswordToHash('sha512', sha256);
};

export const IsInputWasValidString = (checking, string) => {
  if (checking == 'username') {
    return /^[a-z0-9]{4,12}$/g.exec(string);
  }

  if (checking == 'email') {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g.exec(string);
  }

  if (checking == 'name') {
    return /^[a-zA-Z\s]{4,34}$/g.exec(string);
  }
};
