import Chat from '@/components/chat'
import CommentService from '@/services/comment'

export default {
  props: {
    comments: Array,
    commentTableType: String,
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
      console.log("====commentTableType=====", this.commentTableType);
      if(this.commentTableType === undefined || this.commentTableType === "") this.commentTableType = "Stream";

      const params = {
        comment: {
          commentable_type: this.commentTableType,
          commentable_id: this.item.id,
          body: this.commentText,
          status: 'published',
        },
      }

      CommentService.sendComment(params)
        .then((res) => {
          this.commentText = ''
          this.reRenderComments()
        })
        .catch((e) => {
          console.log("e.body===", e.body)
          this.$store.dispatch(
                'error/showErrorToast',
                e.body.errors || [e.body]
            )
        })
    },

    reRenderComments() {
      this.$emit('reRenderComments');
    },
  },
}
