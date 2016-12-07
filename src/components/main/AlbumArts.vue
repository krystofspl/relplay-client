<template>
  <div class="album-arts">
    <modal v-if="modalVisible" @close="hideModal()">
      <div slot="actions" style="display: inline">
        <div @click="toggleModalAction('edit')" class="action" v-bind:class="{'active-action': modalAction == 'edit'}">
          <icon scale="1.5" name="pencil"></icon>
        </div>
        <div @click="" class="action">
          <icon scale="1.5" name="trash-o"></icon>
        </div>
      </div>
      <div slot="body" v-if="modalAction == 'show'">
        <album-details :album-id="selectedAlbumId"></album-details>
      </div>
      <div slot="body" v-if="modalAction == 'edit'">
        <edit-album :album="getAlbum(selectedAlbumId)"></edit-album>
      </div>
    </modal>

    <div v-if="!albums.length" style="text-align: center; margin: 20px 0">
      {{ $t('components.AlbumArts.noAlbums') }}
    </div>

    <div v-for="album in albums" class="album-art" v-bind:class="{'selected': isSelected(album.id), 'album-art-inbox': album.inInbox}" @click="setSelectedAlbum(album.id)" @dblclick="setModalAction('show'); showModal()">
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
import { mapActions } from 'vuex'
import Modal from '../misc/Modal.vue'
import AlbumDetails from '../misc/AlbumDetails.vue'
import EditAlbum from '../misc/EditAlbum.vue'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/pencil'
import 'vue-awesome/icons/trash'

export default {
  data: function () {
    return {
      selectedAlbumId: null
    }
  },
  components: {
    Modal,
    AlbumDetails,
    EditAlbum,
    Icon
  },
  props: ['albums', 'selectedArtist'],
  mixins: [albumGetters],
  methods: {
    ...mapActions(['setModalAction', 'toggleModalAction', 'showModal', 'hideModal']),
    isSelected: function (albumId) {
      return this.selectedAlbumId === albumId
    },
    setSelectedAlbum: function (albumId) {
      this.selectedAlbumId = albumId
    }
  },
  computed: {
    modalVisible: function () { return this.$store.state.view.components.Modal.showModal },
    modalAction: function () { return this.$store.state.view.components.Modal.modalAction }
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
  border-color: #0F0 !important
.album-art-inbox
  border-style: dashed !important
  border-color: white !important
  .album-title
    background: rgba(255, 255, 255, 0.5) !important
    color: #000 !important
.active-action
  color: red
</style>
