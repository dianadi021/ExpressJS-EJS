/** @format */

const mongoose = require('../apps/connect');

const UsersSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    full_name: {
      first_name: {
        type: String,
        required: true,
      },
      last_name: {
        type: String,
        required: true,
      },
    },
    address: { type: String },
    contact_number: { type: String },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'RolesUsers' },
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
const UsersModel = mongoose.model('Users', UsersSchema);

const FormatInputUser = {
  username: 'String',
  password: 'Combine (String/Number/Symbol)',
  email: 'String',
  full_name: { first_name: 'String', last_name: 'String' },
  address: 'String',
  contact_number: 'String',
};

module.exports = {
  UsersModel,
  FormatInputUser,
};
