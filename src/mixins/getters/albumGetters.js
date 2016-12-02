export var albumGetters = {
  methods: {
    getAlbum: function (id) {
      return this.$store.state.data.albums[id]
    },
    getTracksForAlbum: function (albumId) {
      // TODO
      return null
    },
    getAlbumArt: function (albumId) {
      // TODO call backend
    }
  }
}
