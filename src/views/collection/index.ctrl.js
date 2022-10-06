import StreamService from "@/services/stream";

import productCard from "@/components/productcard"
import trackCard from "@/components/trackcard"
import contentTopHeader from "@/components/contentTopHeader"

import repostMusic from "./repostMusic"
import repostVideos from "./repostVideos"
import repostProducts from "./repostProducts"

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
    },
    created() {
        this.getStream()

        const activeTab = this.$route.params.activeTab
        if (activeTab) {
            this.activeTab = activeTab
        }
    },
}