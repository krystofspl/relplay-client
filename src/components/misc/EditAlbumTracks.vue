<template>
  <div id="edit-album-tracks">
    <div>Track {{ selectedTrackNr + 1 }}/{{ tracks.length }}</div>

    <div @click="prevTrack()" v-if="selectedTrackNr > 0" class="action active">
      <icon scale="1.5" name="arrow-left"></icon>
    </div>
    <icon scale="1.5" name="arrow-left" v-else class="action inactive"></icon>
    <div @click="nextTrack()" v-if="selectedTrackNr < tracks.length - 1" class="action active">
      <icon scale="1.5" name="arrow-right"></icon>
    </div>
    <icon scale="1.5" name="arrow-right" v-else class="action inactive"></icon>

    <label>{{ $t('components.EditAlbumTracks.trackTitle') }}</label>
    <input type="text" name="title" v-model="title">
    <label>{{ $t('components.EditAlbumTracks.trackNr') }}</label>
    <input type="text" name="trackNr" v-model="trackNr">
    <label>{{ $t('components.EditAlbumTracks.diskNr') }}</label>
    <input type="text" name="diskNr" v-model="diskNr">
    <label>{{ $t('components.EditAlbumTracks.playCount') }}</label>
    <input type="text" name="playCount" v-model="playCount">
    <label>{{ $t('components.EditAlbumTracks.filePath') }}</label>
    <input type="text" name="filePath" v-model="filePath">

    <!-- TODO labels, album -->

    <br><br><br>
    <button v-on:click="submit()" style="float: right; font-weight: bold;">Save</button>
    <br><br><br>
  </div>
</template>

<script>
import { trackGetters } from '../../mixins/getters/trackGetters.js'
import { albumGetters } from '../../mixins/getters/albumGetters.js'
var _ = require('lodash')
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons'

export default {
  data: function () {
    return {
      selectedTrackNr: 0,
      title: null,
      trackNr: null,
      diskNr: null,
      playCount: null,
      filePath: null,
      albumId: null,
      labels: [],
      lyrics: null
    }
  },
  components: {
    Icon
  },
  props: ['album'],
  mixins: [trackGetters, albumGetters],
  methods: {
    prevTrack: function () {
      this.selectedTrackNr -= 1
    },
    nextTrack: function () {
      this.selectedTrackNr += 1
    },
    setFieldsForTrack: function () {
      this.title = this.selectedTrack.title
      this.trackNr = this.selectedTrack.trackNr
      this.diskNr = this.selectedTrack.diskNr
      this.playCount = this.selectedTrack.playCount
      this.filePath = this.selectedTrack.filePath
      this.albumId = this.selectedTrack.album
      this.lyrics = this.selectedTrack.lyrics
    },
    submit: function () {
      var self = this
      // Prepare data
      var newData = {
        id: this.selectedTrack.id,
        callback: function (err, obj) {
          self.setFieldsForTrack()
          console.log(err)
          console.log(obj)
        }
      }
      if (this.title !== this.selectedTrack.title) {
        newData.title = this.title
      }
      if (this.trackNr !== this.selectedTrack.trackNr) {
        newData.trackNr = this.trackNr
      }
      if (this.diskNr !== this.selectedTrack.diskNr) {
        newData.diskNr = this.diskNr
      }
      if (this.playCount !== this.selectedTrack.playCount) {
        newData.playCount = this.playCount
      }
      if (this.filePath !== this.selectedTrack.filePath) {
        newData.filePath = this.filePath
      }
      if (this.filePath !== this.selectedTrack.filePath) {
        newData.filePath = this.filePath
      }
      // TODO albumId, labels, lyrics
      // Send
      this.$store.dispatch('updateTrack', newData)
    }
  },
  computed: {
    tracks: function () {
      return _.sortBy(this.getTracksForAlbum(this.album.id), ['diskNr', 'trackNr'])
    },
    selectedTrack: function () {
      return this.getTrack(this.tracks[this.selectedTrackNr].id)
    }
  },
  watch: {
    selectedTrackNr: function () {
      this.setFieldsForTrack()
    }
  },
  created: function () {
    this.setFieldsForTrack()
  }
}
</script>

<style lang="sass" scoped>
#edit-album-tracks
  min-height: 400px
  label
    font-weight: bold
    display: block
    width: 100%
    padding-top: 5px
  input
    border: 1px solid #000
    color: #000
    border-radius: none
    &::placeholder
      color: #000
    &:hover
      border: 1px solid #CCC
    &:focus
      border: 2px solid #000
      background: #999
  input[type=text]
    width: 100%
    padding: 5px
    -webkit-box-sizing: border-box
    -moz-box-sizing: border-box
    box-sizing: border-box
  .action
    display: inline
  .active
    &:hover
      color: #FFF
  .inactive
    color: #555
</style>