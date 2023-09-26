/** @format */

const CheckAuthorization = (req, res, next) => {
  try {
    const isAuthBasic = req.headers.authorization.includes('Basic');

    if (!isAuthBasic) {
      return res.json({
        message: false,
        notification: `Harus login Auth Basic terlebih dahulu!`,
      });
    }

    const encodeAuthBasic = req.headers.authorization.split(' ')[1];
    const decodeAuthBasic = Buffer.from(encodeAuthBasic, 'base64').toString('ascii');
    const [username, password] = decodeAuthBasic.split(':');

    if (username !== 'dianadi021' || password !== 'ZettaCampBatch4') {
      return res.json({
        message: false,
        notification: `Akses ditolak! Username atau Password salah!`,
      });
    }

    return next();
  } catch (err) {
    console.log(`Function Catch: ${err}`);
    return res.json({
      message: false,
      notification: `Function Catch: ${err}`,
    });
  }
};

module.exports = CheckAuthorization;
