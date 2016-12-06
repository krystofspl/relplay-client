<template>
  <div id="edit-album">
    <label>{{ $t('components.AlbumDetails.albumTitle') }}</label>
    <input type="text" name="title" v-model="title">

    <label for="inInbox">{{ $t('components.AlbumDetails.inInbox') }}</label>
    <input type="checkbox" name="inInbox" v-model="inInbox">

    <label for="mainArtist">{{ $t('components.AlbumDetails.mainArtist') }}</label>
    <multiselect name="mainArtist" v-model="mainArtist"
      @input="setMainArtist"
      :options="availableArtists"
      :custom-label="artistMultiselectLabel"
      :value="getSelectedMainArtist()"
      :allow-empty="false"
      :track-by="id"
      ></multiselect>

    <i>[NUR] Dynamic search by typing doesn't work yet, there's an open bug in the library.</i><br>

    <label for="artists">{{ $t('components.AlbumDetails.artists') }}</label>
    <multiselect name="artists"
      @input="setArtists"
      :options="availableArtists"
      :custom-label="artistMultiselectLabel"
      :value="getSelectedArtists()"
      :allow-empty="true"
      :multiple="true"
      :track-by="id"
      ></multiselect>

    <i>[NUR] And this is a bit broken too but works for initial assignment ;-).</i><br>
    <i>Debug values: {{ artists.map(a => a.id) }}</i><br>

    <button v-on:click="submit()">Submit</button>
  </div>
</template>

<script>
  import { artistGetters } from '../../mixins/getters/artistGetters.js'
  import { albumGetters } from '../../mixins/getters/albumGetters.js'
  import { trackGetters } from '../../mixins/getters/trackGetters.js'
  import { mapGetters } from 'vuex'
  import Icon from 'vue-awesome/components/Icon'
  import Multiselect from 'vue-multiselect'
  import 'vue-awesome/icons/'
  var _ = require('lodash')

  export default {
    data: function () {
      var self = this
      return {
        title: self.album.title,
        inInbox: self.album.inInbox,
        mainArtist: null,
        artists: []
      }
    },
    props: ['album'],
    mixins: [artistGetters, albumGetters, trackGetters],
    components: {
      Icon,
      Multiselect
    },
    computed: {
      availableArtists: function () {
        return Object.values(this.getArtists())
      },
      tracks: function () {
        return this.getTracksForAlbum(this.album.albumId)
      }
    },
    methods: {
      ...mapGetters(['getArtists']),
      getSelectedMainArtist: function () {
        return this.getArtist(this.album.mainArtist)
      },
      getSelectedArtists: function () {
        var self = this
        return this.album.artists.map(a => self.getArtist(a))
      },
      artistMultiselectLabel: function (artist) {
        return artist.name
      },
      setMainArtist: function (artist) {
        this.mainArtist = artist
      },
      setArtists: function (artists) {
        this.artists = artists
      },
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
        if (this.inInbox !== this.album.inInbox) {
          newData.inInbox = this.inInbox
        }
        if (this.mainArtist && this.mainArtist.id !== this.album.mainArtist) {
          newData.mainArtist = this.mainArtist.id
        }
        if (this.artists.length >= 1 && !_.isEqual(this.artists.map(i => i.id).sort(), this.album.artists.sort())) {
          newData.artists = this.artists.map(a => a.id)
        }
        // Send
        this.$store.dispatch('updateAlbum', newData)
      }
    }
  }
</script>

<style lang="sass">
#edit-album
  min-height: 400px
  label
    font-weight: bold
    display: block
    width: 100%
    padding-top: 5px
  input
    border: 1px solid #000
    background: #888
    border-radius: none
    &:focus
      border: 2px solid #000
      background: #999
  input[type=text]
    width: 100%
    padding: 5px
    -webkit-box-sizing: border-box
    -moz-box-sizing: border-box
    box-sizing: border-box

.multiselect
  border-radius: 0
  .multiselect__tags
    border: 1px solid #000
    background: #888
    border-radius: 0
    padding: 0
    &:focus
      border: 2px solid #000
      background: #999
    .multiselect__input, .multiselect__single
      border: none !important
      border-radius: 0
      background: #888
      &:focus, &:hover
        background: #000
  .multiselect__content
    background: #888
    border-radius: 0
    border: 1px solid #000
    .multiselect__option
      background: #888
    .multiselect__option--active
      background: yellow
    .multiselect__option--highlight
      background: #666
      &::after
        background: red
</style>