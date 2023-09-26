require('./apps/mongoose/connect');

const express = require('express')
const app = express()
const port = 3000

const JWTRouter = require('./apps/routers/JWT.router');
const SongRouter = require('./apps/routers/Song.router');
const SongAlbumRouter = require('./apps/routers/SongAlbum.router');
const SongPlaylistRouter = require('./apps/routers/SongPlaylist.router');

app.use(JWTRouter)
app.use(SongRouter)
app.use(SongAlbumRouter)
app.use(SongPlaylistRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})