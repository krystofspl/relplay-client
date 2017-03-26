<template>
  <div id="edit-playlist">
    <div class="left">
      <h3>{{ $t('components.EditPlaylist.headingForm') }}</h3>
      <label>{{ $t('components.Playlist.playlistName') }}</label>
      <input type="text" name="name" v-model="name">
    </div>
    <div class="right">
      <h3>{{ $t('components.EditPlaylist.tracksList') }}</h3>
      [TODO will be sortable]
      <div class="tracks-list">
        <div v-for="track in tracks" class="track-item">
          {{ getArtistForTrack(track.id).name }} - {{ track.title }}
          <span><a href="#" @click="removeTrack(track.position)">Remove</a></span>
        </div>
      </div>
    </div>
    <br><br><br>
    <button v-on:click="submit()" style="float: right; font-weight: bold;">Save</button>
  </div>
</template>

<script>
import { artistGetters } from '../../mixins/getters/artistGetters.js'
import { albumGetters } from '../../mixins/getters/albumGetters.js'
import { trackGetters } from '../../mixins/getters/trackGetters.js'
import { playlistGetters } from '../../mixins/getters/playlistGetters.js'
import { mapGetters, mapActions } from 'vuex'
var _ = require('lodash')

export default {
  data: function () {
    return {
      name: null,
      tracks: []
    }
  },
  props: ['playlistId'],
  mixins: [artistGetters, albumGetters, trackGetters, playlistGetters],
  components: {
  },
  computed: {
    playlist: function () {
      return this.getPlaylist(this.playlistId)
    }
  },
  methods: {
    ...mapGetters([]),
    ...mapActions(['setModalAction', 'toggleModalAction', 'showModal', 'hideModal', 'setModalEntity']),
    removeTrack: function (position) {
      // this.$delete(this.tracks, )
      var index = _.findIndex(this.tracks, t => { return t.position === position })
      console.log(index)
      this.tracks.splice(index, 1)
    },
    submit: function () {
      // Prepare data
      var newData = {
        id: this.playlistId,
        callback: function (err, obj) {
          console.log(err)
          console.log(obj)
        }
      }
      if (this.name !== this.playlist.name) {
        newData.name = this.name
      }
      newData.trackIds = _.map(_.sortBy(this.tracks, 'position'), t => {
        return t.id
      })
      // Send
      this.$store.dispatch('updatePlaylist', newData)
      this.hideModal()
    }
  },
  created: function () {
    var self = this
    if (self.playlistId) {
      var playlist = self.getPlaylist(self.playlistId)
      // Get playlist data
      if (playlist) {
        self.name = playlist.name
        _.forEach(_.sortBy(playlist.tracks, 'position'), track => {
          var trackItem = self.getTrack(track.id)
          trackItem.position = track.position
          self.tracks.push(trackItem)
        })
      }
    }
  }
}
</script>

<style lang="sass">
#edit-playlist
  .left, .right
    vertical-align: top
    width: 45%
    padding: 10px
    display: inline-block
  .left
    label
      font-weight: bold
      display: block
      width: 100%
      padding-top: 5px
    input


    input[type=text]
      width: 100%
      padding: 5px
      -webkit-box-sizing: border-box
      -moz-box-sizing: border-box
      box-sizing: border-box
  .right
    .tracks-list
      max-height: 200px
      overflow: auto
      .track-item
        padding: 2px
        border-bottom: 1px solid #000
        &:hover
          background: #555
          span
            display: inline
        span
          display: none
          a
            color: #FFF
</style>