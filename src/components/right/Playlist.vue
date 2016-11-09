<template>
  <div id="playlist">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th class="absorbing-column">Title</th>
        </tr>
      </thead>  
      <tbody is="draggable" element="tbody" :list="playlist" :options="{animation: 200, ghostClass: 'draggable-ghost', chosenClass: 'draggable-drag'}" @update="playerUpdatePlaylist({playlist})">
        <!-- @update, @add, ... -->
        <tr class="playlist-item" v-for="(element, index) in playlist" v-bind:class="{ 'now-playing': isNowPlaying(element.id) }">
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
      playlist: []
    }
  },
  components: {
    Draggable
  },
  methods: {
    ...mapActions(['playerUpdatePlaylist']),
    isNowPlaying: function (trackId) {
      return (this.getNowPlayingId === trackId)
    }
  },
  computed: {
    ...mapGetters({
      playlist: 'getPlaylistTracks'
    }),
    ...mapGetters(['getNowPlayingId'])
  }
}
</script>

<style lang="sass" scoped>
#playlist
  cursor: default
  table
    width: 100%
    table-layout: auto
    border-collapse: collapse
    th, td
      text-align: left
    td.absorbing-column
      width: 100%
    .playlist-item
      //padding: 6px 10px 4px 10px
      border-bottom: 1px solid #000
  .draggable-drag
    background: pink
    opacity: 0.5
  .draggable-ghost
    background: red
    opacity: 1
  .now-playing
    font-weight: bold
</style>