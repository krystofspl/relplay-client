export var trackGetters = {
  methods: {
    getAlbumForTrack: function (track) {
      return this.$store.state.data.albums.find(album => album.id === track.album)
    },
    getArtistForTrack: function (track) {
      return this.$store.state.data.artists.find(artist => artist.id === this.getAlbumForTrack(track).mainArtist)
    }
  }
}
