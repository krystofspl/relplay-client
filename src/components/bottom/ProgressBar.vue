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
    &::-webkit-progress-bar
      background: $barColorSecondary
    &[value]::-webkit-progress-value
      background: $barColorPrimary
      background-image: -webkit-linear-gradient(-45deg, transparent 33%, rgba(0, 0, 0, .1) 33%, rgba(0,0, 0, .1) 66%, transparent 66%)
      background-size: 35px 20px, 100% 100%, 100% 100%
    &::-moz-progress-bar
      background: $barColorPrimary
</style>