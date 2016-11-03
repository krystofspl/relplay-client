import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Vuex from 'vuex'

import App from './App.vue'

import store from './vuex/store'

var locales = {
  en: {
    components: {
      AlbumArts: {
        name: 'Album Arts'
      },
      GenresArtistsGraph: {
        name: 'Graph - Genres/Aritsts'
      },
      ArtistsArtistsGraph: {
        name: 'Graph - ArtistsArtistsGraph/Aritsts'
      }
    },
    views: {

    }
  }
}

Vue.use(VueI18n)
Vue.config.lang = 'en'
Object.keys(locales).forEach(function (lang) {
  Vue.locale(lang, locales[lang])
})

Vue.use(Vuex)

var vue = new Vue({
  store,
  el: '#app',
  components: {
    App
  },
  data () {
    return {
    }
  }
})

window.vue = vue
