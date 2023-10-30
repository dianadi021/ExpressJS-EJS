/** @format */

const { RouterMain, RouterToken, RouterUsers } = require('./src/bridges');
// const path = require('path');

const express = require('express');
const app = express();
const port = 9000;

try {
  // app.use(express.static(path.join(__dirname, "/public/")));

  // Main API
  app.use(RouterMain);
  app.use(RouterToken);
  app.use(RouterUsers);

  app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
  });
} catch (error) {
  console.log(`App listening on port Error: ${error}`);
}
