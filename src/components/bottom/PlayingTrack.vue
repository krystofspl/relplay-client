<template>
  <div id="playing-track">
    [{{ this.$store.state.player.state }}]
    <div class="playing-track-name">
      <span v-if="this.$store.state.player.nowPlaying">    
        {{ getNowPlayingTrack().title }}
      </span>
      <span v-else>
        Nothing playing
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  methods: {
    ...mapGetters(['getNowPlayingTrack'])
  }
}
</script>

<style lang="sass" scoped>  
</style>