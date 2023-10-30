/** @format */

const mongoose = require('mongoose');

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
    role: { type: String },
  },
  {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Users', UsersSchema);
