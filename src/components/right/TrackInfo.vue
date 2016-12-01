<template>
  <div id="track-info">
    <h1>{{ $t('components.TrackInfo.nowPlaying') }}</h1>
    <div class="track-fields">
      <div v-for="field in displayedFields">
        <div v-if="field === 'title'">
          <span>Title: <b>{{ getNowPlayingTrack[field] }}</b></span>
        </div>
        <div v-if="field === 'artist.name'">
          <span>Artist: {{ getArtistForTrack(getNowPlayingTrack).name }}</span>
        </div>
        <div v-if="field === 'album.name'">
          <span>Album: {{ getAlbumForTrack(getNowPlayingTrack).title }}</span>
        </div>
        <!--
        <div v-if="field === 'album.year'">
          <span>Year: {{ getAlbumForTrack(getNowPlayingTrack).year }}</span>
        </div>
        -->
        <!--
        <div v-if="field === 'album.albumArt'">
          <img v-bind:src="getArtworkPath(getNowPlayingId)">
        </div>
        -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { trackGetters } from '../../mixins/getters/trackGetters.js'

export default {
  data: function () {
    return {
      displayedFields: []
    }
  },
  computed: {
    ...mapGetters(['getNowPlayingTrack']),
    displayedFields: function () {
      return this.$store.state.view.components.TrackInfo.displayedFields
    }
  },
  mixins: [trackGetters]
}
</script>

<style lang="sass" scoped>
#track-info
  border-top: 2px solid #000
  // position: absolute
  // bottom: 0
  h1
    margin: 5px 0
    padding: 0
    font-size: 120%
  span
  img
    text-align: center
    width: 100%

</style>