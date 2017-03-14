<template>
  <div id="playlist">
    <!-- dummy icons to get cloned by jQuery when adding it -->
    <icon scale="1" name="bars" class="dummy-sort-handle" style="display: none"></icon>
    <icon scale="0.75" name="volume-up" class="dummy-now-playing-icon" style="display: none"></icon>

    <div class="icons">
      <span v-if="isPlaylistEmpty" :title="$t('components.Playlist.autoPlaylistEmpty')" @click="autoPlaylistMsg('empty')" class="action">
        <icon scale="1.2" name="circle-o"></icon>
      </span>
      <span v-else-if="autoPlaylistClickable" @click="toggleAutoPlaylistState()" class="action">
        <div v-if="autoPlaylistActive" @click="autoPlaylistMsg('stopped')" :title="$t('components.Playlist.autoPlaylistStop')">
          <icon scale="1.2" name="stop-circle"></icon>
        </div>
        <div v-else @click="autoPlaylistMsg('started')" :title="$t('components.Playlist.autoPlaylistStart')">
          <icon scale="1.2" name="play-circle"></icon>
        </div>
      </span>
      <span v-else :title="$t('components.Playlist.autoPlaylistWaiting')">
        <icon scale="1.2" name="circle-o-notch" spin></icon>
      </span>
      <span class="action" @click="clearPlaylist()" :title="$t('components.Playlist.autoPlaylistWaiting')">
        <icon scale="1.2" name="trash">
      </span>
      <span class="action">
        <icon scale="1.2" name="floppy-o" :title="$t('components.Playlist.savePlaylist')">
      </span>
      <span class="action">
        <icon scale="1.2" name="list" :title="$t('components.Playlist.loadPlaylist')">
      </span>
    </div>

    <h1>{{ $t('components.Playlist.playlist') }}</h1>

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
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { trackGetters } from '../../mixins/getters/trackGetters.js'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons'
var jQuery = require('jquery')
require('jquery-ui')
var _ = require('lodash')

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
      if (!this.autoPlaylistActive) {
        // Play, seedIds: try selected items first, then the last item of the playlist
        var seedIds = jQuery.map(jQuery('.playlist-item.ui-selected'), item => { return jQuery(item).data('trackid') })
        if (!seedIds || !seedIds.length) {
          seedIds = this.playlist.slice(-1)[0].id
        }
        this.$store.dispatch('toggleAutoPlaylistState', { seedTrackIds: seedIds })
      } else {
        // Stop
        this.$store.dispatch('toggleAutoPlaylistState')
      }
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
      var newTrackIds = _.compact(this.$store.state.player.autoPlaylist.newTracks)
      if (newTrackIds.length > 0) {
        this.playerUpdatePlaylist({
          playlist: self.$store.state.player.playlist.concat(newTrackIds)
        })
        this.$set(this, 'playlist', this.getPlaylistTracks())
        var newTracks = newTrackIds.map(id => self.getTrack(id))
        newTracks.forEach(track => {
          if (track) { self.appendTrackRowToPlaylist(track) }
        })
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
    },
    autoPlaylistMsg: function (type) {
      switch (type) {
        case 'empty':
          this.$store.dispatch('setInfoPanelMsg', this.$t('components.Playlist.autoPlaylistEmpty'))
          break
        case 'started':
          this.$store.dispatch('setInfoPanelMsg', this.$t('components.Playlist.autoPlaylistStarted'))
          break
        case 'stopped':
          this.$store.dispatch('setInfoPanelMsg', this.$t('components.Playlist.autoPlaylistStopped'))
      }
      this.$store.dispatch('showInfoPanel')
    },
    clearPlaylist: function () {
      var conf = window.confirm(this.$t('components.Playlist.confirmClear'))
      if (conf === true) {
        this.playerUpdatePlaylist({ playlist: [] })
        this.$set(this, 'playlist', [])
        jQuery('.playlist-item').remove()
      }
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
    },
    autoPlaylistActive: function () {
      return this.$store.state.player.autoPlaylist.state === 'active'
    }
  },
  watch: {
    // Obtained new tracks from autoplaylist?
    getNewAutoPlaylistTracks: function () {
      if (this.autoPlaylistActive) {
        if (this.getNewAutoPlaylistTracks.length === 0) {
          this.$store.dispatch('stopAutoPlaylist')
          this.$store.dispatch('setInfoPanelMsg', this.$t('infoPanel.autoPlaylistNoSongsAvailable'))
          this.$store.dispatch('showInfoPanel')
        } else {
          this.addNewTracksFromAutoplaylist()
        }
      }
    },
    nowPlayingPlaylistPosition: function () {
      // AutoPlaylist
      // Get new songs when the playlist position is 3 tracks from the end or less
      if (this.autoPlaylistActive && this.nowPlayingPlaylistPosition >= this.playlist.length - 2) {
        // TODO? might cause problems in some special situations
        var id = (this.playlist.slice(-1)[0]) ? (this.playlist.slice(-1)[0].id) : -1
        if (id !== -1) {
          this.$store.dispatch('getAutoPlaylistData', { seedTrackIds: id })
        } else {
          this.$store.dispatch('stopAutoPlaylist')
        }
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
    margin: 0 0
    padding: 0
    font-size: 130%
  table
    width: 100%
    border-collapse: collapse
    font-size: 100%
    margin-top: 5px
    thead
      border-bottom: 1px solid #000
      th
        padding: 2px 0
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
  .icons
    float: right
    .action
      margin-right: 5px
      div
        display: inline-block
      &:hover
        color: red
</style>