<template>
  <div id="top-panel">
    <ul id="top-menu">
      <li>
        <div v-on:click="switchMainPanelView('AlbumArts')">{{ $t('components.AlbumArts.name') }}</div>
      </li>
      <li>
        <div v-on:click="switchMainPanelView('GenresArtistsGraph')">{{ $t('components.GenresArtistsGraph.name') }}</div>
      </li>
      <li>
        <div v-on:click="switchMainPanelView('ArtistsArtistsGraph')">{{ $t('components.ArtistsArtistsGraph.name') }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions(['switchMainPanelView'])
  }
}
</script>

<style lang="sass" scoped>
#top-panel
  height: 50px
  width: calc(100% - 300px)
  background: red
  position: fixed
  top: 0
  left: 0

  ul#top-menu
    list-style-type: none
    margin: 0
    padding: 0
    overflow-x: scroll
    white-space: nowrap
    li
      display: inline-block
      padding: 9px 16px
      cursor: pointer
      &:hover
        background: white
</style>
