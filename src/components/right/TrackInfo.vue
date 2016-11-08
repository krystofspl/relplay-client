<template>
  <div id="track-info">
    <h1>Track info</h1>
    <div class="track-fields">
      <div v-for="field in displayedFields">
        {{ field }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      displayedFields: this.$store.state.view.components.TrackInfo.displayedFields
    }
  }
}
</script>

<style lang="sass" scoped>  
</style>