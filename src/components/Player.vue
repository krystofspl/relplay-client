<template>
  <div id="player">
    <!-- nothing here, just the javascript part -->
  </div>
</template>

<script>
import { Howl } from 'howler'
import { mapGetters, mapActions } from 'vuex'
var _ = require('lodash')

export default {
  data: function () {
    return {
      howlPlaylist: [],
      howlPlayingTrackId: null,
      howlProgress: null
    }
  },
  methods: {
    ...mapActions(['playerSetProgress', 'playerSetNowPlaying', 'playerNext', 'playerSetState']),
    play: function () {
      console.log('Playing')
      this.playerSetState({ state: 'playing' })
      var self = this
      var sound = self.getHowl(self.howlPlayingTrackId)
      if (sound) sound.play()
    },
    pause: function () {
      console.log('Pausing')
      var self = this
      var sound = this.getHowl(self.howlPlayingTrackId)
      if (sound) sound.pause()
    },
    stopAllHowlPlayback: function () {
      console.log('Stopping')
      var self = this
      var sound = this.getHowl(self.howlPlayingTrackId)
      if (sound) sound.stop()
      for (let i = 0; i < self.howlPlaylist.length; i++) {
        self.howlPlaylist[i].howl.stop()
      }
    },
    step: function () {
      var self = this
      var sound = this.getHowl(self.howlPlayingTrackId)
      if (sound) {
        var seek = sound.seek() || 0
        var newPosition = (seek / sound.duration() * 100 || 0)
        // Save progress once in a while, gets saved to $store by watcher
        if (Math.round((newPosition * 100) % 1) === 0) {
          self.howlProgress = newPosition
        }
        if (sound.playing()) {
          window.requestAnimationFrame(self.step.bind(self))
        }
      }
    },
    getHowlPlayingTrack: function () {
      var self = this
      for (let i = 0; i < self.howlPlaylist.length; i++) {
        if (self.howlPlaylist[i].howl.playing()) return self.howlPlaylist[i]
      }
      return null
    },
    getHowl: function (trackId) {
      var self = this
      var track = _.find(self.howlPlaylist, obj => {
        return obj.trackId === trackId
      })
      if (track && track.howl) {
        return track.howl
      } else {
        return null
      }
    },
    setNowPlayingHowl: function (trackId) {
      this.howlPlayingTrackId = trackId
    },
    updateHowlPlaylist: function (playlist) {
      var self = this
      var oldPlaylist = self.howlPlaylist
      var playingTrack = self.getHowlPlayingTrack()
      var addedTracksList = []
      var newPlaylist = playlist.map(track => {
        var foundTrack = _.find(oldPlaylist, t => { return t.trackId === track })
        addedTracksList.push(track)
        // Preserve playing track so that control isn't lost
        if (playingTrack && track === playingTrack.trackId) {
          return playingTrack
        // Preserve loaded tracks so that bandwidth is saved
        } else if (typeof foundTrack !== 'undefined') {
          return foundTrack
        // Add new tracks
        } else {
          return {
            trackId: track,
            howl: new Howl({
              src: [self.$store.state.settings.global.backendUrl + 'tracks/' + track + '/file.mp3'],
              html5: true,
              onplay: function () {
                window.requestAnimationFrame(self.step.bind(self))
              },
              onend: function () {
                self.playerNext()
              }
            })
          }
        }
      })
      // Stop playback if playing track deleted
      if (playingTrack && playlist.indexOf(playingTrack.trackId) === -1) {
        self.stopAllHowlPlayback()
        self.howlProgress = 0
        self.playerSetNowPlaying({ id: null })
      }
      // Set new playlist
      self.howlPlaylist = newPlaylist
    }
  },
  computed: {
    ...mapGetters(['getPlayerState', 'getPlaylist', 'getNowPlayingId'])
  },
  watch: {
    getPlayerState: function () {
      console.log('Player set to ' + this.getPlayerState)
      if (this.getPlayerState === 'playing') {
        if (!this.getHowlPlayingTrack()) this.play()
      } else if (this.getPlayerState === 'paused') {
        this.pause()
      }
    },
    getPlaylist: function () {
      this.updateHowlPlaylist(this.getPlaylist)
    },
    getNowPlayingId: function () {
      var self = this
      self.stopAllHowlPlayback()
      if (self.getNowPlayingId === null) {
        self.howlProgress = 0
        self.playerSetState({ state: 'paused' })
      } else {
        self.setNowPlayingHowl(self.getNowPlayingId)
        self.play()
      }
    },
    howlProgress: function () {
      var self = this
      this.playerSetProgress({ progress: self.howlProgress })
    }
  }
}
</script>

<style lang="sass" scoped>
#player
  position: absolute
  left: 10
  top: 10
  font-size: 50px
</style>