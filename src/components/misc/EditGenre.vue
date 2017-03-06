<template>
  <div id="edit-genre">
    <label for="selectedGenre">Genre</label>
    <select v-model="genre">
      <option v-bind:value="newGenre">* Create new</option>
      <option v-for="g in availableGenres" v-bind:value="g">{{ g.title }}</option>
    </select>

    <label for="title">{{ $t('components.EditGenre.genreTitle') }}*</label>
    <input type="text" name="title" v-model="genre.title">

    <label for="description">{{ $t('components.EditGenre.genreDesc') }}</label>
    <textarea name="description" v-model="genre.description"></textarea>

    <label for="color">{{ $t('components.EditGenre.genreColor') }}</label>
    <input type="color" name="color" v-model="genre.color">

    <label for="parentGenre">{{ $t('components.EditGenre.parentGenre') }}</label>
    <multiselect name="parentGenre" v-model="genre.parentGenre"
      :options="availableParentGenres"
      :value="genre.parentGenre"
      :allow-empty="true"
      :multiple="false"
      :hide-selected="false"
      :max-height="120"
      track-by="title"
      label="title"
      ></multiselect>

    <br><br><br>
    <button v-on:click="submit()" style="float: right; font-weight: bold;">Save</button>
    <button v-if="genre != newGenre" v-on:click="deleteSelectedGenre()" style="float:right; margin-right: 10px;">Delete</button>
  </div>
</template>

<script>
  import { genreGetters } from '../../mixins/getters/genreGetters.js'
  import { mapGetters, mapActions } from 'vuex'
  import Multiselect from 'vue-multiselect'
  var chroma = require('chroma-js')
  var _ = require('lodash')

  export default {
    data: function () {
      return {
        genre: null,
        newGenre: {
          title: '',
          description: '',
          color: chroma.random().hex(),
          parentGenre: null
        }
      }
    },
    props: ['genreId'],
    mixins: [genreGetters],
    components: {
      Multiselect
    },
    computed: {
      availableGenres: function () {
        var self = this
        var genres = _.cloneDeep(_.values(this.getGenres()).sort((a, b) => { return a.title.localeCompare(b.title) }))
        genres.forEach(genre => {
          genre = self.embedParentGenre(genre)
        })
        return genres
      },
      availableParentGenres: function () {
        return this.availableGenres.filter(g => (g.title !== this.genre.title))
      }
    },
    methods: {
      ...mapGetters(['getGenres']),
      ...mapActions(['setModalAction', 'toggleModalAction', 'showModal', 'hideModal']),
      getRandomColor: function () {
        return chroma.random()
      },
      embedParentGenre: function (genre) {
        if (genre.parentGenre) {
          genre.parentGenre = _.cloneDeep(this.getGenre(genre.parentGenre))
        }
        return genre
      },
      submit: function () {
        // Prepare data
        var newData = {
          title: this.genre.title,
          description: this.genre.description,
          color: this.genre.color,
          parentGenre: null,
          callback: function (err, obj) {
            console.log(err)
            console.log(obj)
          }
        }
        if (this.genre.parentGenre) {
          newData.parentGenre = this.genre.parentGenre.id
        }
        // Send
        var isNew = !this.genre.id
        if (isNew) {
          this.$store.dispatch('createGenre', newData)
        } else {
          newData.id = this.genre.id
          this.$store.dispatch('updateGenre', newData)
        }
        this.setModalAction('editAlbum')
      },
      deleteSelectedGenre: function () {
        var self = this
        var confirm = window.confirm(this.$t('components.EditGenre.deleteConfirm'))
        if (confirm) {
          this.$store.dispatch('deleteGenre', {id: self.genre.id, callback: function () {}})
          self.genre = self.availableGenres[0]
        }
      }
    },
    created: function () {
      if (this.genreId) { // Editing
        var genre = _.cloneDeep(this.getGenre(this.genreId))
        this.embedParentGenre(genre)
        this.genre = genre
      } else { // Creating
        this.genre = this.newGenre
      }
    }
  }
</script>

<style lang="sass">
#edit-genre
  min-height: 400px
  label
    font-weight: bold
    display: block
    width: 100%
    padding-top: 5px
  input, textarea, select
    border: 1px solid #000
    background: #888
    border-radius: none
    &:hover
      border: 1px solid #CCC
    &:focus
      border: 2px solid #000
      background: #999
  input[type=text], textarea
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
        background: #000
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