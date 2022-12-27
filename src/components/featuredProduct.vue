<template>
  <div class="item-recent-page">
    <div class="item-merch-section">
        <h4 class="__title">Featured Product</h4>

        <hr class="my-3" />
        <div class="merch-detail-section" @click.self="showMerchDialog()">
            <div
            class="merch-avatar"
            :style="`background-image: url(${product.covers[0].cover.thumb.url})`"
            @click.self="showMerchDialog()"
            ></div>
            <div class="info-section" @click.self="showMerchDialog()">
            <div class="side-action-details">
                <div class="__title">
                    {{ product.merchant.username }}
                </div>
                <div class="__subtitle-2">
                    {{ product.name }}
                </div>
                <div class="__subtitle-1 __price">
                    ${{ product.price | formatNumber }}
                </div>
                <v-btn
                    round
                    large
                    dark
                    class="view-product-btn text-capitalize ma-0"
                    @click="showMerchModal = true"
                >
                    view
                </v-btn>
            </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: Object,
    recommendedBy: String,
  },
}
</script>

<style lang="scss" scoped>
.sectionCard {
  // border-radius: 3px;
  // box-shadow: 0 0 2px 0px #c8c8d9;
  background-color: #ffffff;
  padding: 15px;
  margin-bottom: 30px;
  // max-height: 540px
}

.item-recent-page {
    background: #ffffff;
    padding: 30px 20%;
    .item-merch-section {
    @extend .sectionCard;
    margin-top: 0px;
    margin-bottom: 0px;
    cursor: pointer;

    .title {
        color: white;
        font-weight: 300;
        font-size: 24px !important;
        letter-spacing: -0.6px !important;
        border-bottom: 1px solid rgba(215, 215, 215, 0.2);
        padding-bottom: 8px;
        margin-bottom: 16px;
    }
    .merch-detail-section {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        background-color: transparent;
        padding: 0;
        border-radius: 3px;
        .merch-avatar {
        width: 200px;
        height: 200px;
        display: inline-block;
        vertical-align: middle;
        background-size: contain;
        background-position: center;
        overflow: hidden;
        border-radius: 5px;
        border: 3px solid white;
        }
        .info-section {
        vertical-align: middle;
        padding-left: 10px;
        
        .side-action-details {
            text-align: left;
            padding-left: 30px;
            margin-top: -30px;

            .__title {
            text-transform: uppercase;
            font-size: 13px;
            color: #777;
            padding-bottom: 8px;
            }
            .__subtitle-1 {
            font-weight: 500;
            font-size: 18px;
            padding-bottom: 3px;

            &.__price {
                margin-top: -10px;
            }
            }
            .__subtitle-2 {
            text-transform: uppercase;
            font-size: 14px;
            margin-bottom: 20px;
            font-weight: 700;
            }
            .song-btn {
            margin: 0 !important;
            width: 60px !important;
            height: 60px !important;
            background: #ddd8d8 !important;

            i {
                font-size: 40px;
                color: #000000;
            }
            }

            .view-product-btn {
            margin-top: 20px !important;
            background-color: #000000 !important;
            padding: 0 10px;
            }
        }
        .merch-name {
            display: block;
            font-family: 'Work Sans';
            font-weight: 600;
            font-size: 18px;
            letter-spacing: -0.7px;
            cursor: pointer;
            width: 250px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .merch-price {
            display: block;
            font-weight: bolder;
            letter-spacing: -0.6px;
            font-size: 16px;
            cursor: pointer;
        }
        .merch-status-icon {
            width: 15px;
            margin-left: 20px;
            cursor: pointer;
        }
        .link-btn {
            display: block;
            color: rgba(255, 255, 255, 0.52);
            font-size: 16px;
            letter-spacing: -0.6px;
            cursor: pointer;
        }
        }
    }
    }

    .album-reposted-section {
    @extend .sectionCard;
    
    .no-list {
        color: rgba(0, 0, 0, 0.5);;

    }

    & .__title {
        // font-size: 1.2em;
        // margin-left: 20px;
        // margin-top: 8px;
    }

    }
}
</style>

