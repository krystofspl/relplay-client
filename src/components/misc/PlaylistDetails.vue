<template>
  <div class="playlist-details">
    <h3>{{ $t('components.EditPlaylist.tracksList') }}</h3>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Artist</th>
          <th class="absorbing-column">Title</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="playlist-tracks-body">
        <tr class="track-item" v-for="(track, index) in tracks" :class="{'now-playing': getNowPlayingId === track.id}" :data-trackid="track.id">
          <td>{{ track.position + 1 }}.</td>
          <td>{{ getArtistForTrack(track.id).name }}</td>
          <td class="absorbing-column">
            {{ track.title }}
          </td>
          <td><icon scale="1" name="bars" class="drag-handle"></icon></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { playlistGetters } from '../../mixins/getters/playlistGetters.js'
import { trackGetters } from '../../mixins/getters/trackGetters.js'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/bars'
var _ = require('lodash')
var jQuery = require('jquery')
require('jquery-ui')

export default {
  components: {
    Icon
  },
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
  },
  created: function () {
    // TODO this is very similar to AlbumDetails function and is dependent on main playlist DOM structure
    jQuery(() => {
      jQuery('.playlist-tracks-body').selectable({
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
          var multidrag = []
          jQuery('.playlist-tracks-body tr.ui-selected').each((index, element) => {
            multidrag.push(jQuery(`
              <tr class="playlist-item" data-trackid="${jQuery(element).data('trackid')}">
                <td>${index + 1}.</td>
                <td>${jQuery(element).children()[2].innerText}</td>
                <td></td>
              </tr>
            `))
          })
          var helper = jQuery('<tr class="drag-helper"><td colspan="3">' + multidrag.length + ' tracks</td></tr>')
          helper.data('multidrag', multidrag)
          helper.data('draggable-type', 'track')
          return helper
        }
      })
    })
  }
}
</script>

<style lang="sass" scoped>
.playlist-details
  table
    width: 100%
    table-layout: auto
    border-collapse: collapse
    thead
      th
        text-align: left
    tbody
      tr.track-item
        cursor: default
        border-bottom: 1px solid #000
        height: 30px
        width: 100%
        &:hover
          background: #888
        td
          text-align: left
        .absorbing-column
        .drag-handle
          cursor: move
          display: none
          margin: 0 2px
      tr.ui-selected, tr.ui-selecting
        background: #454545
        .drag-handle
          display: inline !important
</style>