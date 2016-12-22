<template>
  <div id="bottom-panel">
    <progress-bar></progress-bar>
    <player-controls></player-controls>
    <playing-track></playing-track>
  </div>
</template>

<script>
import PlayerControls from './bottom/PlayerControls.vue'
import PlayingTrack from './bottom/PlayingTrack.vue'
import ProgressBar from './bottom/ProgressBar.vue'

export default {
  components: {
    PlayerControls,
    PlayingTrack,
    ProgressBar
  }
}
</script>

<style lang="sass" scoped>
#bottom-panel
  height: 80px
  width: 100%
  background: #353535
  border-top: 1px solid #000
  position: fixed
  bottom: 0
  z-index: -1
#player-controls, #playing-track, #progress-bar
  display: inline-block
</style>
