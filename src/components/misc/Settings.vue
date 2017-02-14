<template>
  <div id="settings">
    <div class="section">
      <div class="section-head">
        <h1>Scan library folder</h1>
      </div>
      <div class="section-body">
        <button v-on:click="rescan()" style="font-weight: bold;">Rescan</button>
        <button v-on:click="getRescanStatus()" style="font-weight: bold;">Get status</button>
        <button v-if="rescanStatus.status === 'done' && rescanStatus.missingFilesCount > 0" v-on:click="removeMissingTracks()" style="font-weight: bold;">Remove missing tracks</button>
        <div v-if="rescanStatus">
          <span><strong>Rescan status: </strong>{{ rescanStatus.status }}</span><br>
          <span><strong>Now doing: </strong>{{ rescanStatus.detailedStatusMsg }}</span><br>
          <span><strong>New files found: </strong>{{ rescanStatus.newFilesCount }}</span><br>
          <span><strong>Missing files found: </strong>{{ rescanStatus.missingFilesCount }}</span><br>
          <span v-if="rescanStatus.errMsg"><strong>Error message: </strong>{{ rescanStatus.errMsg }}</span><br v-if="rescanStatus.errMsg">
          <span><strong>Tracks added to DB: </strong>{{ rescanStatus.tracksAddedCount }}</span><br>
          <span><strong>% Added: </strong>{{ rescanStatus.tracksAddedPercentage }}</span><br>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  data: function () {
    return {
      rescanStatus: null
    }
  },
  methods: {
    rescan: function () {

    },
    getRescanStatus: function () {
      var self = this
      Vue.http.get(this.$store.state.settings.global.backendUrl + 'rescan-summary/').then(response => {
        self.rescanStatus = response.body
      }, err => {
        console.log(err)
      })
    },
    removeMissingTracks: function () {
      var self = this
      var confirm = window.confirm(this.$t('components.Settings.rescan.removeConfirm'))
      if (confirm) {
        this.$store.dispatch('removeTracks', {id: self.genre.id, callback: function () {}})
        self.genre = self.availableGenres[0]
      }
    }
  },
  ready: function () {
    this.getRescanStatus()
    setInterval(function () {
      this.getRescanStatus()
    }.bind(this), 5000)
  }
}
</script>

<style lang="sass" scoped>
#settings
  .section
    box-sizing: border-box
    width: 98%
    padding: 10px
    margin: 10px auto
    background: #666
    color: #000
    .section-head
      width: 100%
      margin-bottom: 10px
      h1
        margin: 0
    .section-body
      width: 100%
</style>
