<template>
</template>

<script>
import { Howl } from 'howler'

export default {
  methods: {
    play: function () {
      var self = this
      var sound = new Howl({
        src: [self.$store.state.settings.global.backendUrl + 'tracks/7804/file.mp3'],
        html5: true
      })
      sound.play()
    }
  },
  created: function () {
    this.play()
  }
}
</script>

<style lang="sass" scoped>
</style>