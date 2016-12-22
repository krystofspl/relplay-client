<template>
  <div id="progress-bar">
    <progress id="bar" v-bind:value="progress" max="100"></progress>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      progress: parseFloat(this.$store.state.player.progress)
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