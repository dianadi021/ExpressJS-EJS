/** @format */

const FetchDataWithMaping = async (serverURL, mapKey) => {
  const dataString = await fetch(serverURL);
  const toJSON = dataString.text();
  const dataJSON = JSON.parse(toJSON);
  const dataMap = new Map();
  dataMap.set(mapKey, dataJSON[mapKey]);
  return dataMap.get(mapKey);
};

const FetchData = async (api) => {
  const dataString = await fetch(api);
  const toJSON = await dataString.text();
  const dataJSON = JSON.parse(toJSON);
  return dataJSON;
};

const tes = async (url) => {
  const text = await FetchData(`http://${url}/api/main/`);
  // alert(JSON.stringify(text).replace(/\\/g, ''));
};
