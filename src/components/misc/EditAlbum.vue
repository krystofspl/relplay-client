<template>
  <div id="edit-album">
    <a href="#" @click="setModalEntity({entityId: album.id}); setModalAction('editAlbumTracks')">{{ $t('components.EditAlbum.editAlbumTracks') }}</a>
    <a href="#" @click="getSimilarArtistSuggestions(); getMusicBrainzMetadata()">{{ $t('components.EditAlbum.refreshMetadata') }}</a>

    <label>{{ $t('components.AlbumDetails.albumTitle') }}</label>
    <input type="text" name="title" v-model="title">
    Suggestions: <span v-for="albumTitle in albumTitleRecommendations">
      <a href="#" @click="setTitleValue(albumTitle)">{{ albumTitle }}</a>&nbsp;
    </span>

    <label for="inInbox">{{ $t('components.AlbumDetails.inInbox') }}</label>
    <input type="checkbox" name="inInbox" v-model="inInbox">

    <label>{{ $t('components.AlbumDetails.year') }}</label>
    <input type="text" name="year" v-model="year">
    Suggestions: <span v-for="year in recommendations.year">
      <a href="#" @click="setYearValue(year)">{{ year }}</a>&nbsp;
    </span>

    <label for="mainArtist">{{ $t('components.AlbumDetails.mainArtist') }}</label>
    <a href="#" @click="createArtistPrompt(true)">{{ $t('components.EditAlbum.createArtist') }}</a>
    <multiselect name="mainArtist" v-model="mainArtist"
      :options="availableArtists"
      :value="mainArtist"
      :allow-empty="false"
      :multiple="false"
      :max-height="120"
      :hide-selected="true"
      track-by="id"
      label="name"
      ></multiselect>

    Suggestions: <span v-for="mainArtist in recommendations.mainArtists">
      <a href="#" @click="addOrCreateMainArtist(mainArtist)">{{ mainArtist }}</a>&nbsp;
    </span>

    <label for="artists">{{ $t('components.AlbumDetails.artists') }}</label>
    <a href="#" @click="createArtistPrompt(false)">{{ $t('components.EditAlbum.createArtist') }}</a>
    <multiselect name="artists" v-model="artists"
      :options="availableArtists"
      :value="artists"
      :allow-empty="true"
      :multiple="true"
      :hide-selected="true"
      :close-on-select="false"
      :max-height="120"
      track-by="name"
      label="name"
      ></multiselect>

    Suggestions: <span v-for="otherArtist in recommendations.otherArtists">
      <a href="#" @click="addOrCreateOtherArtist(otherArtist)">{{ otherArtist }}</a>&nbsp;
    </span>

    <label for="genres">{{ $t('components.AlbumDetails.genres') }}</label>
    <a href="#" @click="setModalEntity({genreId: null}); setModalAction('editGenre')">{{ $t('components.EditAlbum.editGenres') }}</a>
    <multiselect name="genres" v-model="genres"
      :options="availableGenres"
      :value="genres"
      :allow-empty="true"
      :multiple="true"
      :hide-selected="true"
      :close-on-select="false"
      :max-height="120"
      label="title"
      track-by="title"
      ></multiselect>
    <br><br><br>
    <button v-on:click="submit()" style="float: right; font-weight: bold;">Save</button>
    <br><br><br><br>
  </div>
</template>

<script>
  import { artistGetters } from '../../mixins/getters/artistGetters.js'
  import { albumGetters } from '../../mixins/getters/albumGetters.js'
  import { trackGetters } from '../../mixins/getters/trackGetters.js'
  import { genreGetters } from '../../mixins/getters/genreGetters.js'
  import { mapGetters, mapActions } from 'vuex'
  import Icon from 'vue-awesome/components/Icon'
  import Multiselect from 'vue-multiselect'
  import 'vue-awesome/icons/'
  import dbp from 'dbpedia-sparql-client'
  var _ = require('lodash')
  var NodeBrainz = require('nodebrainz')

  export default {
    data: function () {
      var self = this
      return {
        title: self.album.title,
        inInbox: self.album.inInbox,
        year: self.album.year,
        mainArtist: null,
        artists: [],
        genres: [],
        recommendations: {
          similarArtists: [],
          MBmetadata: null,
          mainArtists: [],
          otherArtists: [],
          year: null
        },
        similarArtists: null,
        MBmetadata: null
      }
    },
    props: ['album'],
    mixins: [artistGetters, albumGetters, genreGetters, trackGetters],
    components: {
      Icon,
      Multiselect
    },
    computed: {
      availableArtists: function () {
        return Object.values(this.getArtists()).sort((a, b) => { return a.name.localeCompare(b.title) })
      },
      availableGenres: function () {
        return Object.values(this.getGenres()).sort((a, b) => { return a.title.localeCompare(b.title) })
      },
      tracks: function () {
        return this.getTracksForAlbum(this.album.albumId)
      },
      albumTitleRecommendations: function () {
        var names = []
        if (this.recommendations.MBmetadata) {
          names = _.uniq(this.recommendations.MBmetadata.map(r => { return r.title }))
        }
        return names
      }
    },
    methods: {
      ...mapGetters(['getArtists', 'getGenres']),
      ...mapActions(['setModalAction', 'toggleModalAction', 'showModal', 'hideModal', 'setModalEntity', 'createArtist']),
      setTitleValue: function (albumTitle) {
        this.title = albumTitle
      },
      setYearValue: function (year) {
        this.year = year
      },
      submit: function () {
        // Prepare data
        var newData = {
          id: this.album.id,
          callback: function (err, obj) {
            console.log(err)
            console.log(obj)
          }
        }
        if (this.title !== this.album.title) {
          newData.title = this.title
        }
        if (this.inInbox !== this.album.inInbox) {
          newData.inInbox = this.inInbox
        }
        if (this.year !== this.album.year) {
          newData.year = this.year
        }
        if (this.mainArtist && this.mainArtist.id !== this.album.mainArtist) {
          newData.mainArtist = this.mainArtist.id
        }
        if (!_.isEqual(this.artists.map(i => i.id).sort(), this.album.artists.sort())) {
          newData.artists = this.artists.map(a => a.id)
        }
        if (!_.isEqual(this.genres.map(i => i.id).sort(), this.album.genres.sort())) {
          newData.genres = this.genres.map(g => g.id)
        }
        // Send
        this.$store.dispatch('updateAlbum', newData)
        this.setModalAction('showAlbum')
      },
      createArtistPrompt: function (forMainArtistField) {
        var artistName = window.prompt('Artist name')
        if (artistName !== null) {
          this.createArtist({
            name: artistName,
            callback: (err, res) => {
              if (err) console.log(err)
              if (forMainArtistField) {
                this.mainArtist = res
              } else {
                this.artists.push(res)
              }
            }
          })
        }
      },
      addOrCreateMainArtist: function (artistName) {
        var allArtists = _.values(this.getArtists())
        if (_.includes(allArtists.map(a => a.name), artistName)) {
          this.mainArtist = _.find(allArtists, ['name', artistName])
        } else { // Create the artist and add it
          this.createArtist({
            name: artistName,
            callback: (err, res) => {
              if (err) console.log(err)
              this.mainArtist = res
            }
          })
        }
      },
      addOrCreateOtherArtist: function (artistName) {
        var allArtists = _.values(this.getArtists())
        if (_.includes(allArtists.map(a => a.name), artistName)) {
          this.artists.push(_.find(allArtists, ['name', artistName]))
        } else { // Create the artist and add it
          this.createArtist({
            name: artistName,
            callback: (err, res) => {
              if (err) console.log(err)
              this.artists.push(res)
            }
          })
        }
      },
      getMusicBrainzMetadata: function () {
        var self = this
        self.recommendations.MBmetadata = []
        self.recommendations.mainArtists = []
        self.recommendations.otherArtists = []
        self.recommendations.year = []
        var nb = new NodeBrainz({userAgent: 'graph-music-library/0.0.1', retryOn: true, retryDelay: 3000, retryCount: 3})
        // Look for releases with specified artist name and album title
        nb.search('release', {artist: this.mainArtist.name, release: this.title, limit: 5}, (err, response) => {
          if (err) console.log(err)
          var releases = response.releases.map(r => { return r.id })

          // Grab data for each retrieved release
          releases.forEach(release => {
            nb.release(release, {inc: 'recordings+artists'}, (err, response) => {
              if (err) console.log(err)
              if (response) {
                // Grab related artists
                response['artist-credit'].forEach(artistCredit => {
                  var creditedArtistId = artistCredit.artist.id
                  nb.artist(creditedArtistId, {inc: 'artist-rels'}, (err, response) => {
                    if (err) console.log(err)
                    self.recommendations.mainArtists = _.uniq(_.concat(self.recommendations.mainArtists, response.name))
                    if (response && response.relations && response.relations.length) {
                      var relatedArtistNames = response.relations.filter(r => {
                        return r.type === 'member of band'
                      }).map(r => {
                        return r.artist.name
                      })
                      self.recommendations.otherArtists = _.uniq(_.concat(self.recommendations.otherArtists, relatedArtistNames))
                    }
                  })
                })

                // Grab tracks metadata
                var releaseVersions = response.media.map(r => {
                  return {
                    trackCount: r['track-count'],
                    tracks: r.tracks.map(t => {
                      return {
                        trackNr: t.number,
                        title: t.title,
                        length: t.length
                      }
                    })
                  }
                })

                // Grab album metadata
                self.recommendations.MBmetadata.push({
                  title: response.title,
                  disambiguation: response.disambiguation,
                  country: response.country,
                  releases: releaseVersions
                })
                self.recommendations.year = response.date.match(/[0-9]{4}/g)
              }
            })
          })
        })
        // lookup release inc recording
      },
      getSimilarArtistSuggestions: function () {
        var self = this
        self.recommendations.similarArtists = 'loading...'
        var query = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX schema: <http://schema.org/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX dbpedia2: <http://dbpedia.org/property/>

        SELECT (SAMPLE(?artistN) as ?aN) (SAMPLE(?relatedArtistN) as ?raN)
        WHERE {
        ?artist a ?artistType .
        ?relatedArtist a ?artistType .

        {?artist foaf:name ?artistN} UNION {?artist rdfs:label ?artistN}

        { ?artist dbo:associatedMusicalArtist ?relatedArtist }
        UNION { ?relatedArtist dbo:associatedMusicalArtist ?artist }
        UNION { ?relatedArtist dbpedia2:associatedActs ?artist }
        UNION { ?artist dbpedia2:associatedActs ?relatedArtist }
        UNION { ?artist rdfs:seeAlso ?relatedArtist }
        UNION { ?artist dbo:bandMember ?relatedArtist }
        UNION { ?relatedArtist dbo:bandMember ?artist }
        UNION { ?artist dbo:formerBandMember ?relatedArtist }
        UNION { ?relatedArtist dbo:formerBandMember ?artist }

        {?relatedArtist foaf:name ?relatedArtistN }
        UNION
        {?relatedArtist rdfs:label ?relatedArtistN }

        FILTER (?artistN = "${self.mainArtist.name}"@en)
        FILTER (?artistType IN (yago:Musician110339966, yago:Group100031264, dbo:Artist, schema:MusicGroup))
        FILTER (lang(?relatedArtistN) = "en")
        }
        GROUP BY ?artist ?relatedArtist
        `
        dbp.client().query(query).timeout(15000).asJson().then(result => {
          self.recommendations.similarArtists = result.results.bindings.map(r => {
            return r['raN'].value
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    created: function () {
      var self = this
      this.mainArtist = this.getArtist(this.album.mainArtist)
      this.artists = this.album.artists.map(artistId => {
        return self.getArtist(artistId)
      })
      this.genres = this.album.genres.map(genreId => {
        return self.getGenre(genreId)
      })
      this.getSimilarArtistSuggestions()
      this.getMusicBrainzMetadata()
    }
  }
</script>

<style lang="sass">
#edit-album
  min-height: 400px
  label
    font-weight: bold
    display: block
    width: 100%
    padding-top: 5px
  input
    border: 1px solid #000
    background: #888
    color: #000
    border-radius: none
    &::placeholder
      color: #000
    &:hover
      border: 1px solid #CCC
    &:focus
      border: 2px solid #000
      background: #999
  input[type=text]
    width: 100%
    padding: 5px
    -webkit-box-sizing: border-box
    -moz-box-sizing: border-box
    box-sizing: border-box

.multiselect
  border-radius: 0
  .multiselect__tags
    border: 1px solid #000
    background: #888
    border-radius: 0
    padding: 0
    &:hover
      border: 1px solid #CCC
    .multiselect__input, .multiselect__single
      border: none !important
      border-radius: 0
      &:focus, &:hover
        background: #000
    span.multiselect__tag
      background: #666
      border: 1px solid #333
      margin: 2px 0 0 2px
  .multiselect__content
    background: #888
    border-radius: 0
    border: 1px solid #000
    .multiselect__option
      background: #888
    .multiselect__option--active
      background: yellow
    .multiselect__option--highlight
      background: #666
      &::after
        background: red
</style>