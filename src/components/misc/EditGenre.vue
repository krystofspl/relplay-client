<template>
  <div id="edit-genre">
    <label for="selectedGenre">Genre</label>
    <select v-model="genre">
      <option v-bind:value="newGenre">* Create new</option>
      <option v-for="g in getGenres()" v-bind:value="g">{{ g.title }}</option>
    </select>

    <label for="title">{{ $t('components.EditGenre.genreTitle') }}*</label>
    <input type="text" name="title" v-model="genre.title">

    <label for="description">{{ $t('components.EditGenre.genreDesc') }}</label>
    <textarea name="description" v-model="genre.description"></textarea>

    <label for="color">{{ $t('components.EditGenre.genreColor') }}</label>
    <input type="color" name="color" v-model="genre.color">

    <label for="parentGenre">{{ $t('components.EditGenre.parentGenre') }}</label>
    <multiselect name="parentGenre" v-model="genre.parentGenre"
      :options="availableGenres"
      :value="genre.parentGenre"
      :allow-empty="true"
      :multiple="false"
      :hide-selected="true"
      :max-height="120"
      track-by="title"
      label="title"
      ></multiselect>

    <br><br><br>
    <button v-on:click="submit()" style="float: right;">Save</button>
  </div>
</template>

<script>
  import { genreGetters } from '../../mixins/getters/genreGetters.js'
  import { mapGetters, mapActions } from 'vuex'
  import Multiselect from 'vue-multiselect'
  var chroma = require('chroma-js')

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
        var genres = Object.values(this.getGenres()).filter(g => (g.title !== self.genre.title)).sort((a, b) => { return a.title.localeCompare(b.title) })
        genres.forEach(genre => {
          if (genre.parentGenre) {
            genre.parentGenre = self.getGenre(genre.parentGenre)
          }
        })
        console.log(genres.map(g => g.parentGenre))
        return genres
      }
    },
    methods: {
      ...mapGetters(['getGenres']),
      ...mapActions(['setModalAction', 'toggleModalAction', 'showModal', 'hideModal']),
      getRandomColor: function () {
        return chroma.random()
      },
      submit: function () {
        // Prepare data
        var newData = {
          title: this.genre.title,
          description: this.genre.description,
          color: this.genre.color,
          callback: function (err, obj) {
            console.log(err)
            console.log(obj)
          }
        }
        // If it doesn't have ID, then its new and add everything, otherwise only changed stuff
        var isNew = !this.genre.id
        if (!isNew) {
          newData.id = this.genre.id
        }
        if (this.parentGenre) {
          newData.parentGenre = this.parentGenre.id
        }
        // Send
        this.$store.dispatch('updateGenre', newData)
        this.setModalAction('editAlbum')
      }
    },
    created: function () {
      if (this.genreId) { // Editing
        this.genre = this.getGenre(this.genreId)
        if (this.genre.parentGenre) {
          this.genre.parentGenre = this.getGenre(this.genre.parentGenre)
        }
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
  button
    border: 1px solid #000
    background: #888
    padding: 10px
    &:hover
      border: 1px solid #CCC
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