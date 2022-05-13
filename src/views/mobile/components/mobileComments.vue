<template>
  <v-dialog
    v-model="initComment"
    transition="slide-up"
    fullscreen
    content-class="mobile-comment-dialog"
  >
    <div class="dflex top-wrapper">
      <div class="centerLogo text-center flex-grow">
        <img src='../../../../static/images/nav_logo_primary.png' width="120" />
      </div>
      <img src='../../../../static/images/ic_close_dark.svg' class="cursor-pointer" @click="closeCommentDialog()" />
    </div>

    <div v-if="isAssocPassed" class="_assoc">
      <slot name="_assoc"></slot>
    </div>

    <div class="width100 comments-comp" :class="{isAssocPassed}">
      <div class="box">
        <div class="box__content">
          <div v-if="!hideCommentCount" class="comment__count">{{ comments.length }} {{ "comment" | pluralize(comments.length) }}</div>
            <chat
              v-if="!hideComments"
              :items="comments"
              hideDatedString
              showShortAge
            />
        </div>
      </div>    

      <comment-input
        :item="item"
        :roundInput="roundInput"
        :noBorder="noBorder"
        :placeholder="placeholder"
        :aviHeight="aviHeight"
        :aviWidht="aviWidth"
      ></comment-input>
    </div>
  </v-dialog>
</template>

<script>
import CommentService from '@/services/comment'
import Chat from '@/components/chat'
import UserTag from '@/components/user_tag'
import commentInput from '@/components/commentInput'

export default {
  props: {
    comments: Array,
    item: Object,
    roundAvatar: Boolean,
    roundInput: Boolean,
    noBorder: Boolean,
    placeholder: String,
    aviHeight: {
      type: [ String, Number ],
    },
    aviWidth: {
      type: [ String, Number ],
    },
    hideComments: Boolean,
    hideCommentCount: Boolean,
  },
  components: {
    Chat,
    UserTag,
    commentInput,
  },
  data() {
    return {
      commentText: '',
      initComment: false,
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
    isAssocPassed() {
      return this.$slots._assoc
    }
  },
  methods: {
    closeCommentDialog() {
      this.initComment = false

      this.$emit('comment-closed')
    },
    showComments(val) {
      console.log(val);
      // this fn is called via component's ref
      this.initComment = val;
    },
    addComment() {
      if (this.commentText === '') return

      const params = {
        comment: {
          commentable_type: 'Stream',
          commentable_id: this.item.id,
          body: this.commentText,
          status: 'published',
        },
      }

      CommentService.sendComment(params)
        .then((res) => {
          this.comments.unshift(res.body)
          this.commentText = ''
        })
        .catch((e) => {
          this.$store.dispatch(
                'error/showErrorToast',
                e.body.errors || [e.body]
            )
        })
    },
  }
}
</script>

<style lang="scss" scoped>
.comments-comp {
  position: relative;
  padding-top: 15px;

  &.isAssocPassed {
    border-top: 1px solid #d8d3d3;
  }
}
// comments list
.box {
  position: relative;
  width: 100%;
//   border-top: 1px solid #E4E4E4;
  // height: 100%;

  &__header {
    display: flex;
    align-items: center;
    height: 60px;
  }

  &__initComment {
    display: flex;
    align-items: flex-end;
    height: 55px;
    margin: 0 0 15px 0;
  }

  &__content {
    position: relative;
    // padding: 0 15px;

    .comment__count {
      padding: 0 20px 15px 15px;
      border-top: none;
      font-weight: 600;
      letter-spacing: 0
    }
    
    .items {
      position: relative;
      margin-bottom: 10px;

      /deep/.item {
        padding: 0 15px;
      }
      /deep/.item__image {
        width: 42px;
        height: 42px;
      }
      /deep/.item__title {
        a {
          color: #222
        }

        span {
          color: #808080;
          font-weight: 300;
        }
      }
    }

    input[type='text'] {
      border-radius: 4px;
      background-color: #fff;
      border: 1px solid #ccc;
    }
    input[type='text']::placeholder {
      color: #000;
      font-size: 14px;
    }
  }

  &__subtitle {
    margin-top: 4px;
  }
  &__title {
    display: flex;
    align-items: flex-start;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #f3dfdf;
    font-size: 14px;
    font-weight: 700;
    margin-top: 0;
  }
}

// chat input box
.ci {
  display: flex;
  width: 100%;

  &__header {
    width: 55px;
    flex: 0 0 auto;
    display: flex;
    justify-content: flex-start;
  }

  &__image {
    width: 48px;
    height: 48px;
    border-radius: 0;
    background-size: contain;
    background-repeat: no-repeat;

    &.roundAvatar {
      border-radius: 100px;
    }
  }

  input {
    width: 100%;
    padding: 5px 10px;

    &.roundInput {
      border-radius: 90px;
    }
  }
}

.comment_input {
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 1px solid #eaeaea;
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  input {
    width: 100%;
    border-radius: 90px;
    padding: 0 15px;
  }

  .addComment-cta {
    width: 50px;
  }
}
</style>
