<template>
  <div class="album-details">
    <div class="col-left">
      <div class="album-art">
        <img v-if="getAlbumArtImgPath(album.id).length" :src="getAlbumArtImgPath(album.id)">
        <img v-else src="http://www.baxter.com/assets/images/products/Renal/thumb_image_not_available.png">
      </div>
      <div class="album-info">
        <strong>Album info</strong><br>
        <div v-if="album.inInbox">
          <i>
            {{ $t('components.AlbumDetails.inboxWarning') }}
            <a href="#" @click="moveToLibrary(album.id)">{{ $t('components.AlbumDetails.inboxAdd') }}</a>
          </i>
        </div>
        {{ $t('components.AlbumDetails.albumTitle') }}: <strong>{{ album.title }}</strong><br>
        {{ $t('components.AlbumDetails.artistName') }}: <strong>{{ mainArtist.name }}</strong><br>
        <div v-if="artists.length">
          {{ $t('components.AlbumDetails.artists') }}:
          <span v-for="otherArtist in artists">
            <strong>{{ otherArtist.name }}</strong>&nbsp;
          </span>
        </div>
        {{ $t('components.AlbumDetails.year') }}: <strong>{{ album.year }}</strong><br>
        {{ $t('components.Labels.headingAlbum') }}: <labels :entity-type="'album'" :entity-id="album.id"></labels>
        <div v-if="genres.length">
          {{ $t('components.AlbumDetails.genres') }}:
          <span v-for="genre in genres">
            <span class="genre" v-bind:style="{ background: genre.color, color: getFontColorForBG(genre.color) }">{{ genre.title }}</span>
          </span>
        </div>
      </div>
    </div>
    <div class="col-right">
      <strong>Tracks</strong>
      <table>
      <thead>
        <tr>
          <th>#</th>
          <th class="absorbing-column">Title</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="tracks-body">
        <tr class="track-item" v-for="(track, index) in tracks" v-bind:class="{'now-playing': getNowPlayingId === track.id}" v-bind:data-trackid="track.id">
          <td>{{index + 1}}.</td>
          <td class="absorbing-column">
            <icon scale="0.75" name="volume-up" v-if="getNowPlayingId === track.id" style="margin: 0 2px"></icon>
            {{track.title}}
          </td>
          <td><icon scale="1" name="bars" class="drag-handle"></icon></td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>

<script>
  import { artistGetters } from '../../mixins/getters/artistGetters.js'
  import { albumGetters } from '../../mixins/getters/albumGetters.js'
  import { trackGetters } from '../../mixins/getters/trackGetters.js'
  import { genreGetters } from '../../mixins/getters/genreGetters.js'
  import { common } from '../../mixins/common.js'
  import { mapGetters } from 'vuex'
  import Labels from '../misc/Labels.vue'
  import Icon from 'vue-awesome/components/Icon'
  import 'vue-awesome/icons/volume-up'
  import 'vue-awesome/icons/bars'
  var jQuery = require('jquery')
  require('jquery-ui')

  export default {
    props: ['album-id'],
    mixins: [artistGetters, albumGetters, trackGetters, genreGetters, common],
    components: {
      Icon,
      Labels
    },
    computed: {
      ...mapGetters(['getNowPlayingId']),
      mainArtist: function () {
        return this.getArtist(this.album.mainArtist)
      },
      artists: function () {
        var self = this
        return this.album.artists.map(a => { return self.getArtist(a) })
      },
      album: function () {
        return this.getAlbum(this.albumId)
      },
      tracks: function () {
        return this.getTracksForAlbum(this.albumId)
      },
      genres: function () {
        var self = this
        return this.album.genres.map(g => { return self.getGenre(g) })
      }
    },
    methods: {
      moveToLibrary: function (albumId) {
        this.$store.dispatch('updateAlbum',
          {
            id: albumId,
            inInbox: false,
            callback: function (err, obj) {
              console.log(err)
              console.log(obj)
            }
          })
      }
    },
    created: function () {
      jQuery(() => {
        jQuery('.tracks-body').selectable({
          cancel: '.drag-handle',
          items: '.track-item'
        }).draggable({
          items: '.track-item',
          connectToSortable: '#playlist-body',
          revert: 'invalid',
          handle: '.drag-handle',
          cursorAt: { top: -5, left: -5 },
          containment: '#right-panel',
          helper: (e) => {
            var helper = jQuery('<tr class="drag-helper"><td colspan="3"/></tr>')
            var multidrag = []
            jQuery('.tracks-body tr.ui-selected').each((index, element) => {
              multidrag.push(jQuery(`
                <tr class="playlist-item" data-trackid="${jQuery(element).data('trackid')}">
                  <td>${index + 1}.</td>
                  <td>${jQuery(element).children()[1].innerText}</td>
                  <td></td>
                </tr>
              `))
            })
            helper.data('multidrag', multidrag)
            helper.data('draggable-type', 'track')
            return helper
          }
        })
      })
    }
  }
</script>

<style lang="sass">
.album-details
  .col-left
    float: left
    width: 60%
    .album-art
      float: left
      width: 40%
      margin-bottom: 10px
      img
        width: 100%
        border: 1px solid #000
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33)
        -webkit-box-reflect: below 0px -webkit-gradient(linear, left top, left bottom, from(transparent), to(rgba(250, 250, 250, 0.2)))
    .album-info
      text-align: left
      float: left
      width: 56%
      margin-left: 3%
      margin-right: 1%
      .genre
        border: 1px solid #000
        padding: 1px 3px
        border-radius: 3px
        margin-right: 2px
        font-size: 83%
  .col-right
    float: left
    width: 40%
    table
      width: 100%
      table-layout: auto
      border-collapse: collapse
      tbody
        tr.track-item
          cursor: default
          border-bottom: 1px solid #000
          height: 30px
          width: 100%
          &:hover
            background: #888
          th, td
            text-align: left
          .absorbing-column
            width: 100%
          .drag-handle
            cursor: move
            display: none
            margin: 0 2px
        tr.ui-selected, tr.ui-selecting
          background: #454545
          .drag-handle
            display: inline !important

  .now-playing
    font-weight: bold

</style>
