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
        <tr class="playlist-item" v-for="(element, index) in playlist" v-bind:class="{'now-playing': isNowPlaying(element.id)}" v-on:dblclick="playerSetNowPlaying({id: element.id})">
          <td>{{index}}.</td>
          <td class="absorbing-column">{{element.title}}</td>
        </tr>
      </tbody>
    </table>  
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import { mapGetters, mapActions } from 'vuex'

export default {
  data: function () {
    return {
      playlist: this.$store.getters.getPlaylistTracks
    }
  },
  components: {
    Draggable
  },
  methods: {
    ...mapActions(['playerUpdatePlaylist', 'playerSetNowPlaying']),
    isNowPlaying: function (trackId) {
      return (this.getNowPlayingId === trackId)
    }
  },
  computed: {
    ...mapGetters(['getNowPlayingId'])
  }
}
</script>

<style lang="sass" scoped>
#playlist
  cursor: default
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