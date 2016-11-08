<template>
  <div id="right-panel">
    <keep-alive>
      <transition name="component-fade" mode="out-in">
          <component :is="this.$store.state.view.rightPanelView"></component>
      </transition>
    </keep-alive>
  </div>
</template>

<script>
import DefaultRight from './right/DefaultRight.vue'
import SimilarityForm from './right/SimilarityForm.vue'

export default {
  components: {
    DefaultRight,
    SimilarityForm
  }
}
</script>

<style lang="sass" scoped>
#right-panel
  height: calc(100% - 80px)
  width: 300px
  background: yellow
  position: fixed
  top: 0
  right: 0
</style>
