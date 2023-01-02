import StreamService from "@/services/stream";
import CollectionService from "@/services/collection"

import productCard from "@/components/productcard"
import trackCard from "@/components/trackcard"
import contentTopHeader from "@/components/contentTopHeader"

import repostMusic from "./repostMusic"
import repostVideos from "./repostVideos"
import repostProducts from "./repostProducts"
import CollectionPlaylist from '@/services/collection_playlist'

export default {
    components: {
        productCard,
        trackCard,
        contentTopHeader,
        repostMusic,
        repostVideos,
        repostProducts,
    },
    data() {
        return {
            activeTab: "music",
            tabs: [
                { id: "music", title: "Music" },
                { id: "videos", title: "Videos" },
                { id: "products", title: "Products" },
            ],
            tracks: null,
            streams: null,
            products: null,
            pageReady: false,
            playlist_data: null,
            playlistTracks: null,
            playlistStreams: null,
        }
    },
    computed: {
        playlists() {
            return this.$store.state.playlist.playlists
        },

        currentUser() {
            return this.$store.state.auth.user
        },
    },

    mounted() {},

    methods: {
        methodThatForcesUpdate() {
            this.getCollectionPlaylist()
            this.loadData()
        },
        onTab(tab) {
            this.activeTab = tab
        },
        isActiveTab(tab) {
            return this.activeTab === tab
        },
        getStream() {
            const vid_params = {
                genre_id: 0,
                only_follows: false,
                page: 1,
                per_page: 10,
            };
            StreamService.getStreams(vid_params)
                .then((response) => {
                    this.videos = response.body.streams;
                })
                .catch((error) => {
                    this.$store.dispatch("error/showErrorToast", [error]);
                });
        },

        async loadData() {
            await CollectionService.getCollections().then(response => {
              this.tracks = response.body.tracks
              this.streams = response.body.streams
              this.products = response.body.products
              this.pageReady = true
            }).catch(exception => {
              this.$store.dispatch("error/showErrorToast", [exception.body.error] || [exception] );
            })
        },
        async getCollectionPlaylist() {
            await CollectionPlaylist.getCollectionPlaylists()
            .then((response) => {
                this.playlist_data = response.body
            })
            .catch((e) => {
                this.$store.dispatch(
                'error/showErrorToast',
                e.body.errors || [e.body]
                )
            })
        },
    },

    async created() {
        await this.getCollectionPlaylist()
        await this.loadData()
        if (this.$route.params.activeTab !== undefined) {
            this.activeTab = this.$route.params.activeTab
        }
    },
}