export var artistGetters = {
  methods: {
    getArtist: function (id) {
      return this.$store.state.data.artists[id]
    },
    getAlbumsForArtist: function (id) {
      return Object.values(this.$store.state.data.albums).filter(album => { return album.mainArtist === id || album.artists.includes(id) })
    }
  }
}
