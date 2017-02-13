<template>
  <div id="main-panel">
    <modal-actions></modal-actions>
    <transition name="component-fade" mode="out-in">
      <keep-alive>
        <component :is="this.$store.state.view.mainPanelView"></component>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import AlbumsAlbumsGraph from './main/AlbumsAlbumsGraph.vue'
import ArtistsAlbumArts from './main/ArtistsAlbumArts.vue'
import ArtistsAlbumDetails from './main/ArtistsAlbumDetails.vue'
import ArtistAlbumsGraph from './main/ArtistAlbumsGraph.vue'
import ArtistsArtistsGraph from './main/ArtistsArtistsGraph.vue'
import GenresAlbumsGraph from './main/GenresAlbumsGraph.vue'
import ModalActions from './misc/ModalActions.vue'

export default {
  components: {
    AlbumsAlbumsGraph,
    ArtistsAlbumArts,
    ArtistsAlbumDetails,
    ArtistsArtistsGraph,
    GenresAlbumsGraph,
    ArtistAlbumsGraph,
    ModalActions
  }
}
</script>

<style lang="sass" scoped>
$top-height: 47px
$bottom-height: 80px
$top-offset: calc(#{$top-height} + 1px)
$bottom-offset: calc(#{$bottom-height} + 1px)
$panel-height: calc(100% - #{$top-offset} - #{$bottom-offset})
#main-panel
  position: fixed
  top: $top-offset
  min-height: min-content
  height: $panel-height
  width: calc(100% - 300px)
  background: #444
  float: left
</style>
