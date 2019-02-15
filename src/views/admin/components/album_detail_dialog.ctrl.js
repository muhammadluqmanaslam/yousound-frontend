import _ from 'lodash'
import AlbumService from '@/services/album'

export default {
  props: {
    item: {
      type: Object,
      required: true
    },

    dismiss: {
      type: Function,
      required: true
    }
  },

  data () {
    return {
      tracks_headers: [
        { text: 'Name', value: 'name', align: 'left' },
        { text: '', value: 'status', align: 'center' }
      ],
      album: {
        cover: {}
      },
      user: {
        avatar: {}
      },
      tracks: [],
      isPageReady: true
    }
  },

  computed: {
  },

  created () {
    // this.user = _.get(this.item, 'user', {avatar: {}})
    // this.tracks = _.get(this.item, 'tracks', [])
    this.loadData()
  },

  methods: {
    loadData () {
      Promise.all([
        AlbumService.getAlbum(this.item.slug)
      ]).then(values => {
        this.album = values[0].body
        this.user = _.get(this.album, 'user', {avatar: {}})
        this.tracks = _.get(this.album, 'tracks', [])
      })
    }
  }
}
