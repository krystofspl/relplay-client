export var albumGetters = {
  methods: {
    getAlbum: function (id) {
      return this.$store.state.data.albums[id]
    },
    getTracksForAlbum: function (albumId) {
      return Object.values(this.$store.state.data.tracks).filter(track => track.album === this.albumId)
    },
    getAlbumArtImgPath: function (albumId) {
      var urlCreator = window.URL || window.webkitURL
      var blob = this.$store.state.data.albumArts[albumId]
      var url = ''
      try {
        url = urlCreator.createObjectURL(blob)
      } catch (e) {
      }
      return url
    }
  }
}
