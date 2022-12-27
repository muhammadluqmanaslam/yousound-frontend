import accordion from '@/components/accordion'
import { mapGetters } from 'vuex'

export default {
  components: {
    accordion,
  },
  data() {
    return {
      accordions: [
        {
          title: 'How do I become a YouSound Partner?',
          content: 'You must have at least 2,000 followers.  When you reach the required amount of followers we will review your account and all of it\'s activity.If your account is approved we will send you an email to enroll.YouSound Partners program is set to begin by the end of Q4 2022.',
        },
      ],
    }
  },
  computed: {},
}
