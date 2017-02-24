<template>
  <div id="filters-artists-albums-more">
    {{ $t('components.Labels.labels') }}
    <multiselect name="labels" v-model="labelsFilter"
      :options="availableLabels"
      :allow-empty="true"
      :multiple="true"
      :hide-selected="true"
      :close-on-select="true"
      :max-height="120"
      label="title"
      track-by="title"
      ></multiselect>

    {{ $t('components.AlbumDetails.inInbox') }}
    <select v-model="albumInboxFilter">
      <option :value="'both'">-</option>
      <option :value="true">Yes</option>
      <option :value="false">No</option>
    </select>

    {{ $t('components.ArtistsAlbumArts.sortBy') }} <select v-model="albumSort">
      <option :value="'titleAsc'">Title asc</option>
      <option :value="'titleDesc'">Title desc</option>
      <option :value="'yearAsc'">Year asc</option>
      <option :value="'yearDesc'">Year desc</option>
    </select>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import { mapGetters } from 'vuex'

export default {
  components: {
    Multiselect
  },
  computed: {
    ...mapGetters(['getLabels']),
    labelsFilter: {
      get () {
        return this.$store.state.view.components.FiltersArtistsAlbums.labelsFilter
      },
      set (value) {
        this.$store.dispatch('updateArtistAlbumFilters', { labelsFilter: value })
      }
    },
    albumInboxFilter: {
      get () {
        return this.$store.state.view.components.FiltersArtistsAlbums.albumInboxFilter
      },
      set (value) {
        this.$store.dispatch('updateArtistAlbumFilters', { albumInboxFilter: value })
      }
    },
    albumSort: {
      get () {
        return this.$store.state.view.components.FiltersArtistsAlbums.albumSort
      },
      set (value) {
        this.$store.dispatch('updateArtistAlbumFilters', { albumSort: value })
      }
    },
    availableLabels: function () {
      return Object.values(this.getLabels).sort((a, b) => { return a.title.localeCompare(b.title) }) || []
    }
  }
}
</script>

<style lang="sass" scoped>
#filters-artists-albums-more
  select
    width: 100%
    margin-bottom: 10px
  .multiselect
    display: inline-block
    border-radius: 0
    color: #CCC
    background: #333
    margin-bottom: 10px
    .multiselect__select
      padding: 0
    .multiselect__tags
      font-size: 85%
      border: 1px solid #000
      background: #333
      border-radius: 0
      padding: 0
      height: auto
      .multiselect__input, .multiselect__single
        border: none !important
        border-radius: 0
        background: #333
        margin: 0
        padding: 0 5px
        &:focus, &:hover
      span.multiselect__tag
        background: #666
        border: 1px solid #333
        margin: 2px 0 0 2px
    .multiselect__content
      background: #333
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