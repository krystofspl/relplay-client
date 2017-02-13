<template>
  <div class="album-details-list">
    <div v-for="album in albumsInfinite">
      <album-details :album-id="album.id"></album-details>
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
import AlbumDetails from '../misc/AlbumDetails.vue'
import InfiniteLoading from 'vue-infinite-loading'

export default {
  data: function () {
    return {
      albumsInfinite: []
    }
  },
  components: {
    AlbumDetails,
    InfiniteLoading
  },
  props: ['albums'],
  methods: {
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
.album-details-list
  height: 100%
  float: right
  .album-details
    background: #666
    border-bottom: 1px solid #000
    padding: 7px
    overflow: hidden
    &:after
      content: " "
      display: block
      height: 0
      clear: both
    .col-right
</style>