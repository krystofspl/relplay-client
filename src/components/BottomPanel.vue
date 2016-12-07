<template>
  <div id="bottom-panel">
    <player-controls></player-controls>
    <playing-track></playing-track>
    <progress-bar></progress-bar>
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
  left: 0
  z-index: 0
#player-controls, #playing-track, #progress-bar
  display: inline-block
</style>
