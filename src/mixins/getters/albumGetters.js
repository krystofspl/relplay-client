export var albumGetters = {
  methods: {
    getAlbum: function (id) {
      return this.$store.state.data.albums[id]
    }
  }
}
