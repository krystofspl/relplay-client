<template>
  <div class="labels">
    <div class="edit-action" @click="setModalAction(['editEntityLabels']); setModalEntity({entityId: entityId, entityType: entityType}); showModal()">
      <icon scale="0.9" name="pencil"></icon>
    </div>
    <div v-if="!labels.length" style="display: inline-block">
      -
    </div>
    <span v-for="label in labels" class="label">{{ label.title }}</span>
  </div>
</template>

<script>
import { trackGetters } from '../../mixins/getters/trackGetters.js'
import { albumGetters } from '../../mixins/getters/albumGetters.js'
import { mapActions } from 'vuex'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/pencil'

export default {
  props: ['entityType', 'entityId'],
  mixins: [albumGetters, trackGetters],
  components: {
    Icon
  },
  methods: {
    ...mapActions(['setModalAction', 'setModalEntity', 'showModal'])
  },
  computed: {
    labels: function () {
      var self = this
      var labels = []
      switch (self.entityType) {
        case 'track':
          labels = self.getLabelsForTrack(self.entityId)
          break
        case 'album':
          labels = self.getLabelsForAlbum(self.entityId)
          break
        default:
          break
      }
      return labels
    }
  }
}
</script>

<style lang="sass" scoped>
.labels
  display: inline
  &:hover
    .edit-action
      display: inline-block
  .label
    display: inline-block
    background: #555
    color: #CCC
    border: 1px solid #000
    padding: 1px 3px
    border-radius: 3px
    margin: 1px
    font-size: 83%
  .edit-action
    display: none
    &:hover
      color: #FFF
</style>