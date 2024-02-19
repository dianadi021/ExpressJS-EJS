/** @format */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Postman Basic Auth
export const PostmanBasicAuth = (req, res, next) => {
  try {
    const [isAuthBasic, Auth] = req.headers.authorization.split(' ');

    if (isAuthBasic != 'Basic') {
      res.status(401).json({ status: 'failed', messages: `Harus login Basic Auth, terlebih dahulu!` });
    }

    const decodeAuthBasic = Buffer.from(Auth, 'base64').toString('ascii');
    const [username, password] = decodeAuthBasic.split(':');

    if (username !== 'admin' || password !== 'Koknanya?') {
      res.status(401).json({ status: 'failed', messages: `Akses ditolak! Username atau Password salah!` });
    } else {
      return next();
    }
  } catch (err) {
    res.status(500).json({ status: 'failed', messages: `Function basic auth catch error: ${err}` });
  }
};

export const GenerateToken = (req, res) => {
  try {
    const { email, user } = CheckingKeyReq(req.body, req.query, req.body.data);
    const format = { email: 'String', user: 'String' };

    if (typeof email == 'undefined' || typeof user == 'undefined') {
      return res.status(400).json({ status: 'failed', messages: `email atau user tidak boleh kosong!`, format: format });
    } else if (email == '' || email == ' ' || user == '' || user == ' ') {
      return res.status(400).json({ status: 'failed', messages: `email atau user tidak boleh kosong!`, format: format });
    }

    const token = jwt.sign({ email: email, user: user }, 'secret', { expiresIn: '5m' });

    return res.status(201).json({ status: 'success', messages: `Berhasil membuat token!`, token: token });
  } catch (err) {
    res.status(500).json({ status: 'failed', messages: `Function basic auth catch error: ${err}` });
  }
};

// JWT Auth
export const jwt = require('jsonwebtoken');

export const CheckToken = (req, res) => {
  try {
    const { token } = CheckingKeyReq(req.body, req.query, req.body.data);

    if (typeof token == 'undefined') {
      const formatCheckToken = {
        token: 'String',
      };
      return res.status(404).json({ status: 'failed', messages: `Inputan token kosong!`, format: formatCheckToken });
    }

    const isActiveToken = jwt.verify(token, 'secret');

    return res.status(200).json({ status: 'success', messages: isActiveToken });
  } catch (err) {
    return res.status(401).json({ status: 'failed', messages: err });
  }
};

export const CheckingTokenAuthorization = (req, res, next) => {
  try {
    const [isBearerAuth, Token] = req.headers.authorization.split(' ');

    if (isBearerAuth != 'Bearer') {
      res.status(401).json({ status: 'failed', messages: `Harus login Bearer Auth Token, terlebih dahulu!` });
    }

    const isToken = jwt.verify(Token, 'secret');

    if (isToken) {
      return next();
    } else {
      res.status(500).json({ status: 'failed', messages: `Bearer Auth Token error: ${err}` });
    }
  } catch (err) {
    if (err.name == 'JsonWebTokenError') {
      res.status(400).json({ status: 'failed', messages: `Function Catch: Token tidak benar! atau ${err}` });
    }

    if (err.name == 'TokenExpiredError') {
      res.status(401).json({ status: 'failed', messages: `Function Catch: Token kadaluarsa! atau ${err}` });
    }

    if (err.name == 'TypeError') {
      res.status(404).json({ status: 'failed', messages: `Function Catch: Token tidak sesuai! atau ${err}` });
    }

    res.json({ messages: false, catch: `Function Catch: ${err}` });
  }
};