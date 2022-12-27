<template>
  <div class="comment_input" :class="{noBorder}">
    <user-tag
      :user="currentUser"
      showAvatar
      hideTick
      hideName width="42" height="42"
      class="commenter"
    />

    <input
      v-model.trim="commentText"
      type="text"
      :placeholder="placeholder"
      :class={roundInput}
    />

    <img
      v-if="commentText.length"
      src='../../static/images/ic_send_dark.svg'
      class="ml-3 addComment-cta"
      @click="addComment()"
      />
    <img
      v-else
      src='../../static/images/ic_send.svg'
      class="ml-3 addComment-cta"
    />
  </div>
</template>

<script>
import UserTag from '@/components/user_tag'
import CommentService from '@/services/comment'

export default {
  props: {
    item: Object,
    roundInput: Boolean,
    noBorder: Boolean,
    placeholder: {
      type: String,
      default: 'Leave a comment...',
    },
    aviHeight: {
      type: [ String, Number ],
    },
    aviWidth: {
      type: [ String, Number ],
    },
  },
  components: {
    UserTag,
  },
  data() {
    return {
      commentText: '',
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
  },
  watch: {
  },
  methods: {
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
  },
}
</script>

<style lang="scss" scoped>
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

  &.noBorder {
    border: none;
  }

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
