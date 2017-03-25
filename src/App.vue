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
    <player></player>
  </div>
</template>

<script>
import TopPanel from './components/TopPanel.vue'
import MainPanel from './components/MainPanel.vue'
import RightPanel from './components/RightPanel.vue'
import BottomPanel from './components/BottomPanel.vue'
import Player from './components/Player.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    TopPanel,
    MainPanel,
    RightPanel,
    BottomPanel,
    Player
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
    border: 1px solid #000
    &::placeholder
      color: #CCC
    &:hover
      border: 1px solid #CCC
    &:focus
      border: 2px solid #000
      background: #999
  input, select, .multiselect__input::placeholder, .multiselect__tags, button, textarea
    color: #CCC !important
    background: #444 !important
  button
    border: 1px solid #000
    padding: 10px
    &:hover
      border: 1px solid #CCC

  .action
    font-weight: bold
    &:hover
      color: red

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
    span.multiselect__tag
      background: #666
      border: 1px solid #333
      margin: 2px 0 0 2px
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

.ui-draggable.ui-draggable-dragging, .drag-helper
  height: 30px
  width: 270px
  background: #555
  opacity: 0.8
  box-shadow: 7px 7px 23px 0px rgba(0, 0, 0, 0.65)
  z-index: 2000

.component-fade-enter-active, .component-fade-leave-active, .fade-enter-active, .fade-leave-active
  transition: opacity .5s ease

.component-fade-enter, .component-fade-leave-active, .fade-enter, .fade-leave-active
  opacity: 0
</style>
