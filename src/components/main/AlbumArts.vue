<template>
  <div id="album-arts">
    album-arts
    <span @click='asd()'>asdasd</span>
    {{ this.$store.state }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data: function () {
    return {
      albums: {}
    }
  },
  methods: {
    ...mapGetters(['getAlbums']),
    asd: function () {
      console.log(this.getAlbums())
      return null
    }
  },
  computed: {
    albums: function () {
      return this.getAlbums()
    }
  }
}
</script>

<style lang="sass" scoped>
#album-arts
</style>
