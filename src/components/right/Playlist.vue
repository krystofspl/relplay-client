<template>
  <div id="playlist">
    <!-- dummy icons to get cloned by jQuery when adding it -->
    <icon scale="1" name="bars" class="dummy-sort-handle" style="display: none"></icon>
    <icon scale="0.75" name="volume-up" class="dummy-now-playing-icon" style="display: none"></icon>

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
        <!-- Filled with jQuery on create -->
        <tr><td>&nbsp;</td><td></td><td></td></tr>
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
      playlist: []
    }
  },
  components: {
    Icon
  },
  mixins: [trackGetters],
  methods: {
    ...mapActions(['playerUpdatePlaylist', 'playerSetNowPlaying']),
    ...mapGetters(['getNowPlayingId', 'getPlaylistTracks']),
    repairPlaylist: function () {
      jQuery('.playlist-item').each((index, el) => {
        var e = jQuery(el)
        e.children().first().html(index + 1 + '.')
      })
      jQuery('.ui-sortable-helper').remove() // fixes helper sometimes stuck on top
      this.playlistItemsAfterAdd()
    },
    playlistItemsAfterAdd: function () {
      var self = this
      jQuery('.playlist-item').each(function (i, item) {
        jQuery(item).find('td:last').html('').append(jQuery('.dummy-sort-handle').clone().removeClass('dummy-sort-handle').addClass('sort-handle'))
        jQuery(item).unbind('dblclick').dblclick(function () {
          self.playerSetNowPlaying({ id: jQuery(item).data('trackid') })
        })
      })
    },
    updatePlaylistFromDOM: function () {
      // Collect playlist ids from the DOM table
      var newPlaylist = []
      newPlaylist = jQuery.map(jQuery('.playlist-item'), function (i) {
        return jQuery(i).data('trackid')
      })
      // Update playlist in store
      this.$nextTick(() => {
        this.playerUpdatePlaylist({
          playlist: newPlaylist
        })
        this.$set(this, 'playlist', this.getPlaylistTracks())
      })
    }
  },
  computed: {
    nowPlayingTrackId: function () {
      return this.getNowPlayingId()
    },
    nowPlayingPlaylistPosition: function () {
      return this.$store.state.player.playlist.indexOf(this.nowPlayingTrackId)
    }
  },
  watch: {
    nowPlayingTrackId: function () {
      // Add now playing styles to currently playing playlist item
      jQuery('.playlist-item').removeClass('now-playing')
      var nowPlayingItem = jQuery('.playlist-item').eq(this.nowPlayingPlaylistPosition)
      nowPlayingItem.addClass('now-playing')
      jQuery('.now-playing-icon').remove()
      nowPlayingItem.children().eq(1).prepend(jQuery('.dummy-now-playing-icon').clone().removeClass('dummy-now-playing-icon').addClass('now-playing-icon').css('display', 'inline').css('margin', '0 2px'))
    }
  },
  created: function () {
    this.$set(this, 'playlist', this.getPlaylistTracks())
    var self = this
    jQuery(() => {
      self.playlist.forEach((track, index) => {
        // Init playlist track DOM table rows
        var tableRow = jQuery(`
          <tr data-trackid=${track.id}>
            <td>${index + 1}.</td>
            <td>${track.title}</td>
            <td class="sort-handle-column"></td>
          </tr>
        `).addClass('playlist-item')
        jQuery('#playlist-body').append(tableRow)
        if (track.id === self.nowPlayingTrackId) {
          var nowPlayingItem = jQuery(`.playlist-item[data-trackid=${track.id}]`)
          nowPlayingItem.addClass('now-playing')
          nowPlayingItem.children().eq(1).prepend(jQuery('.dummy-now-playing-icon').clone().removeClass('dummy-now-playing-icon').addClass('now-playing-icon').css('display', 'inline').css('margin', '0 2px'))
        }
      })

      self.playlistItemsAfterAdd()

      // Init playlist sorting and selecting
      jQuery('#playlist-body').selectable({
        cancel: '.sort-handle',
        items: '.playlist-item'
      }).sortable({
        items: '.playlist-item',
        handle: '.sort-handle',
        placeholder: 'ui-sortable-placeholder',
        axis: 'y',
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
        receive: (e, ui) => {
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
    tbody
      tr.playlist-item
        border-bottom: 1px solid #000
        height: 30px
        width: 100%
        &:hover
          background: #888
        th, td
          text-align: left
        td
          padding: 4px
        .absorbing-column
          width: 100%
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
    font-weight: bold
</style>