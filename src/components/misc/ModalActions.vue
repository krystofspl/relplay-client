<template>
  <modal v-if="modalVisible" @close="hideModal()">
    <div slot="header" v-if="modalAction == 'showAlbum'">
      <h2>{{ $t('components.ModalActions.showAlbum') }}</h2>
    </div>
    <div slot="header" v-if="modalAction == 'editAlbum'">
      <h2>{{ $t('components.ModalActions.editAlbum') }}</h2>
    </div>
    <div slot="header" v-if="modalAction == 'editGenre'">
      <h2>{{ $t('components.ModalActions.editGenre') }}</h2>
    </div>

    <div slot="actions" style="display: inline">
      <div v-if="modalAction == 'showAlbum' || modalAction == 'editAlbum'" style="display: inline">
        <div @click="toggleModalAction(['editAlbum', 'showAlbum'])" class="action" v-bind:class="{'active-action': modalAction == 'editAlbum'}">
          <icon scale="1.3" name="pencil"></icon>
        </div>
        <div @click="" class="action">
          <icon scale="1.3" name="trash-o"></icon>
        </div>
      </div>
      <div v-if="modalAction == 'editGenre'" style="display: inline">
        <div @click="setModalAction('editAlbum')" class="action">
          <icon scale="1.3" name="arrow-left"></icon>
        </div>
      </div>
    </div>

    <div slot="body" v-if="modalAction == 'showAlbum'">
      <album-details :album-id="modalEntities.albumId"></album-details>
    </div>
    <div slot="body" v-if="modalAction == 'editAlbum'">
      <edit-album :album="getAlbum(modalEntities.albumId)"></edit-album>
    </div>
    <div slot="body" v-if="modalAction == 'editGenre'">
      <edit-genre :genre-id="modalEntities.genreId"></edit-genre>
    </div>

  </modal>
</template>

<script>
import { albumGetters } from '../../mixins/getters/albumGetters.js'
import { genreGetters } from '../../mixins/getters/genreGetters.js'
import { mapActions } from 'vuex'
import Modal from './Modal.vue'
import EditAlbum from '../misc/EditAlbum.vue'
import EditGenre from '../misc/EditGenre.vue'
import AlbumDetails from '../misc/AlbumDetails.vue'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons'

export default {
  data: function () {
    return {
    }
  },
  components: {
    Modal,
    EditAlbum,
    EditGenre,
    Icon,
    AlbumDetails
  },
  mixins: [albumGetters, genreGetters],
  methods: {
    ...mapActions(['setModalAction', 'toggleModalAction', 'showModal', 'hideModal', 'setModalEntity'])
  },
  computed: {
    modalVisible: function () { return this.$store.state.view.components.Modal.showModal },
    modalAction: function () { return this.$store.state.view.components.Modal.modalAction },
    modalEntities: function () { return this.$store.state.view.components.Modal.modalEntities }
  }
}
</script>

<style lang="sass">
.active-action
  color: red

</style>