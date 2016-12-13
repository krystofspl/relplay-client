export var genreGetters = {
  methods: {
    getGenre: function (id) {
      return this.$store.state.data.genres[id]
    }
  }
}
