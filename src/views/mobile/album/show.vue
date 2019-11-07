<template>
  <div class="mobile-page mobile-album-show-page">
    <h2>Mobile Yousound</h2>

    <div class="album">
      <div class="album-image"></div>
      <div class="album-title"></div>
      <div class="album-artist-name">
        <span>By</span>
        <label>{{ album.user.display_name}}</label>
      </div>
      <div class="tracks">
        <div class="track">
        </div>
      </div>
    </div>

    <v-divider/>

    <section class="download-info-section">
      <h3>Download the app</h3>
      <p>Free streaming & downloading</p>
      <p>Shop artists & brands</p>
      <p>Share content & earn money</p>
      <p>No Ads.</p>
    </section>

    <v-divider/>

    <section class="download-section">
      <!-- <img src="/static/images/nav_logo_white_old.png">
      <img src="/static/images/nav_logo_white_old.png"> -->
    </section>

    <v-divider/>

    <v-footer class="my-mobile-footer">
      <a href="#">Terms of Service</a>
      <a href="#">Privacy</a>
      <a href="#">About</a>
      <div class="copyright">© {{ new Date().getFullYear() }} YouSound, Inc.</div>
    </v-footer>
  </div>
</template>

<script type="text/javascript">
import AlbumService from '@/services/album'

export default {
  data () {
    return {
      slug: null,
      album: {
        name: '',
        user: {
          display_name: ''
        },
        cover: {
          large: ''
        }
      },
      isPageReady: false
    }
  },

  methods: {
    loadData () {
      this.slug = this.$route.params.slug
      AlbumService.getAlbum(this.slug).then(response => {
        this.album = response.body
      })
    }
  },

  created () {
    this.$store.dispatch('navigator/goNextState', { page: 'album', tab: '' })

    this.loadData()
  }
}
</script>
