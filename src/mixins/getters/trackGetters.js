export var trackGetters = {
  methods: {
    getTrack: function (trackId) {
      return this.$store.state.data.tracks[trackId]
    },
    getAlbumForTrack: function (track) {
      return Object.values(this.$store.state.data.albums).find(album => album.id === track.album)
    },
    getArtistForTrack: function (trackId) {
      return Object.values(this.$store.state.data.artists).find(artist => artist.id === this.getAlbumForTrack(trackId).mainArtist)
    },
    getArtworkPath: function (trackId) {
      // TODO let user choose
      return (this.getTrack(trackId).filePath + 'folder.jpg')
    },
    getLabelsForTrack: function (trackId) {
      return (this.getTrack(trackId).labels.map(labelId => { return this.$store.state.data.labels[labelId] }))
    }
  }
}
