<template>
  <div class="playlist-actions">
    <!-- <h3>{{ $t('components.Playlists.actionsHeading') }}</h3> -->
    <span class="action" @click="playCurrentPlaylist()">
      <icon name="play" scale="0.75"/>  {{ $t('components.PlaylistActions.play') }}
    </span>
    <span class="action" @click="enqueueCurrentPlaylist()">
      <icon name="ellipsis-h" scale="0.75"/>  {{ $t('components.PlaylistActions.enqueue') }}
    </span>
    <span class="action" @click="setModalEntity({ entityId: playlistId }); setModalAction('editPlaylist'); showModal()">
      <icon name="pencil" scale="0.75"/> {{ $t('components.PlaylistActions.edit') }}
    </span>
    <span class="action" @click="deleteCurrentPlaylist()">
      <icon name="trash" scale="0.75"/>  {{ $t('components.PlaylistActions.delete') }}
    </span>
  </div>
</template>

<script>
import { playlistGetters } from '../../mixins/getters/playlistGetters.js'
import { trackGetters } from '../../mixins/getters/trackGetters.js'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons'
import { mapActions } from 'vuex'
import bus from '../../vuex/eventBus.js'
var _ = require('lodash')

export default {
  props: ['playlistId'],
  mixins: [ playlistGetters, trackGetters ],
  components: {
    Icon
  },
  methods: {
    ...mapActions(['setModalAction', 'toggleModalAction', 'showModal', 'hideModal', 'setModalEntity', 'deletePlaylist', 'playerUpdatePlaylist']),
    deleteCurrentPlaylist: function () {
      var conf = window.confirm(this.$t('components.PlaylistActions.confirmDelete'))
      if (conf === true) {
        this.deletePlaylist({ id: this.playlistId, callback: (err, obj) => { console.log(err); console.log(obj) } })
      }
    },
    playCurrentPlaylist: function () {
      var self = this
      bus.$emit('addPlaylistTracks', {
        trackIds: _.map(_.sortBy(self.trackIds, 'position'), 'id'),
        clearPlaylist: true
      })
    },
    enqueueCurrentPlaylist: function () {
      var self = this
      bus.$emit('addPlaylistTracks', {
        trackIds: _.map(_.sortBy(self.trackIds, 'position'), 'id'),
        clearPlaylist: false
      })
    }
  },
  computed: {
    playlist: function () {
      return this.getPlaylist(this.playlistId)
    },
    trackIds: function () {
      return this.playlist.tracks
    }
  }
}
</script>

<style lang="sass" scoped>
.playlist-actions
  .action
    margin-right: 5px
</style>