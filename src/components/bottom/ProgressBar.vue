<template>
  <div id="progress-bar">
    <progress @click="setProgress" id="bar" v-bind:value="this.$store.state.player.progress" max="100"></progress>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions(['playerSetProgressRequest']),
    setProgress: function (e) {
      var percent = e.offsetX / this.$el.offsetWidth * 100
      this.playerSetProgressRequest({ progress: percent })
    }
  }
}
</script>

<style lang="sass" scoped>
$barColorPrimary: red
$barColorSecondary: black

#progress-bar
  width: 100%
  height: 15px
  float: left
  #bar
    padding: 0
    margin: 0
    width: 100%
    height: 15px
    border-bottom: 1px solid #000
    appearance: none
    -moz-appearance: none
    -webkit-appearance: none
    background: $barColorSecondary
  progress
    color: $barColorPrimary
  progress::-moz-progress-bar
    background: $barColorPrimary
  progress::-webkit-progress-value
    background: $barColorPrimary
  progress::-webkit-progress-bar
    background: $barColorSecondary
  progress::-webkit-progress-value
    background: $barColorPrimary
</style>