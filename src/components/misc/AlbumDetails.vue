<template>
  <div class="album-details">
    <div class="col-left">
      <div class="album-art">
        <img :src="getAlbumArtImgPath(album.id)" v-if="getAlbumArtImgPath(album.id).length">
      </div>
      <div class="album-info">
      <strong>Album info</strong>
        <div v-if="album.inInbox">
          <i>
            {{ $t('components.AlbumDetails.inboxWarning') }} 
            <a href="#">{{ $t('components.AlbumDetails.inboxAdd') }}</a>
          </i>
        </div>
        {{ $t('components.AlbumDetails.albumTitle') }}: <strong>{{ album.title }}</strong><br>
        {{ $t('components.AlbumDetails.artistName') }}: <strong>{{ artist.name }}</strong><br>
        <!-- TODO year -->
        {{ $t('components.AlbumDetails.year') }}: <strong>2005</strong><br>
        ... more data will be here ...
      </div>
    </div>
    <div class="col-right">
      <strong>Tracks</strong>
      <table>
      <thead>
        <tr>
          <th>#</th>
          <th class="absorbing-column">Title</th>
        </tr>
      </thead>
      <tbody>
        <tr class="playlist-item" v-for="(track, index) in tracks" v-bind:class="{'now-playing': isNowPlaying(track.id)}" v-on:dblclick="">
          <td>{{index + 1}}.</td>
          <td class="absorbing-column">{{track.title}}</td>
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
  import { mapGetters } from 'vuex'
  export default {
    props: ['album-id'],
    mixins: [artistGetters, albumGetters, trackGetters],
    computed: {
      artist: function () {
        console.log(this.album)
        return this.getArtist(this.album.artists[0])
      },
      album: function () {
        return this.getAlbum(this.albumId)
      },
      tracks: function () {
        return this.getTracksForAlbum(this.albumId)
      }
    },
    methods: {
      ...mapGetters(['getNowPlayingId']),
      isNowPlaying: function (trackId) {
        return (this.getNowPlayingId() === trackId)
      }
    }
  }
</script>

<style lang="sass" scoped>
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
      margin-left: 4%
  .col-right
    float: left
    width: 40%
    table
      width: 100%
      table-layout: auto
      border-collapse: collapse
      tr
        th, td
          text-align: left
        td.absorbing-column
          width: 100%
</style>
