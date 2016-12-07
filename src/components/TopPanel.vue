<template>
  <div id="top-panel">
    <ul id="top-menu">
      <li v-for="link in links">
        <div v-on:click="switchMainPanelView(link)" v-bind:class="{ active: isActive(link) }">{{ $t('components.'+link+'.name') }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data: function () {
    return {
      links: this.$store.state.view.components.TopPanel.links
    }
  },
  methods: {
    ...mapActions(['switchMainPanelView']),
    isActive: function (linkName) {
      return (this.$store.state.view.mainPanelView === linkName)
    }
  }
}
</script>

<style lang="sass" scoped>
#top-panel
  width: calc(100% - 300px)
  background: #333
  color: #CCC
  float: left
  border-bottom: 1px solid #000
  position: fixed
  ul#top-menu
    height: 47px
    list-style-type: none
    margin: 0
    padding: 0
    overflow-x: auto
    white-space: nowrap
    li
      display: inline-block
      padding: 0
      cursor: pointer
      &:hover
        background: white
      div
        padding: 14px 16px
      div.active
        border-top: 2px solid #FFF
        background: #444
</style>
