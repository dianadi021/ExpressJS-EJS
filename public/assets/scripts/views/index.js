/** @format */

const FetchDataWithMaping = async (serverURL, mapKey) => {
  const dataString = await fetch(serverURL);
  const toJSON = dataString.text();
  const dataJSON = JSON.parse(toJSON);
  const dataMap = new Map();
  dataMap.set(mapKey, dataJSON[mapKey]);
  return dataMap.get(mapKey);
};

const FetchData = async (api, method) => {
  if (method == 'fetch') {
    const dataJSON = await fetch(api)
      .then((res) => {
        if (!res.ok) {
          alert(`Gagal mengambil data dari server.`);
          throw new Error('Gagal mengambil data dari server.');
        }
        return res.json();
      })
      .catch((err) => {
        alert(`Kesalahan dalam mengambil data ${err}`);
      });
    return dataJSON;
  }

  const { open, onreadystatechange, readyState, status, responseText, send } = new XMLHttpRequest();
  await open('GET', 'http://alamat-api-anda.com/data', true);
  onreadystatechange = () => {
    if (readyState === XMLHttpRequest.DONE) {
      if (status === 200) {
        return JSON.parse(responseText);
      } else {
        alert(`Gagal mengambil data dari server.`);
        throw new Error('Gagal mengambil data dari server.');
      }
    }
  };
  send();
};

const tes = async (url) => {
  const text = await FetchData(`http://${url}/api/main/`);
};

const ModalRegistLoginUser = () => {
  const LoginUser = `
  <div class="modal fade" id="loginUser" tabindex="-1" aria-labelledby="loginUserLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="loginUserLabel">Masuk</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form method="post" action="/api/users/login">
            <div class="form-outline mb-4">
              <label class="form-label" for="username">Username</label>
              <input type="username" id="username" name="username" class="form-control" maxlength="12" pattern="^[a-z0-9]{4,12}$" placeholder="Maksimal 12 huruf" title="Simbol dan spasi tidak diperbolehkan" required />
            </div>
            <div class="form-outline mb-4">
              <label class="form-label" for="password">Password</label>
              <input type="password" id="password" name="password" class="form-control" required />
            </div>
            <div class="row mb-4">
              <div class="col">
                <a href="#!">Lupa password?</a>
              </div>
            </div>
            <center>
              <button type="submit" class="btn btn-primary btn-block mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Masuk</button>
            </center>
            <div class="text-center">
              <p>Belum terdaftar? <a href="#register" data-bs-toggle="modal" data-bs-target="#registerUser">Daftar</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  `;

  const RegistUser = `
  <div class="modal fade" id="registerUser" tabindex="-1" aria-labelledby="registerUserLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="registerUserLabel">Daftar</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form method="post" action="/api/users">
            <!-- Email input -->
            <div class="form-outline mb-4">
              <label class="form-label" for="name">Nama Lengkap</label>
              <input type="name" id="name" name="name" class="form-control" minlength="4" maxlength="34" pattern="^[a-zA-Z\\s]{4,34}$" title="Simbol dan angka tidak diperbolehkan" placeholder="Contoh: Filipo Inzagi" required />
            </div>
            <div class="form-outline mb-4">
              <label class="form-label" for="username">Username</label>
              <input type="username" id="username" name="username" class="form-control" minlength="4" maxlength="12" pattern="^[a-z0-9]{4,12}$" placeholder="Maksimal 12 huruf" title="Simbol dan spasi tidak diperbolehkan" required />
            </div>
            <div class="form-outline mb-4">
              <label class="form-label" for="email">Alamat Email</label>
              <input type="email" id="email" name="email" class="form-control" pattern="[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$" placeholder="Contoh: contoh@gmail.com" title="Masukkan alamat email yang valid" required>
            </div>
            <!-- Password input -->
            <div class="form-outline mb-4">
              <label class="form-label" for="password">Password</label>
              <input type="password" id="password" name="password" minlength="8" class="form-control" required />
            </div>
            <!-- Submit button -->
            <center>
              <button type="submit" class="btn btn-success btn-block mb-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Daftar</button>
            </center>
            <!-- Register buttons -->
            <div class="text-center">
              <p>Sudah mendaftar? <a href="#login" data-bs-toggle="modal" data-bs-target="#loginUser">Masuk</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  `;

  $('#modal').html(LoginUser);
  $('#modal').append(RegistUser);
};
