/** @format */

import { mongoose } from '../apps/connect.js';

const UsersSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String },
  },
  { timestamps: true },
  {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000,
    },
  }
);

export { mongoose };

export const UsersModel = mongoose.model('Users', UsersSchema);

export const FormatUsers = {
  username: { type: 'String', required: true },
  email: { type: 'String', required: true },
  password: { type: 'String', required: true },
  name: { type: 'String', required: true },
  address: { type: 'String' },
};
