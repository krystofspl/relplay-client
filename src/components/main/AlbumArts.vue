<template>
  <div class="album-arts">
    <div v-for="album in albumsInfinite" class="album-art" v-bind:class="{'selected': isSelected(album.id), 'album-art-inbox': album.inInbox}" @click="albumClick(album.id)" >
      <div class="content">
        <div class="album-art-img" :data-album="album.id">
          <img v-if="getAlbumArtImgPath(album.id).length" :src="getAlbumArtImgPath(album.id)">
          <img v-else src="http://www.baxter.com/assets/images/products/Renal/thumb_image_not_available.png">
        </div>
        <div class="album-title">
          {{ album.title }}
        </div>
      </div>
    </div>
    <infinite-loading :on-infinite="onInfinite" ref="inf">
      <span slot="no-more">
        <!-- {{ $t('infiniteScroll.noMore') }} -->
      </span>
      <span slot="no-results">
        {{ $t('infiniteScroll.noResults') }}
      </span>
    </infinite-loading>
  </div>
</template>

<script>
import { albumGetters } from '../../mixins/getters/albumGetters.js'
import { mapActions } from 'vuex'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  data: function () {
    return {
      selectedAlbumId: null,
      albumsInfinite: []
    }
  },
  components: {
    InfiniteLoading
  },
  props: ['albums'],
  mixins: [albumGetters],
  methods: {
    ...mapActions(['setModalAction', 'toggleModalAction', 'showModal', 'hideModal', 'setModalEntity']),
    isSelected: function (albumId) {
      return this.selectedAlbumId === albumId
    },
    setSelectedAlbum: function (albumId) {
      this.selectedAlbumId = albumId
    },
    albumClick: function (albumId) {
      this.setSelectedAlbum(albumId)
      this.setModalEntity({albumId: albumId})
      this.setModalAction('showAlbum')
      this.showModal()
    },
    onInfinite: function () {
      var availableAlbums = this.albums
      var currentlyLoadedCount = this.albumsInfinite.length
      if (currentlyLoadedCount === availableAlbums.length) {
        this.$refs.inf.$emit('$InfiniteLoading:complete')
      } else {
        this.albumsInfinite.push(availableAlbums[currentlyLoadedCount])
        this.$refs.inf.$emit('$InfiniteLoading:loaded')
      }
    },
    resetInfiniteLoader: function () {
      this.albumsInfinite = []
      this.$refs.inf.$emit('$InfiniteLoading:reset')
    }
  },
  watch: {
    albums: function () {
      this.resetInfiniteLoader()
    }
  },
  created: function () {
    // Reset infinite loader, selectedArtistId could've been changed from elsewhere
    this.$on('resetInfiniteLoader', function () {
      this.resetInfiniteLoader()
    })
  }
}
</script>

<style lang="sass" scoped>
.album-arts
  // TODO responsive and fixed max widths
  height: 100%
  float: left
  .album-art
    cursor: default
    float: left
    position: relative
    box-sizing: border-box
    -moz-box-sizing: border-box
    -webkit-box-sizing: border-box
    width: 25%
    padding-bottom: 25%
    overflow: hidden
    background: grey
    &:hover
      cursor: pointer
      transform: scale(1.05)
      transition: all 0.15s ease-out
      z-index: 100
    .content
      position: absolute
      height: 100%
      width: 100%
      .album-art-img
        width: 100%
        img
          width: 100%
      .album-title
        color: white
        width: 100%
        height: 10%
        padding: 0 2% 0 2%
        overflow: hidden
        box-sizing: border-box
        -moz-box-sizing: border-box
        -webkit-box-sizing: border-box
        white-space: nowrap
        text-overflow: ellipsis
        text-align: center
        position: absolute
        bottom: 0
        background: rgba(0, 0, 0, 0.5)

.selected
  border-color: #0F0 !important
.album-art-inbox
  // border: 1px dashed #FFF !important
  .album-title
    background: rgba(255, 255, 255, 0.5) !important
    color: #000 !important
</style>
