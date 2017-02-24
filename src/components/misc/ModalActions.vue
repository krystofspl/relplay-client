<template>
  <modal v-if="modalVisible" @close="hideModal()">
    <div slot="header">
      <h2 v-if="modalAction == 'showAlbum'">{{ $t('components.ModalActions.showAlbum') }}</h2>
      <h2 v-if="modalAction == 'editAlbum'">{{ $t('components.ModalActions.editAlbum') }}</h2>
      <h2 v-if="modalAction == 'editGenre'">{{ $t('components.ModalActions.editGenre') }}</h2>
      <h2 v-if="modalAction == 'editEntityLabels'">{{ $t('components.ModalActions.editEntityLabels') }}</h2>
      <h2 v-if="modalAction == 'filtersArtistsAlbumsMore'">{{ $t('components.ModalActions.filtersArtistsAlbumsMore') }}</h2>
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
      <div v-if="modalAction == 'editEntityLabels'" style="display: inline">
        <!-- nothing yet -->
      </div>
      <div v-if="modalAction == 'filtersArtistsAlbumsMore'" style="display: inline">
        <!-- nothing yet -->
      </div>
    </div>

    <div slot="body">
      <album-details v-if="modalAction == 'showAlbum'" :album-id="modalEntities.albumId"></album-details>
      <edit-album v-if="modalAction == 'editAlbum'" :album="getAlbum(modalEntities.albumId)"></edit-album>
      <edit-genre v-if="modalAction == 'editGenre'" :genre-id="modalEntities.genreId"></edit-genre>
      <edit-entity-labels v-if="modalAction == 'editEntityLabels'" :entity-id="modalEntities.entityId" :entity-type="modalEntities.entityType"></edit-entity-labels>
      <filters-artists-albums-more v-if="modalAction == 'filtersArtistsAlbumsMore'"></filters-artists-albums-more>
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
import EditEntityLabels from '../misc/EditEntityLabels.vue'
import AlbumDetails from '../misc/AlbumDetails.vue'
import FiltersArtistsAlbumsMore from '../misc/FiltersArtistsAlbumsMore.vue'
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
    EditEntityLabels,
    Icon,
    AlbumDetails,
    FiltersArtistsAlbumsMore
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