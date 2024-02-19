/** @format */

export const GetIndex = async (req, res) => {
  try {
    res.render('index', {
      head_title: 'CV. Satya Utama Mandiri',
      head_description: 'Merupakan perusahaan yang bekerja dibidang kesehatan keluarga dan pariwisata.',
      head_author: 'Dian Adi Nugroho',
      head_keywords: 'satya utama mandiri',
      errMsg: false,
      description: 'Merupakan perusahaan yang bekerja dibidang kesehatan keluarga dan pariwisata.',
    });
    return;
  } catch (err) {
    res.render('index', {
      head_title: 'CV. Satya Utama Mandiri',
      head_description: 'Merupakan perusahaan yang bekerja dibidang kesehatan keluarga dan pariwisata.',
      head_author: 'Dian Adi Nugroho',
      head_keywords: 'satya utama mandiri',
      errMsg: `Function error Catch: ${err}`,
    });
    return;
  }
};
