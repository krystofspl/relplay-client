<template>
  <div id="playlists">
    <div class="left">
      <h2>{{ $t('components.Playlists.savedPlaylistsHeading') }}</h2>
      <div class="filter-row">
        <input type="text" v-model="playlistNameFilter" :placeholder="$t('components.Playlists.filterByName')">
      </div>
      <div v-if="playlists.length" v-for="playlist in filteredPlaylists" @click="selectedPlaylistId = playlist.id" class="playlist-row" :class="{'selected': isSelected(playlist.id)}">
        {{ playlist.name }}
      </div>
      <div v-else>
        {{ $t('components.Playlists.noPlaylistsAvailable') }}
      </div>
    </div>
    <div class="right">
      <h2>{{ $t('components.Playlists.playlistDetailsHeading') }}</h2>
      <div v-if="selectedPlaylistId">
        <playlist-actions :playlist-id="selectedPlaylistId"></playlist-actions>
        <playlist-details :playlist-id="selectedPlaylistId"></playlist-details>
      </div>
      <div v-else>
        {{ $t('components.Playlists.nothingSelected') }}
      </div>
    </div>
  </div>
</template>

<script>
import PlaylistDetails from '../misc/PlaylistDetails.vue'
import PlaylistActions from '../misc/PlaylistActions.vue'
import { mapGetters } from 'vuex'
import { playlistGetters } from '../../mixins/getters/playlistGetters.js'
var _ = require('lodash')

export default {
  data: function () {
    return {
      selectedPlaylistId: null,
      playlistNameFilter: ''
    }
  },
  mixins: [ playlistGetters ],
  components: {
    PlaylistDetails,
    PlaylistActions
  },
  methods: {
    isSelected: function (artistId) {
      return this.selectedPlaylistId === artistId
    }
  },
  computed: {
    ...mapGetters(['getPlaylists']),
    filteredPlaylists: function () {
      return _.filter(this.playlists, obj => new RegExp(this.playlistNameFilter, 'i').test(obj.name))
    },
    playlists: function () {
      return _.values(this.getPlaylists)
    }
  },
  created: function () {
    if (this.playlists && this.playlists.length) {
      this.selectedPlaylistId = this.playlists[0].id
    }
  }
}
</script>

<style lang="sass" scoped>
#playlists
  background: #666
  color: #000
  height: 100%
  .left, .right
    height: 100%
    overflow: auto
    width: 45%
    padding: 10px
    display: inline-block
    vertical-align: top
    -webkit-box-sizing: border-box
    -moz-box-sizing: border-box
    box-sizing: border-box
  .left
    .filter-row, .playlist-row
      -webkit-box-sizing: border-box
      -moz-box-sizing: border-box
      box-sizing: border-box
      width: 100%
    .filter-row
      margin-bottom: 5px
    .playlist-row
      padding: 5px
      border-bottom: 1px solid #000
      &:hover
        background: white
  .right
    border-left: 1px solid #000
.selected
  font-weight: bold
  background: #565656
</style>