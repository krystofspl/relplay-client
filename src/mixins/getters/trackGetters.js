export var trackGetters = {
  methods: {
    getTrack: function (id) {
      return this.$store.state.data.tracks[id]
    },
    getAlbumForTrack: function (track) {
      return Object.values(this.$store.state.data.albums).find(album => album.id === track.album)
    },
    getArtistForTrack: function (track) {
      return Object.values(this.$store.state.data.artists).find(artist => artist.id === this.getAlbumForTrack(track).artists[0])
    },
    getArtworkPath: function (track) {
      // TODO let user choose
      return (this.getTrack(track).filePath + 'folder.jpg')
    }
  }
}
