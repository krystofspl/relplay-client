<template>
  <div id="player-controls">
    <div v-on:click="playerPrevious">
      <icon name="fast-backward" scale="2"></icon>
    </div>
    <div v-on:click="playerSwitchState">
      <icon name="play" scale="2" v-if="this.$store.state.player.state == 'paused'"></icon>
      <icon name="pause" scale="2" v-else></icon>
    </div>
    <div v-on:click="playerNext">
      <icon name="fast-forward" scale="2"></icon>
    </div>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import { mapActions } from 'vuex'
import 'vue-awesome/icons'

export default {
  components: {
    Icon
  },
  methods: {
    ...mapActions(['playerPrevious', 'playerSwitchState', 'playerNext'])
  }
}
</script>

<style lang="sass" scoped>
#player-controls
  float: left
  width: 200px
  height: 65px
  user-select: none
  padding-top: 15px
  padding-left: 20px
  box-sizing: border-box
  div
    display: inline-block
    width: 35px
    text-align: center
  svg
    color: #BBB
    &:hover
      color: #FFF
</style>