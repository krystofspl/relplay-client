<template>
  <div id="app-wrapper">
    <transition name="fade">
      <div id="info-panel" v-if="infoPanelVisible()" @click="hideInfoPanel()">
        {{ infoPanelMsg() }}
      </div>
    </transition>
    <top-panel></top-panel>
    <main-panel></main-panel>
    <right-panel></right-panel>
    <bottom-panel></bottom-panel>
  </div>
</template>

<script>
import TopPanel from './components/TopPanel.vue'
import MainPanel from './components/MainPanel.vue'
import RightPanel from './components/RightPanel.vue'
import BottomPanel from './components/BottomPanel.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    TopPanel,
    MainPanel,
    RightPanel,
    BottomPanel
  },
  methods: {
    ...mapActions(['showInfoPanel', 'hideInfoPanel', 'setInfoPanelMsg']),
    infoPanelMsg: function () {
      return this.$store.state.view.infoPanelMsg
    },
    infoPanelVisible: function () {
      return this.$store.state.view.showInfoPanel
    }
  }
}
</script>

<style lang="sass">
body
  height: 100%
  background: #444
  margin: 0
  font-family: Arial, Helvetica, sans-serif
  font-size: 14px
  user-select: none
  cursor: default
  #app-wrapper
    width: 100%
    height: 100%
    #info-panel
      padding: 10px
      width: 40%
      text-align: center
      background: #DDD
      border: 1px solid #000
      border-radius: 5px
      position: absolute
      margin-left: auto
      margin-right: auto
      top: 20px
      left: 0
      right: 0
      z-index: 1000
  input, select
    padding: 2px
    color: #CCC
    background: #333
    border: 1px solid #000
    &::placeholder
      color: #CCC


.component-fade-enter-active, .component-fade-leave-active, .fade-enter-active, .fade-leave-active
  transition: opacity .5s ease

.component-fade-enter, .component-fade-leave-active, .fade-enter, .fade-leave-active
  opacity: 0
</style>
