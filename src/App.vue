<template>
  <div id="app">
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

export default {
  components: {
    TopPanel,
    MainPanel,
    RightPanel,
    BottomPanel
  }
}
</script>

<style lang="sass">
.component-fade-enter-active, .component-fade-leave-active
  transition: opacity .2s ease

.component-fade-enter, .component-fade-leave-active
  opacity: 0
</style>
