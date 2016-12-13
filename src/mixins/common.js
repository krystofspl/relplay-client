export var common = {
  methods: {
    getFontColorForBG: function (color) {
      var chroma = require('chroma-js')
      var MIN_CONTRAST_RATIO = 7
      var WHITE = chroma('white')
      var BLACK = chroma('black')
      var contrastWhite = chroma.contrast(color, chroma('white'))
      if (contrastWhite >= MIN_CONTRAST_RATIO) {
        return WHITE
      } else {
        return BLACK
      }
    }
  }
}
