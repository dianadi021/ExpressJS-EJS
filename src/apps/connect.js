/** @format */

import { config } from 'dotenv';
import mongoose from 'mongoose';

config();

const URL_SERVER = process.env.URL_SERVER || `localhost`;
const DB_NAME = process.env.DB_NAME;
const DB_SERVER = `mongodb://${URL_SERVER}:27017/${DB_NAME}`;

try {
  await mongoose
    .connect(`${DB_SERVER}`, { useFindAndModify: true, useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      console.log('Success connected to MongoDB!');
    })
    .catch((err) => {
      console.error(`Connection error to MongoDB catch: ${err}`);
    });
} catch (err) {
  console.error(`Connection error to MongoDB catch: ${err}`);
}

export { mongoose };

