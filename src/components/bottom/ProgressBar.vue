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
  #bar
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    width: 100%
    height: 10px
    background: $barColorSecondary
    border-top: 1px solid #000
    position: absolute
    bottom: 0
    left: 0
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