<template>
  <div id="top-panel">
    <ul id="top-menu">
      <li>
        <div v-on:click="$root.state.mainPanelView='AlbumArts'">{{ $t('components.AlbumArts.name') }}</div>
      </li>
      <li>
        <div v-on:click="$root.state.mainPanelView='GenresArtistsGraph'">{{ $t('components.GenresArtistsGraph.name') }}</div>
      </li>
      <li>
        <div v-on:click="$root.state.mainPanelView='ArtistsArtistsGraph'">{{ $t('components.ArtistsArtistsGraph.name') }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {

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
  li
    display: inline-block
    padding: 14px 16px
    cursor: pointer
    &:hover
      background: white
</style>
