import Vue from 'vue'
// A simple event bus for component communication without the vuex store
// see https://vuejs.org/v2/guide/components.html#Non-Parent-Child-Communication
// bus.$emit('id-selected', 1)
// bus.$on('id-selected', function (id) { ... })
export default new Vue()

/*
Used events:
addPlaylistTracks
*/
