export var albumGetters = {
  methods: {
    getAlbum: function (id) {
      return this.$store.state.data.albums[id]
    },
    getMainArtistForAlbum: function (albumId) {
      return this.$store.state.data.artists[this.getAlbum(albumId).mainArtist]
    },
    getTracksForAlbum: function (albumId) {
      return Object.values(this.$store.state.data.tracks).filter(track => track.album === albumId)
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
    },
    getLabelsForAlbum: function (albumId) {
      return (this.getAlbum(albumId).labels.map(labelId => { return this.$store.state.data.labels[labelId] }))
    }
  }
}
