<template>
  <div id="playlist">
    <!-- dummy icons to get cloned by jQuery when adding it -->
    <icon scale="1" name="bars" class="dummy-sort-handle" style="display: none"></icon>
    <icon scale="0.75" name="volume-up" class="dummy-now-playing-icon" style="display: none"></icon>

    <h1>{{ $t('components.Playlist.playlist') }}</h1>
    {{ this.$store.state.player.autoPlaylist }}<br>
    <span v-if="isPlaylistEmpty">Playlist empty</span>
    <span v-else-if="autoPlaylistClickable" @click="toggleAutoPlaylistState()">Start/stop</span>
    <span v-else>Waiting</span>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th class="absorbing-column">Title</th>
          <th class="sort-handle-column"></th>
        </tr>
      </thead>
      <tbody id="playlist-body">
        <tr v-if="!playlist.length"><td colspan="3" style="padding: 5px;">{{ $t('components.Playlist.playlistEmpty') }}</td></tr>
        <!-- Filled with jQuery on create -->
        <tr><td colspan="3">&nbsp;</td></tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { trackGetters } from '../../mixins/getters/trackGetters.js'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/volume-up'
import 'vue-awesome/icons/bars'
var jQuery = require('jquery')
require('jquery-ui')

export default {
  data: function () {
    return {
      // Contains track objects mapped from store playlist track IDs
      playlist: []
    }
  },
  components: {
    Icon
  },
  mixins: [trackGetters],
  methods: {
    ...mapActions(['playerUpdatePlaylist', 'playerSetNowPlaying', 'playerSetState']),
    ...mapGetters(['getNowPlayingId', 'getPlaylistTracks']),
    toggleAutoPlaylistState: function () {
      // TODO change
      this.$store.dispatch('toggleAutoPlaylistState', { seedTrackIds: this.playlist.slice(-1)[0].id })
    },
    repairPlaylist: function () {
      // Compute and add playlist order
      jQuery('.playlist-item').each((index, el) => {
        var e = jQuery(el)
        e.children().first().html(index + 1 + '.')
      })
      jQuery('.ui-sortable-helper').remove() // fixes helper sometimes stuck on top
      this.playlistItemsAfterAdd()
    },
    // Modify playlist elements
    playlistItemsAfterAdd: function () {
      var self = this
      jQuery('.playlist-item').each(function (i, item) {
        // Add sort handles for playlist table rows
        jQuery(item).find('td:last').html('').append(jQuery('.dummy-sort-handle').clone().removeClass('dummy-sort-handle').addClass('sort-handle'))
        // Make the rows double-clickable to allow playing
        jQuery(item).unbind('dblclick').dblclick(function () {
          self.playerSetNowPlaying({ id: jQuery(item).data('trackid') })
          self.playerSetState({ state: 'playing' })
        })
      })
    },
    // When DOM changes (e.g. something is dropped), update the playlist data structures
    updatePlaylistFromDOM: function () {
      // Collect playlist ids from the DOM table
      var newPlaylist = []
      newPlaylist = jQuery.map(jQuery('.playlist-item'), function (i) {
        return jQuery(i).data('trackid')
      })
      // Update playlist structure
      this.$nextTick(() => {
        // Update playlist in store
        this.playerUpdatePlaylist({
          playlist: newPlaylist
        })
        // Get playlist tracks from store, update playlist structure
        this.$set(this, 'playlist', this.getPlaylistTracks())
      })
    },
    addNewTracksFromAutoplaylist: function () {
      var self = this
      var newTrackIds = this.$store.state.player.autoPlaylist.newTracks
      if (newTrackIds.length > 0) {
        this.playerUpdatePlaylist({
          playlist: self.playlist.map(t => t.id).concat(newTrackIds)
        })
        this.$set(this, 'playlist', this.getPlaylistTracks())
        var newTracks = newTrackIds.map(id => self.getTrack(id))
        newTracks.forEach(track => {
          self.appendTrackRowToPlaylist(track)
        })
      } else {
        // TODO display info msg that there are no new songs available
        this.toggleAutoPlaylistState()
      }
    },
    appendTrackRowToPlaylist: function (track) {
      var tableRow = jQuery(`
        <tr data-trackid=${track.id}>
          <td></td>
          <td>${track.title}</td>
          <td class="sort-handle-column"></td>
        </tr>
      `).addClass('playlist-item')
      jQuery('#playlist-body').append(tableRow)
      this.repairPlaylist()
    },
    addNowPlayingStyles: function (nowPlayingJqueryTableRowSelector) {
      nowPlayingJqueryTableRowSelector.addClass('now-playing')
      jQuery('.now-playing-icon').remove()
      nowPlayingJqueryTableRowSelector.children().eq(1).prepend(jQuery('.dummy-now-playing-icon').clone().removeClass('dummy-now-playing-icon').addClass('now-playing-icon').css('display', 'inline').css('margin', '0 2px'))
    }
  },
  computed: {
    getNewAutoPlaylistTracks: function () {
      return this.$store.state.player.autoPlaylist.newTracks
    },
    isPlaylistEmpty: function () {
      return this.playlist.length === 0
    },
    autoPlaylistClickable: function () {
      var state = this.$store.state.player.autoPlaylist.state
      return state === 'active' || state === 'inactive'
    },
    nowPlayingTrackId: function () {
      return this.getNowPlayingId()
    },
    nowPlayingPlaylistPosition: function () {
      return this.$store.state.player.playlist.indexOf(this.nowPlayingTrackId)
    }
  },
  watch: {
    // Obtained new tracks from autoplaylist?
    getNewAutoPlaylistTracks: function () {
      this.addNewTracksFromAutoplaylist()
    },
    nowPlayingPlaylistPosition: function () {
      // AutoPlaylist
      // Get new songs when the playlist position is 3 tracks from the end or less
      if (this.$store.state.player.autoPlaylist.state === 'active' && this.nowPlayingPlaylistPosition >= this.playlist.length - 2) {
        // TODO? might cause problems in some special situations
        this.$store.dispatch('getAutoPlaylistData', { seedTrackIds: this.playlist.slice(-1)[0].id })
      }
    },
    nowPlayingTrackId: function () {
      // Add now playing styles to currently playing playlist item
      jQuery('.playlist-item').removeClass('now-playing')
      if (this.nowPlayingPlaylistPosition === -1) return
      this.addNowPlayingStyles(jQuery('.playlist-item').eq(this.nowPlayingPlaylistPosition))
    }
  },
  created: function () {
    // Set playlist structure from store
    this.$set(this, 'playlist', this.getPlaylistTracks())
    var self = this
    // On document ready:
    jQuery(() => {
      // Fill playlist table with rows from the playlist structure
      self.playlist.forEach(track => {
        // Init playlist track DOM table rows
        self.appendTrackRowToPlaylist(track)
        // For now playing track add icon and appropriate classes
        if (track.id === self.nowPlayingTrackId) {
          self.addNowPlayingStyles(jQuery(`.playlist-item[data-trackid=${track.id}]`))
        }
      })

      // Init playlist sorting and selecting
      jQuery('#playlist-body').selectable({
        cancel: '.sort-handle',
        items: '.playlist-item'
      }).sortable({
        items: '.playlist-item',
        handle: '.sort-handle',
        placeholder: 'ui-sortable-placeholder',
        axis: 'y',
        tolerance: 'pointer',
        dropOnEmpty: true,
        helper: (e, item) => {
          var table = item.parent()
          if (!item.hasClass('ui-selected')) {
            table.children('.ui-selected').removeClass('ui-selected')
            item.addClass('ui-selected')
          }
          var selected = table.children('.ui-selected').clone()
          item.data('multidrag', selected).siblings('.ui-selected').remove()
          return jQuery('<tr/>')
        },
        stop: (e, ui) => {
          var addedItem = ui.item
          if (addedItem.data('multidrag')) {
            var selected = addedItem.data('multidrag')
            addedItem.after(selected)
            addedItem.remove()
          }
          self.repairPlaylist()
          self.updatePlaylistFromDOM()
        },
        update: (e, ui) => {
          self.updatePlaylistFromDOM()
        }
      })

      // Bind delete key to playlist items
      jQuery(document).keyup(event => {
        if (event.keyCode === 46) { // delete key
          jQuery('.playlist-item.ui-selected').remove()
          self.repairPlaylist()
          self.updatePlaylistFromDOM()
        }
      })
    })
  }
}
</script>

<style lang="sass">
#playlist
  cursor: default
  overflow: auto
  height: 50%
  h1
    margin: 5px 0
    padding: 0
    font-size: 120%
  table
    width: 100%
    border-collapse: collapse
    font-size: 100%
    thead
      th
        text-align: left
    tbody
      tr.playlist-item
        border-bottom: 1px solid #000
        height: 30px
        width: 100%
        &:hover
          background: #888
        td
          text-align: left
          padding: 2px
          overflow: hidden
          white-space: nowrap
          text-overflow: ellipsis
          max-width: 0
          &:first-child
            width: 20px
        .absorbing-column
          width: 100%
          white-space: nowrap
      .sort-handle-column
      .sort-handle
        cursor: ns-resize
        display: none
      .ui-sortable-placeholder
        width: 100%
        background: #252525
        height: 30px
      .ui-sortable-helper
        background: #555
        opacity: 0.8
        box-shadow: 7px 7px 23px 0px rgba(0, 0, 0, 0.65)
        z-index: 1000
      tr.ui-selected, tr.ui-selecting
        background: #666
        &:hover
          background: #888
        .sort-handle
          display: inline !important
      .dragged-item
        opacity: .5
  .now-playing
    color: #FF3030
</style>