<template>
  <div id="edit-entity-labels">
    <label for="labels">{{ $t('components.Labels.labels') }}</label>
    <multiselect name="labels" v-model="labels"
      :tag-placeholder="$t('components.Labels.tagPlaceholder')"
      :options="availableLabels"
      :value="labels"
      :allow-empty="true"
      :multiple="true"
      :hide-selected="true"
      :close-on-select="false"
      :max-height="120"
      label="title"
      track-by="title"
      :taggable="true"
      @tag="addLabel"
      ></multiselect>
    <br><br><br>
    <button v-on:click="submit()" style="float: right; font-weight: bold;">Save</button>
  </div>
</template>

<script>
  import { labelGetters } from '../../mixins/getters/labelGetters.js'
  import { trackGetters } from '../../mixins/getters/trackGetters.js'
  import { albumGetters } from '../../mixins/getters/albumGetters.js'
  import { mapGetters, mapActions } from 'vuex'
  import Multiselect from 'vue-multiselect'
  var _ = require('lodash')

  export default {
    data: function () {
      return {
        labels: []
      }
    },
    components: {
      Multiselect
    },
    props: ['entityType', 'entityId'],
    mixins: [labelGetters, albumGetters, trackGetters],
    methods: {
      ...mapGetters(['getLabels']),
      ...mapActions(['hideModal']),
      addLabel: function (newLabel) {
        const label = {
          title: newLabel
        }
        this.availableLabels.push(label)
        this.labels.push(label)
      },
      submit: function () {
        var self = this
        var newLabels = this.labels.filter(label => !('id' in label))
        var newData = {
          labels: newLabels,
          callback: function (err, obj) {
            if (err) console.log(err)
            // Add IDs for the added labels
            for (let i = 0; i < obj.length; i++) {
              var oldLabel = _.find(self.labels, { title: obj[i].title })
              if (oldLabel) {
                oldLabel.id = obj[i].id
              }
            }
            // Relate entity with labels
            var newData = {
              id: self.entityId,
              callback: function (err, obj) {
                console.log(err)
              }
            }
            if (!_.isEqual(self.labels.map(i => i.id).sort(), self.entity.labels.sort())) {
              newData.labels = self.labels.map(l => l.id)
            }
            switch (self.entityType) {
              case 'track':
                self.$store.dispatch('updateTrack', newData)
                break
              case 'album':
                self.$store.dispatch('updateAlbum', newData)
                break
              default:
                break
            }
            self.hideModal()
          }
        }
        // Create new labels
        this.$store.dispatch('addNewLabels', newData)
      }
    },
    computed: {
      availableLabels: function () {
        return Object.values(this.getLabels()).sort((a, b) => { return a.title.localeCompare(b.title) }) || []
      },
      entity: function () {
        var self = this
        var entity = null
        switch (self.entityType) {
          case 'track':
            entity = self.getTrack(self.entityId)
            break
          case 'album':
            entity = self.getAlbum(self.entityId)
            break
          default:
            break
        }
        return entity
      }
    },
    created: function () {
      var self = this
      this.labels = this.entity.labels.map(labelId => {
        return self.getLabel(labelId)
      })
    }
  }
</script>

<style lang="sass" scoped>
#edit-entity-labels
  label
    font-weight: bold
    display: block
    width: 100%
    padding-top: 5px
  button
    border: 1px solid #000
    background: #888
    padding: 10px
    &:hover
      border: 1px solid #CCC
  input
    border: 1px solid #000
    background: #888
    color: #000
    border-radius: none
    &::placeholder
      color: #000
    &:hover
      border: 1px solid #CCC
    &:focus
      border: 2px solid #000
      background: #999
  input[type=text]
    width: 100%
    padding: 5px
    -webkit-box-sizing: border-box
    -moz-box-sizing: border-box
    box-sizing: border-box

.multiselect
  border-radius: 0
  .multiselect__tags
    border: 1px solid #000
    background: #888
    border-radius: 0
    padding: 0
    &:hover
      border: 1px solid #CCC
    .multiselect__input, .multiselect__single
      border: none !important
      border-radius: 0
      background: #888
      &:focus, &:hover
    span.multiselect__tag
      background: #666
      border: 1px solid #333
      margin: 2px 0 0 2px
  .multiselect__content
    background: #888
    border-radius: 0
    border: 1px solid #000
    .multiselect__option
      background: #888
    .multiselect__option--active
      background: yellow
    .multiselect__option--highlight
      background: #666
      &::after
        background: red
</style>