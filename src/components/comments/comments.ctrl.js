import Chat from '@/views/video/components/chat'
import CommentService from '@/services/comment'

export default {
  props: {
    comments: Array,
    item: Object,
    roundAvatar: Boolean,
    roundInput: Boolean,
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
