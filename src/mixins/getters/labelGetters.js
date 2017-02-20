export var labelGetters = {
  methods: {
    getLabel: function (labelId) {
      return this.$store.state.data.labels[labelId]
    }
  }
}
