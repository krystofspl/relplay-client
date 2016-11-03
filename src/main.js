import Vue from 'vue'
import VueI18n from 'vue-i18n'

import App from './App.vue'

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

var vue = new Vue({
  el: '#app',
  components: {
    App
  },
  data () {
    return {
      state: {
        mainPanelView: 'GraphCanvas'
      }
    }
  }
})

window.vue = vue
