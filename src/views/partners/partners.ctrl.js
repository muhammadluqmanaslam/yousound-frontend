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
          title: 'How do subscription payouts work?',
          content: 'We use the <b>Reveue Pool</b> model which splits 50% of a subscriber’s payment equally to their top 10 most streamed creators per month, regardless of how many times content is played.  This allows more creators to earn a liveable income.',
        },
        {
          title: 'Why not use a traditional pay-per-play model?',
            content: 'It’s not sustainable. <br />  <br />There’s over <b>80,000 releases</b> daily and it takes <b>millions of plays to make minimum wage.</b> There’s too many streams played everyday for a pay-per-play model to create liveable incomes for the majority of creators.',
        },
        {
          title: 'What’s the differece between payout models?',
          content: '<b>Pay-per-play model:</b> <br /> <br />If a creator gets 10k users to stream their content 10x per month (100,000 plays), based on $.004 per stream, they would make <b>$400</b>. <br /><br /><b>Revenue Pool model:</b>  <br /> <br />If a creator makes the top 10 list of <b>10,000 subscribers</b>, they will make at least <b>$5,000</b>, regardless of play counts.',
        },
        {
          title: 'Are ad & subscription payouts the same?',
          content: 'No. <br /><br /> Ad Revenue is shared based on how much ad revenue your content generates, which is split 50% and calculated by our Ad Partners.Subscription revenue is shared based on how many top 10 lists your music was placed on for the month.You must be a YouSound partner to activate both revenue streams.',
        },
        {
          title: 'How do I become a YouSound Partner?',
          content: 'You must have at least: <ul><li>1,000 followers</li><li>4,000 audio or video hours played</li> <br /><br /> When you reach the required amount of followers and hours viewed you will be sent an email to invite you to become a YouSound Partner.  You can keep track of your stats on your dashboard.',
        },
      ],
    }
  },
  computed: {},
}
