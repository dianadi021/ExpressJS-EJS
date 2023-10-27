/** @format */

const { RouterMain, RouterToken, RouterUsers } = require('./api/bridges');

const express = require('express');
const app = express();
const port = 9000;

try {
  app.use(RouterMain);
  app.use(RouterToken);
  app.use(RouterUsers);

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
} catch (error) {
  console.log(`App listening on port Error: ${error}`);
}
