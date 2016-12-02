<template>
  <div class="artists-panel">
    <ul>
      <li class="artist-item" v-bind:class="{'selected': isSelected(-1)}" @click="setSelectedArtist(-1)">
        {{ $t('components.ArtistsPanel.all') }}
      </li>
      <li v-for="artist in artists" class="artist-item" v-bind:class="{'selected': isSelected(artist.id)}" @click="setSelectedArtist(artist.id)">
        {{ artist.name }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['artists', 'selectedArtistId'],
    methods: {
      isSelected: function (artistId) {
        return this.selectedArtistId === artistId
      },
      setSelectedArtist: function (id) {
        this.$store.dispatch('setSelectedArtist', id)
      }
    }
  }
</script>

<style lang="sass" scoped>
.artists-panel
  height: 100%
  overflow: auto
  ul
    list-style-type: none
    margin: 0
    padding: 0
    li
      margin: 0
      padding: 0
      width: 100%
      min-height: 30px
      border: 1px solid #000
      cursor: default
      box-sizing: border-box
      -moz-box-sizing: border-box
      -webkit-box-sizing: border-box
      &:hover
        background: white

.selected
  font-weight: bold
  background: brown
</style>
