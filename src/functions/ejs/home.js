/** @format */

import { ReturnEJSViews } from '../../utils/utils.js';

export const GetHOME = async (req, res) => {
  try {
    return await ReturnEJSViews(req, res, 'home', 200, true, `Connected.`);
  } catch (err) {
    return await ReturnEJSViews(req, res, 'home', 500, false, `Function error Catch: ${err}`);
  }
};
