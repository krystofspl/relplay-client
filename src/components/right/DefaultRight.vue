<template>
  <div id="default-right">
    <playlist></playlist>
    <track-info></track-info>
  </div>
</template>

<script>
import Playlist from './Playlist.vue'
import TrackInfo from './TrackInfo.vue'

export default {
  components: {
    Playlist,
    TrackInfo
  }
}
</script>

<style lang="sass" scoped>
#default-right
</style>