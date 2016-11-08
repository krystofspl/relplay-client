<template>
  <div id="playing-track">
    [{{ this.$store.state.player.state }}]
    <div class="playing-track-name">
      {{ this.$store.state.player.nowPlaying.trackName }}
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="sass" scoped>  
</style>