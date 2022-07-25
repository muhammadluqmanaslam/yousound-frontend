<template>
  <div class="post-thought-modal">
    <v-dialog
      v-model="post_thought_active"
      content-class="post-thought-dialog"
      width="800"
    >
      <div class="post-thought-card">
        <v-container fluid grid-list-sm>
          <v-layout wrap row>
            <v-flex xs2 post-thought-avatar>
                <div class="space-decoy"></div>
                <user-tag showAvatar hideName hideTick :user="currentUser" width="80" height="80" />
            </v-flex>
            <v-flex xs10 post-thought-wrapper>
              <h2 class="_title">Share your thought</h2>

              <div class="post-thought-action">
                <div class="thought-layer thought-input">
                    <textarea
                        v-model.trim="thought"
                        cols="300"
                        :maxlength="thoughtMaxChar"
                        class="thought-input-area"
                        placeholder="share your thought..."
                        ref="thought"
                    >
                    </textarea>
                    <div class="char-count">
                        <span :class="{'red--text': charCount == thoughtMaxChar }">{{ charCount }}</span> / 
                        <span>{{ thoughtMaxChar }}</span>
                    </div>
                </div>

                <div v-if="Object.keys(stream_assoc).length" class="thought-layer thought-attachment-selected">
                    <div class="attach-info">
                        <div class="__cover" :style="{ 'background-image': 'url(' + attachCover + ')' }"></div>
                        <div class="__details">
                            <div class="_title"></div>
                            <div class="_info"></div>
                        </div>
                    </div>
                    <v-icon class="attach-cancel cursor-pointer" @click="removeAttach()">add</v-icon>
                </div>
                
                <div class="thought-layer thought-attachment-select cursor-pointer">
                    <v-icon class="attach-icon">attachment</v-icon>
                    <attach
                      attachPickerTitle="Attach content to your thought"
                      ref="assocAttach"
                      ctaTitle="Select Attachment"
                      @getAssoc="getAssoc"
                      dataOnlyMode
                    />
                </div>
              </div>

              <div class="post-thought-submit">
                  <v-switch
                    v-model="allowAttachmentReply"
                    label="Allow replies with attachment"
                    color="green"
                    hide-details
                    class="trunc"
                  ></v-switch>

                    <v-btn
                        round
                        depressed 
                        class="post-thought-btn white--text"
                        @click="post_thought_active = true" 
                    >
                        <!-- <img :src="require('../../../static/images/post-thought.svg')" width="17" class="mr-2" /> -->
                        <span>Post to feed</span>
                    </v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import UserTag from '@/components/user_tag'
import Attach from '@/views/video/components/attach'
// import AttachSlide from '@/components/attachSlide'

export default {
  components: {
    UserTag,
    Attach,
    // AttachSlide,
  },
  data() {
    return {
      thought: '',
      allowAttachmentReply: false,
      post_thought_active: false,
      thoughtMaxChar: 300,
      stream_assoc: {},
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
    charCount() {
      return this.thought.length
    },
    attachCover() {
      switch (this.stream_assoc.type) {
        case 'ShopProduct':
          return this.stream_assoc.value.covers[0].cover.thumb.url
        case 'Album':
          return this.stream_assoc.value.cover.thumb.url
        default:
          break;
      }
    },
  },
  watch: {},
  created() {},
  methods: {
    getAssoc(data) {
      this.stream_assoc = data
    },
    initPostThought() {
      this.post_thought_active = true
    },
    removeAttach() {
      this.$refs.assocAttach.removeAttach()
    //   reset stream.assoc
      this.stream_assoc = {}
    },
  },
  mounted() {},
}
</script>

<style lang="scss" scoped>
.post-thought {
    &-card {
        background-color: #ffffff;
        width: 100%;
        min-height: 400px;
        padding-left: 10px;
        padding-right: 30px;
        padding-top: 30px;
        padding-bottom: 30px;
    }

    &-avatar {
        display: flex;
        flex-direction: column;
        // justify-content: center;
        align-items: center;

        .space-decoy {
            height: 35px;
        }
    }

    &-wrapper {
        ._title {
            height: 35px;
        }
    }

    &-action {
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 6px;

        .thought-layer {
            padding: 10px;
            &:not(:first-child) {
                border-top: 1px solid rgba(0, 0, 0, 0.2);
            }

            &.thought-attachment {
                &-selected {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .attach-info {
                        display: flex;
                        justify-content: space-between;

                        .__cover {
                            width: 70px;
                            height: 70px;
                            border-radius: 3px;
                            background-color: grey;
                            margin-right: 20px;
                            background-position: center;
                            background-size: cover;
                        }
                    }

                    .attach-cancel {
                        transform: rotate(45deg);
                        color: #000000;
                    }
                }
                &-select {
                    display: flex;
                    align-items: center;
                    color: #0386FF;
                    font-size: 16px;
                    font-weight: 500;
                }
            }
        }

        textarea {
            border: none;
            width: 100%;
            min-height: 120px;
            resize: none;
            &:focus {
              outline: 0;
            }
        }
    }

    &-submit {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;

        .post-thought-btn {
            background: #0386FF !important;
            font-weight: 800;
        }
    }
}
</style>
