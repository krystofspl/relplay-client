export var playlistGetters = {
  methods: {
    getPlaylist: function (playlistId) {
      return this.$store.state.data.playlists[playlistId]
    }
  }
}
