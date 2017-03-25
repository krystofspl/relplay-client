<template>
  <div class="playlist-details">
    <h3>{{ $t('components.EditPlaylist.tracksList') }}</h3>
    <div v-for="track in tracks">
      {{ track.position + 1 }}. {{ getArtistForTrack(track.id).name }} - {{ track.title }}
    </div>
  </div>
</template>

<script>
import { playlistGetters } from '../../mixins/getters/playlistGetters.js'
import { trackGetters } from '../../mixins/getters/trackGetters.js'
var _ = require('lodash')

export default {
  props: ['playlistId'],
  mixins: [ playlistGetters, trackGetters ],
  computed: {
    playlist: function () {
      return this.getPlaylist(this.playlistId)
    },
    tracks: function () {
      var self = this
      var tracks = []
      var playlist = this.playlist
      if (playlist) {
        _.forEach(_.sortBy(playlist.tracks, 'position'), track => {
          var trackItem = self.getTrack(track.id)
          trackItem.position = track.position
          tracks.push(trackItem)
        })
      }
      return tracks
    }
  }
}
</script>

<style lang="sass" scoped>
.playlist-details

</style>