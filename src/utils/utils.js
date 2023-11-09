/** @format */

const CheckingIsNilValue = (key) => {
  if (key == '' || key == ' ') {
    return true;
  }
  if (typeof key === 'undefined' || key == null) {
    return true;
  } else {
    return false;
  }
};

const CheckingKeyReq = (Req1, Req2, Req3) => {
  let RequestSyntax = Object.keys(Req1).length >= 1 ? Req1 : false;
  RequestSyntax = !RequestSyntax ? Req2 : RequestSyntax;
  RequestSyntax = !RequestSyntax ? JSON.parse(Req3) : RequestSyntax;
  return RequestSyntax;
};

const CheckingKeyReqSyntax = (ValidSyntax, Req1, Req2, Req3) => {
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

module.exports = {
  CheckingIsNilValue,
  CheckingKeyReq,
  CheckingKeyReqSyntax,
};
