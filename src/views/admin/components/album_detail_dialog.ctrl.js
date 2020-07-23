import _ from 'lodash'
import AlbumService from '@/services/album'
import TrackService from '@/services/track'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },

    dismiss: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      tracks_headers: [
        { text: 'Track Title', value: 'name', align: 'left', sortable: false },
        {
          text: 'Sampled from Yousound',
          value: 'status',
          align: 'center',
          sortable: false,
        },
        { text: 'Played', value: 'status', align: 'played', sortable: false },
        { text: '', value: 'status', align: 'center', sortable: false },
      ],
      album: {
        cover: {},
      },
      user: {
        avatar: {},
      },
      tracks: [],
      show_album_credit_dialog: false,
      isPageReady: true,
    }
  },

  computed: {
    album_product() {
      return _.get(this.album, 'products[0]', null)
    },

    genres() {
      return _.map(this.album.genres, 'name').join(', ')
    },
  },

  methods: {
    loadData() {
      Promise.all([AlbumService.getAlbum(this.item.slug)]).then((values) => {
        this.album = values[0].body
        this.user = _.get(this.album, 'user', { avatar: {} })
        this.tracks = _.get(this.album, 'tracks', [])
      })
    },

    isSampledTrack(track_id) {
      return _.find(
        this.album.samplings,
        (s) => s.sampling_track_id == track_id
      )
    },

    deleteAlbum() {
      // console.log('deleteAlbum', this.album.id)
      this.$store.dispatch('error/showLoadingActivity', true)
      AlbumService.deleteAlbum(this.album.id)
        .then((response) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.dismiss()
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },

    deleteTrack(track_id) {
      // console.log('deleteTrack', track_id)
      this.$store.dispatch('error/showLoadingActivity', true)
      TrackService.deleteTrack(track_id)
        .then((response) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          _.remove(this.tracks, (item) => {
            return item.id == track_id
          })
          const arr = this.tracks.slice()
          this.tracks = arr
          if (this.tracks.length === 0) {
            this.dismiss()
          }
        })
        .catch((e) => {
          this.$store.dispatch('error/showLoadingActivity', false)
          this.$store.dispatch(
            'error/showErrorToast',
            e.body.errors || [e.body]
          )
        })
    },
  },

  created() {
    // this.user = _.get(this.item, 'user', {avatar: {}})
    // this.tracks = _.get(this.item, 'tracks', [])
    this.loadData()
    console.log('album_product', this.album_product)
  },
}
