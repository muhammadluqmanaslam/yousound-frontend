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
        { text: 'Track Title', value: 'name', align: 'left', sortable: false },
        { text: 'Sampled from Yousound', value: 'status', align: 'center', sortable: false },
        { text: '', value: 'status', align: 'center', sortable: false }
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
    album_product () {
      return _.get(this.album, 'products[0]', null)
    }
  },

  created () {
    // this.user = _.get(this.item, 'user', {avatar: {}})
    // this.tracks = _.get(this.item, 'tracks', [])
    this.loadData()
    console.log('album_product', this.album_product)
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
