<template>
  <div id="playlist">
    <h1>{{ $t('components.Playlist.playlist') }}</h1>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th class="absorbing-column">Title</th>
        </tr>
      </thead>
      <tbody is="draggable" element="tbody" :list="playlist" :options="{animation: 200, ghostClass: 'draggable-ghost', chosenClass: 'draggable-drag'}" @update="playerUpdatePlaylist({playlist})">
        <!-- @update, @add, ... -->
        <tr class="playlist-item" v-for="(track, index) in playlist" v-bind:class="{'now-playing': isNowPlaying(track.id)}" v-on:dblclick="playerSetNowPlaying({id: track.id})">
          <td>{{index + 1}}.</td>
          <td class="absorbing-column">
            <icon scale="0.75" name="volume-up" v-if="isNowPlaying(track.id)" style="margin: 0 2px"></icon>
            {{track.title}}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'
import { trackGetters } from '../../mixins/getters/trackGetters.js'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/volume-up'

export default {
  data: function () {
    return {
      playlist: []
    }
  },
  components: {
    Draggable,
    Icon
  },
  mixins: [trackGetters],
  methods: {
    ...mapActions(['playerUpdatePlaylist', 'playerSetNowPlaying']),
    ...mapGetters(['getNowPlayingId', 'getPlaylistTracks'])
  },
  computed: {
    playlist: function () {
      return this.getPlaylistTracks()
    }
  }
}
</script>

<style lang="sass" scoped>
#playlist
  cursor: default
  overflow: auto
  h1
    margin: 5px 0
    padding: 0
    font-size: 120%
  table
    width: 100%
    margin-bottom: 20px
    table-layout: auto
    border-collapse: collapse
    tr
      border-bottom: 1px solid #000
      th, td
        text-align: left
      td.absorbing-column
        width: 100%
  .draggable-drag
    background: pink
    opacity: 0.5
  .draggable-ghost
    background: red
    opacity: 1
  .now-playing
    font-weight: bold
</style>