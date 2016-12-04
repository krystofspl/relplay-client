<template>
  <div class="album-arts">
    <modal v-if="showModal" @close="showModal = false">
      <div slot="header"><!-- {{ $t('components.AlbumDetails.modalHeader')}} --></div>
      <div slot="body">
        <album-details :album-id="selectedAlbumId"></album-details>
      </div>
    </modal>
    <div v-for="album in albums" class="album-art" v-bind:class="{'selected': isSelected(album.id), 'album-art-inbox': album.inInbox}" @click="setSelectedAlbum(album.id)" @dblclick="showModal = true">
      <div class="content">
        <div class="album-art-img" :data-album="album.id" v-if="getAlbumArtImgPath(album.id).length">
          <img :src="getAlbumArtImgPath(album.id)">
        </div>
        <div class="album-title">
          {{ album.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { albumGetters } from '../../mixins/getters/albumGetters.js'
import { mapGetters } from 'vuex'
import Modal from '../misc/Modal.vue'
import AlbumDetails from '../misc/AlbumDetails.vue'

export default {
  data: function () {
    return {
      selectedAlbumId: null,
      showModal: false
    }
  },
  components: {
    Modal,
    AlbumDetails
  },
  props: ['albums', 'selectedArtist'],
  mixins: [albumGetters],
  methods: {
    ...mapGetters('getAlbumArt'),
    isSelected: function (albumId) {
      return this.selectedAlbumId === albumId
    },
    setSelectedAlbum: function (albumId) {
      this.selectedAlbumId = albumId
    }
  }
}
</script>

<style lang="sass" scoped>
.album-arts
  // TODO responsive and fixed max widths
  height: 100%
  overflow: auto
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
    border: 1px solid #000
    &:hover
      border: 1px solid #F00
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
  border: 1px solid #0F0 !important
.album-art-inbox
  border-style: dashed !important
</style>
