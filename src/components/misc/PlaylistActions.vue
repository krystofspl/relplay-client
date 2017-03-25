<template>
  <div class="playlist-actions">
    <h3>{{ $t('components.Playlists.actionsHeading') }}</h3>
    <span class="action" @click="setModalEntity({ entityId: playlistId }); setModalAction('editPlaylist'); showModal()">
      <icon name="pencil" /> {{ $t('components.PlaylistActions.edit') }}
    </span>
    <span class="action" @click="deleteCurrentPlaylist()">
      <icon name="trash" />  {{ $t('components.PlaylistActions.delete') }}
    </span>
  </div>
</template>

<script>
import { playlistGetters } from '../../mixins/getters/playlistGetters.js'
import { trackGetters } from '../../mixins/getters/trackGetters.js'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons'
import { mapActions } from 'vuex'
// var _ = require('lodash')

export default {
  props: ['playlistId'],
  mixins: [ playlistGetters, trackGetters ],
  components: {
    Icon
  },
  methods: {
    ...mapActions(['setModalAction', 'toggleModalAction', 'showModal', 'hideModal', 'setModalEntity', 'deletePlaylist']),
    deleteCurrentPlaylist: function () {
      var conf = window.confirm(this.$t('components.PlaylistActions.confirmDelete'))
      if (conf === true) {
        this.deletePlaylist({ id: this.playlistId, callback: (err, obj) => { console.log(err); console.log(obj) } })
      }
    }
  },
  computed: {
    playlist: function () {
      return this.getPlaylist(this.playlistId)
    }
  }
}
</script>

<style lang="sass" scoped>
.playlist-actions
  .action
    margin-right: 5px
</style>