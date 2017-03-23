<template>
  <div id="edit-playlist">
    <div class="left">
      <h3>{{ $t('components.EditPlaylist.headingForm') }}</h3>
      <label>{{ $t('components.Playlist.playlistName') }}</label>
      <input type="text" name="name" v-model="name">
    </div>
    <div class="right">
      <h3>{{ $t('components.EditPlaylist.tracksList') }}</h3>
      <div v-for="track in tracks">
        {{ getArtistForTrack(track.id).name }} - {{ track.title }}
      </span>
    </div>
  </div>
  <br><br><br>
  <button v-on:click="submit()" style="float: right; font-weight: bold;">Save</button>
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
    },
    methods: {
      ...mapGetters([]),
      ...mapActions(['setModalAction', 'toggleModalAction', 'showModal', 'hideModal', 'setModalEntity']),
      submit: function () {
        // Prepare data
        var newData = {
          id: this.album.id,
          callback: function (err, obj) {
            console.log(err)
            console.log(obj)
          }
        }
        if (this.title !== this.album.title) {
          newData.title = this.title
        }
        // Send
        this.$store.dispatch('updatePlaylist', newData)
        this.setModalAction('showAlbum')
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
            self.tracks.push(self.getTrack(track.id))
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
</style>