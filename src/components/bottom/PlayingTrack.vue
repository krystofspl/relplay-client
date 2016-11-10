<template>
  <div id="playing-track">
    <div class="playing-track-name">
      <span v-if="this.$store.state.player.nowPlaying">    
        {{ getArtistForTrack(getNowPlayingTrack()).name }} -  {{ getNowPlayingTrack().title }}
      </span>
      <span v-else>
        {{ $t('components.PlayingTrack.nothingPlaying') }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { trackGetters } from '../../mixins/getters/trackGetters.js'

export default {
  methods: {
    ...mapGetters(['getNowPlayingTrack'])
  },
  mixins: [trackGetters]
}
</script>

<style lang="sass" scoped>
#playing-track
  background: white
  width: 80%
  margin: 0
</style>