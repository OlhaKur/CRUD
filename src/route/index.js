// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()
// ===============================================================

class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.author = author
    this.image = image
  }

  // Статичнтй метод для створення обєкту Track і додавання його до списку #list
  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  // Статичнтй метод для отримання всього списку треків
  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return (
      Track.#list.find((track) => track.id === id) || null
    )
  }
}

Track.create(
  'Інь Ян',
  'MONATIK i ROXOLANA',
  'https://picsum.photos/100/100',
)

Track.create(
  'Baila Conmigo (Remix)',
  'Selena Gomez & Pauw Alejandro',
  'https://picsum.photos/100/100',
)

Track.create(
  'Shameless',
  'Camila Cabello',
  'https://picsum.photos/100/100',
)

Track.create(
  'DAKITI',
  'BAD BUNNY',
  'https://picsum.photos/100/100',
)

Track.create(
  '11 PM',
  'Maluma',
  'https://picsum.photos/100/100',
)

Track.create(
  'Інша любов',
  'Enleo',
  'https://picsum.photos/100/100',
)

console.log(Track.getList())

class Playlist {
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000)
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/100/100'
  }

  // Статичнтй метод для створення обєкту Playlist і додавання його до списку #list
  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
}

Playlist.makeMix(Playlist.create('Test'))
Playlist.makeMix(Playlist.create('Test2'))
Playlist.makeMix(Playlist.create('Test3'))
// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',

    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ========================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  // res.render генерує нам HTML сторінку
  console.log(isMix)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-create',

    data: { isMix },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ↙️ тут вводимо шлях (PATH) до сторінки
router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  const name = req.body.name
  // res.render генерує нам HTML сторінку
  if (!name) {
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Введіть назву плейлиста',
        link: isMix
          ? '/spotify-create?isMix=true'
          : '/spotify-create',
      },
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }
  console.log(playlist)

  res.render('spotify-playlist', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })

  // ↙️ cюди вводимо назву файлу з сontainer
  // res.render('spotify-create', {
  //   // вказуємо назву папки контейнера, в якій знаходяться наші стилі
  //   style: 'spotify-create',

  //   data: {},
  // })
  // ↑↑ сюди вводимо JSON дані
})
// ===================================================
router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)
  // res.render генерує нам HTML сторінку
  if (!playlist) {
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: '/',
      },
    })
  }
  res.render('spotify-playlist', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
  // ↙️ cюди вводимо назву файлу з сontainer

  // ↑↑ сюди вводимо JSON дані
})
// ========================================================
router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)
  const playlist = Playlist.getById(playlistId)
  // res.render генерує нам HTML сторінку
  if (!playlist) {
    return res.render('alert', {
      // вказуємо назву папки контейнера, в якій знаходяться наші стилі
      style: 'alert',

      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }
  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-playlist',

    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
  // ↙️ cюди вводимо назву файлу з сontainer

  // ↑↑ сюди вводимо JSON дані
})
// ==================================
router.get('/spotify-playlist-add', function (req, res) {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)
  // res.render генерує нам HTML сторінку
  // if (!playlist) {
  //   return res.render('alert', {
  //     // вказуємо назву папки контейнера, в якій знаходяться наші стилі
  //     style: 'alert',

  //     data: {
  //       message: 'Помилка',
  //       info: 'Такого плейлиста не знайдено',
  //       link: '/',
  //     },
  //   })
  // }
  res.render('spotify-playlist-add', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-playlist-add',

    data: {
      playlistId: playlist.id,
      tracks: Track.getList(),
      name: playlist.name,
    },
  })
  // ↙️ cюди вводимо назву файлу з сontainer

  // ↑↑ сюди вводимо JSON дані
})
// ==================================

// Підключаємо роутер до бек-енду
module.exports = router

router.get('/spotify-search', function (req, res) {
  const value = ''

  const list = Playlist.findListByValue(value)
  // res.render генерує нам HTML сторінку

  return res.render('spotify-search', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByValue(value)

  console.log(value)
  // res.render генерує нам HTML сторінку

  res.render('spotify-search', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-search',

    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})
