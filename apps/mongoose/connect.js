/** @format */

const mongoose = require('mongoose');

const urlServer = 'mongodb://localhost:27017/';
const dbName = 'BasicCRUD';

mongoose
  .connect(`${urlServer}${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Success connected to MongoDB!');
  })
  .catch((err) => {
    console.error(`Connection error to MongoDB ${err.name}`);
  });

module.exports = mongoose;
