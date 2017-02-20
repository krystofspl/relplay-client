<template>
  <div id="track-info">
    <h1>{{ $t('components.TrackInfo.nowPlaying') }}</h1>
    <div class="track-fields" v-if="getNowPlayingTrack">
      <div v-for="field in displayedFields">
        <div v-if="field === 'title'">
          <span>Title: <b>{{ getNowPlayingTrack[field] }}</b></span>
        </div>
        <div v-if="field === 'artist.name'">
          <span>Artist: {{ getMainArtistForAlbum(album.id).name }}</span>
        </div>
        <div v-if="field === 'album.name'">
          <span>Album: {{ album.title }}</span>
        </div>
        <div v-if="field === 'album.year'">
          <span>Year: {{ getAlbumForTrack(getNowPlayingTrack).year }}</span>
        </div>
        <div v-if="field === 'album.albumArt'">
          <img :src="getAlbumArtImgPath(album.id)" v-if="getAlbumArtImgPath(album.id).length">
        </div>
        <div v-if="field === 'labels'">
          <span>{{ $t('components.Labels.headingAlbum') }}: </span>
          <labels :entity-type="'album'" :entity-id="album.id"></labels><br>
          <span>{{ $t('components.Labels.headingTrack') }}: </span>
          <labels :entity-type="'track'" :entity-id="getNowPlayingId"></labels>
        </div>
      </div>
    </div>
    <div v-else>
      {{ $t('components.PlayingTrack.nothingPlaying') }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { trackGetters } from '../../mixins/getters/trackGetters.js'
import { albumGetters } from '../../mixins/getters/albumGetters.js'
import Labels from '../misc/Labels.vue'

export default {
  data: function () {
    return {
      displayedFields: this.$store.state.view.components.TrackInfo.displayedFields
    }
  },
  components: {
    Labels
  },
  computed: {
    ...mapGetters(['getNowPlayingTrack', 'getNowPlayingId']),
    album: function () {
      return this.getAlbumForTrack(this.getNowPlayingTrack)
    }
  },
  mixins: [trackGetters, albumGetters]
}
</script>

<style lang="sass" scoped>
#track-info
  border-top: 2px solid #000
  display: block
  h1
    margin: 5px 0
    padding: 0
    font-size: 120%
  .track-fields
    img
      text-align: center
      width: 100%
      margin-top: 10px
      border: 1px solid #000
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33)
      -webkit-box-reflect: below 0px -webkit-gradient(linear, left top, left bottom, from(transparent), to(rgba(255, 255, 255, 0.15)))

</style>