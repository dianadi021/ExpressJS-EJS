/** @format */

const jwt = require('jsonwebtoken');

const GenerateToken = (DataPostman) => {
  try {
    if (!DataPostman.body.email || !DataPostman.body.user) {
      return {
        notification: `Format salah atau inputan kosong!`,
        format: {
          email: 'String',
          user: 'String',
        },
      };
    }

    const email = DataPostman.body.email;
    const user = DataPostman.body.user;
    if (email == ' ' || user == ' ') {
      return {
        notification: `Inputan kosong! Harap isikan data object untuk membuat token`,
        format: {
          email: 'String',
          user: 'String',
        },
      };
    }

    const token = jwt.sign({ email: email, user: user }, 'secret', { expiresIn: '1h' });
    return { token: token };
  } catch (err) {
    console.log(`Function Catch: ${err}`);
    return { catch: `Function Catch: ${err}` };
  }
};

const CheckToken = (DataPostman) => {
  try {
    const isAuthToken = DataPostman.headers.authorization.includes('Bearer');
    if (!isAuthToken) {
      return {
        notification: `Harus login dengan menggunakan Bearer Token terlebih dahulu!`,
      };
    }

    const token = DataPostman.headers['authorization'].split(' ')[1];
    const isActiveToken = jwt.verify(token, 'secret');
    return isActiveToken;
  } catch (err) {
    console.log(`Function Catch: ${err}`);
    if (err.name == 'JsonWebTokenError') {
      return { catch: `Function Catch: Token tidak benar! atau ${err}` };
    }
    if (err.name == 'TokenExpiredError') {
      return { catch: `Function Catch: Token kadaluarsa! atau ${err}` };
    }
    if (err.name == 'TypeError') {
      return { catch: `Function Catch: Token tidak sesuai! atau ${err}` };
    }
    return { catch: `Function Catch: ${err}` };
  }
};

const CheckingTokenAuthorization = (req, res, next) => {
  try {
    const isAuthToken = req.headers.authorization.includes('Bearer');
    if (!isAuthToken) {
      return {
        notification: `Harus login dengan menggunakan Bearer Token terlebih dahulu!`,
      };
    }

    const token = req.headers['authorization'].split(' ')[1];
    const isToken = jwt.verify(token, 'secret');
    if (isToken) {
      return next();
    } else {
      res.json({ messages: false, notification: `Gagal mengakses endpoint! karena masalah yang belum ditemukan.` });
    }
  } catch (err) {
    if (err.name == 'JsonWebTokenError') {
      res.json({ messages: false, catch: `Function Catch: Token tidak benar! atau ${err}` });
    }
    if (err.name == 'TokenExpiredError') {
      res.json({ messages: false, catch: `Function Catch: Token kadaluarsa! atau ${err}` });
    }
    if (err.name == 'TypeError') {
      res.json({ messages: false, catch: `Function Catch: Token tidak sesuai! atau ${err}` });
    }
    res.json({ messages: false, catch: `Function Catch: ${err}` });
  }
};

module.exports = {
  GenerateToken,
  CheckToken,
  CheckingTokenAuthorization,
};
