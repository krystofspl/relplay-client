<template>
  <div id="playing-track">
    <div class="playing-track-name">
      <span v-if="this.$store.state.player.nowPlaying">
        {{ getArtistForTrack(getNowPlayingTrack().id).name }} - {{ getNowPlayingTrack().title }}
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
  float: left
  font-size: 17px
  color: #FFF
  width: 500px
  height: 65px
  .playing-track-name
    padding-top: 22px
</style>