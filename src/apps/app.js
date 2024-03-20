/** @format */

import { config } from 'dotenv';
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import { API_ENDPOINT_URL } from '../bridges.js';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const SERVER = process.env.URL_SERVER;
const PORT = process.env.PORT_SERVER || 3000;

try {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Display EJS
  app.use(expressLayouts);
  app.set('layout', path.join(__dirname, '../../public/layouts/index'));
  app.set('views', path.join(__dirname, '../../public/views/'));
  app.set('view engine', 'ejs');
  app.use('/public/', express.static(path.join(__dirname, '../../public/')));

  app.use(morgan('short'));
  app.use(session({ secret: 'secret-s_UtamaMandiri', resave: false, saveUninitialized: false }));

  app.use(passport.initialize());
  app.use(passport.session());

  // API ENDPOINT START
  API_ENDPOINT_URL(app);
  // API ENDPOINT END

  app.listen(PORT, () => {
    console.log(`App listening on http://${SERVER}:${PORT}`);
  });
} catch (err) {
  console.log(`App listening catch err: ${err}`);
}
