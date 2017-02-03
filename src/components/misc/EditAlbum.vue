<template>
  <div id="edit-album">
    <label>{{ $t('components.AlbumDetails.albumTitle') }}</label>
    <input type="text" name="title" v-model="title">

    <label for="inInbox">{{ $t('components.AlbumDetails.inInbox') }}</label>
    <input type="checkbox" name="inInbox" v-model="inInbox">

    <label for="mainArtist">{{ $t('components.AlbumDetails.mainArtist') }}</label>
    <multiselect name="mainArtist" v-model="mainArtist"
      :options="availableArtists"
      :value="mainArtist"
      :allow-empty="false"
      :multiple="false"
      :max-height="120"
      :hide-selected="true"
      track-by="id"
      label="name"
      ></multiselect>

    <label for="artists">{{ $t('components.AlbumDetails.artists') }}</label>
    <multiselect name="artists" v-model="artists"
      :options="availableArtists"
      :value="artists"
      :allow-empty="true"
      :multiple="true"
      :hide-selected="true"
      :close-on-select="false"
      :max-height="120"
      track-by="name"
      label="name"
      ></multiselect>

    <label for="genres">{{ $t('components.AlbumDetails.genres') }}</label>
    <a href="#" @click="setModalEntity({genreId: null}); setModalAction('editGenre')">{{ $t('components.EditAlbum.editGenres') }}</a>
    <multiselect name="genres" v-model="genres"
      :options="availableGenres"
      :value="genres"
      :allow-empty="true"
      :multiple="true"
      :hide-selected="true"
      :close-on-select="false"
      :max-height="120"
      label="title"
      track-by="title"
      ></multiselect>
    <br><br><br>
    <button v-on:click="submit()" style="float: right; font-weight: bold;">Save</button>
    <br><br><br><br>
  </div>
</template>

<script>
  import { artistGetters } from '../../mixins/getters/artistGetters.js'
  import { albumGetters } from '../../mixins/getters/albumGetters.js'
  import { trackGetters } from '../../mixins/getters/trackGetters.js'
  import { genreGetters } from '../../mixins/getters/genreGetters.js'
  import { mapGetters, mapActions } from 'vuex'
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
        artists: [],
        genres: []
      }
    },
    props: ['album'],
    mixins: [artistGetters, albumGetters, genreGetters, trackGetters],
    components: {
      Icon,
      Multiselect
    },
    computed: {
      availableArtists: function () {
        return Object.values(this.getArtists()).sort((a, b) => { return a.name.localeCompare(b.title) })
      },
      availableGenres: function () {
        return Object.values(this.getGenres()).sort((a, b) => { return a.title.localeCompare(b.title) })
      },
      tracks: function () {
        return this.getTracksForAlbum(this.album.albumId)
      }
    },
    methods: {
      ...mapGetters(['getArtists', 'getGenres']),
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
        if (this.inInbox !== this.album.inInbox) {
          newData.inInbox = this.inInbox
        }
        if (this.mainArtist && this.mainArtist.id !== this.album.mainArtist) {
          newData.mainArtist = this.mainArtist.id
        }
        if (!_.isEqual(this.artists.map(i => i.id).sort(), this.album.artists.sort())) {
          newData.artists = this.artists.map(a => a.id)
        }
        if (!_.isEqual(this.genres.map(i => i.id).sort(), this.album.genres.sort())) {
          newData.genres = this.genres.map(g => g.id)
        }
        // Send
        this.$store.dispatch('updateAlbum', newData)
        this.setModalAction('showAlbum')
      }
    },
    created: function () {
      var self = this
      this.mainArtist = this.getArtist(this.album.mainArtist)
      this.artists = this.album.artists.map(artistId => {
        return self.getArtist(artistId)
      })
      this.genres = this.album.genres.map(genreId => {
        return self.getGenre(genreId)
      })
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
  button
    border: 1px solid #000
    background: #888
    padding: 10px
    &:hover
      border: 1px solid #CCC
  input
    border: 1px solid #000
    background: #888
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

.multiselect
  border-radius: 0
  .multiselect__tags
    border: 1px solid #000
    background: #888
    border-radius: 0
    padding: 0
    &:hover
      border: 1px solid #CCC
    .multiselect__input, .multiselect__single
      border: none !important
      border-radius: 0
      background: #888
      &:focus, &:hover
        background: #000
    span.multiselect__tag
      background: #666
      border: 1px solid #333
      margin: 2px 0 0 2px
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