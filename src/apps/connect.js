/** @format */

const mongoose = require('mongoose');
const dbName = 'BasicCRUD';
const urlServer = `mongodb://localhost:27017/${dbName}`;

mongoose
  .connect(`${urlServer}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Success connected to MongoDB!');
  })
  .catch((err) => {
    console.error(`Connection error to MongoDB ${err}`);
  });

module.exports = mongoose;
