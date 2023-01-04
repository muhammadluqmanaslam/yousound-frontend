<template>
  <div class="repost-comp repost-music">

    <div v-if="showBanner"  class="repost-banner">
			<div class="dflex gap-25 align-center justify-space-between">
				<div class="repost-content">

				<div class="dflex align-center mb-4">
					<img src="../../assets/build-icon.svg" width="25">
					<h2 class="repost-head">Build your collection</h2>
				</div>
				<p class="repost-text">Create playlists or shopping lists for all of the albums, videos & products you discover</p>
			</div>

			<div class="repost-img">
				<img src="../../assets/music-drop.gif" width="100%"/>
			</div>

			</div>

			<div class="repost-banner-close" @click="closeBanner()">
				<img src="../../assets/cross.svg" width="15px">
			</div>
		</div>
		<div class="playlists">
			<div class="title dflex align-center _intro">
				<div>{{ playlistLen() }} Playlists</div>
				<div class="_action">View All</div>
			</div>

			<div class="dflex playlist-container">
				<div
					v-for="(playlist, index) in this.playlists"
					:key="index"
					class="playlist-holder"
					@click="$router.push({path: `/playlist/${playlist.id}` })"
				>
					<div class="playlist-box">
						<div class="playlist-images">
							<ul>
								<li v-for="(playlistImage, index) in playlistImageList(playlist)">
									<img
										:src="playlistImage"
										width="30"
										alt="playlist icon"
									/>
								</li>
							</ul>
						</div>
						<div class="playlist-text">
						 {{ playlist.name }}
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="playlist-container">
			<div class="playlist-holder">
				<div class="playlist-box">
					<div class="playlist-images with-button" @click="(addToPlaylistActive = true)">
						<v-btn></v-btn>
					</div>
					<div class="playlist-text">
						New Playlist
					</div>
				</div>
			</div>
		</div>

    <div class="music playlist-music">
			<div class="title dflex align-center justify-space-between _intro">
        <div class="_top mb-3"> {{ products.length }} {{ "product" | pluralize(products.length) }} </div>

        <div v-if="selectProductsMode" class="selectAlbumsMode _action">
          <v-btn round dark depressed @click="openAddToPlaylist()"> Add selected to... </v-btn>
          <span @click="toggleSelectProductsMode(false)"> Cancel </span>
        </div>
        <div v-else class="dflex align-center">
        
          <input class="input-track" type="text" placeholder="Select Products">

          <v-btn
            round
            dark
            depressed
            class="dflex align-center _action pointer-cursor font-bold"
            @click="toggleSelectProductsMode(true)"
          >
            <v-icon>add</v-icon>
            <span>Select Products</span>
          </v-btn>
        </div>
      </div>

      <div class="list-track-view list-track-view-trackCard list-track-view-video listings">
        <div v-for="(product, index) in tempProduct" :key="index" class="list-track-view-item listing cursor-none">
          <product-card
            :dataObject="product"
            sideTabView
            :hideOverlay="false"
            hideOptionCount
            altMeta
            noMeta
            altMetaPrice
          />

          <div v-if="selectProductsMode" class="selectMusic">
            <input
              v-model="selectedProducts"
              :value="product"
              type="checkbox"
              class="selectMusic-check"
              :id="`check-${index}`"
            />
            <v-icon
              v-if="selectedProducts.includes(product)"
              class="check-icon"
              @click="removeProduct(product.id)"
            >
              check
            </v-icon>
          </div>

        </div>
      </div>
    </div>
    <add-to-playlist v-if="addToPlaylistActive" :playlists="this.playlists" :addToPlaylist="addToPlaylistActive" :selectedItems="this.selectedProducts" type="product" @closeAddToPlaylist="closeAddToPlaylist" @methodThatForcesUpdate="methodThatForcesUpdate" />

  </div>
</template>

<script>
import productCard from "@/components/productcard";
import addToPlaylist from "@/views/Playlists/addToPlaylist";

export default {
  components: {
    productCard,
    addToPlaylist,
  },
  props: {
		products: Array,
		playlists: Array,
	},

  data() {
    return {
      showBanner: true,
      addToPlaylistActive: false,
      selectProductsMode: false,
      selectedProducts: [],
    };
  },
  methods: {
    methodThatForcesUpdate() {
      this.$emit("methodThatForcesUpdate");
    },

    playlistLen() {
			return this.playlists.length;;
		},

    toggleSelectProductsMode(status) {
			this.selectProductsMode = status
			if (!status) {
				this.selectedProducts = []
			}
		},
    removeProduct(id) {
			this.selectedProducts = this.selectedProducts.filter(product => product.id !== id)
		},

    closeBanner(){
			this.showBanner = false;
		},

    openAddToPlaylist() {
			if (this.selectedProducts.length) {
				this.addToPlaylistActive = true
			}
		},
    closeAddToPlaylist(isPartial) {
			if (!isPartial) {
				this.toggleSelectProductsMode()
			}
			this.addToPlaylistActive = false
		},

    playlistImageList(playlist) {
			let playlistImages = []
			const playlistDetails = playlist.playlist_details
			for(let i = 0; i < playlistDetails.length; i++) {
				playlistImages.push(playlistDetails[i].covers[0].cover.url)
			}
			if(playlistImages.length < 4) {
				while(playlistImages.length != 4) {
					console.log(playlistImages.length)
					playlistImages.push(require('@/assets/playlist-grey.svg'))
				}
			}
			return playlistImages;
		},
  },
  computed: {
    tempProduct() {
      let products = []
      for (let i = 0; i < this.products.length; i++) {
        let product = this.products[i]
        let merchant = product.merchant

        products.push({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          reposted: product.reposted,
          stock: product.stock,
          sold: product.sold,
          stock_status: product.stock_status,
          collaborators_count: 0,
          show_status: product.show_status,
          status: product.status,
          collaborators: product.collaborators,
          creator_share: product.creator_share,
          creator_recoup_cost: product.creator_recoup_cost,
          digital_content_name: product.digital_content_name,
          merchant: merchant,
          category: product.category,
          variants: product.variants,
          shipments: product.shipments,
          covers: product.covers,
        })
      }

      return products;
    },
  },
};
</script>

<style src="../../../static/styles/repost.scss" lang="scss" scoped></style>
