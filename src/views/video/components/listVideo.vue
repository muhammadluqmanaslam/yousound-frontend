<template>
  <div class="grid-list-comp">
      <div>   
          <v-container fluid px-0>
              <v-layout row wrap>
                <v-flex xs12 video-content-section>
                    <div :class="`${listType}-video`">
                        <div  :class="`${listType}-video-wrapper`">
                            <div class="video-details">
                                <div
                                class="thumbnail"

                                :style="{
                                'background-image':
                                    'url(' +
                                    item.cover.thumb
                                    .url +
                                    ')',
                                }"
                                ></div>
                                <div class="details">
                                    <h3>{{ item.name }}</h3>
                                    <user-tag :user="item.user" />
                                </div>
                            </div>

                            <div class="actions">
                                <v-btn class="text-btn">Edit</v-btn>

                                <label class="btn-divider"></label>

                                <v-btn class="text-btn" @click="openVideoDeleteConfirmDialog()">Delete</v-btn>
                            </div>
                        </div>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>
      </div>
      <v-dialog v-model="show_video_delete_confirm_dialog">
        <v-card>
            <v-card-title class="headline">Delete Video</v-card-title>
            <v-card-text
                >If you click OK, your followers won't see the video any more. Click
                OK to delete <b>{{ item.name }}</b>,
                <br />
                or click Cancel.</v-card-text
            >
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                class="blue--text darken-1"
                flat="flat"
                @click.native="deleteVideo(item.id)"
                >Ok</v-btn
                >
                <v-btn
                class="blue--text darken-1"
                flat="flat"
                @click.native="closeVideoDeleteConfirmDialog()"
                >Cancel</v-btn
                >
            </v-card-actions>
        </v-card>
      </v-dialog>
  </div>
</template>

<script>
import UserTag from '@/components/user_tag'
export default {
  components: {
    UserTag,
  },

  props: {
    item: Object,
    listType: {
      type: String,
      default: 'list',
    },
  },
  data() {
    return {
      show_video_delete_confirm_dialog: false,
    }
  },
  methods: {
    openVideoDeleteConfirmDialog(album) {
      this.show_video_delete_confirm_dialog = true
    },
    closeVideoDeleteConfirmDialog() {
      this.show_video_delete_confirm_dialog = false
    },
    deleteVideo(id) {
    },
  },
}
</script>

<style scoped lang="scss">
.video-content-section{
    background: #FFFFFF;
    border: 0.75px solid #D7D7D7;
    padding: 7.5px !important;
}
.list-video,
.grid-video {
    .video-details {
        display: flex;
        align-items: center;
    }
}

.list-video {
    &-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .thumbnail {
            width: 135px;
            height: 75px;
            background: #D5D5D5;
            border-radius: 3px;
            margin: 7.5px;
            background-size: cover;
            overflow: hidden;
            background-position: center;
            margin-right: 15px;
        }

        .actions {            
            display: flex;
            align-items: center;

            .btn-divider {
            }
            .text-btn {
                height: 22.5px;
                font-size: 14px;
                color: #3A92FF;
                letter-spacing: 0;
            }
        }
    }
}
</style>
