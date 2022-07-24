import PaneTabs from "../components/paneTabs.vue";
import Conversations from "./conversations";
import SMS from "./SMS"

export default {
  components: {
    PaneTabs,
    Conversations,
    SMS,
  },

  data() {
    return {
      tabs: [
        { id: "messages", title: "Messages"},
        { id: "sms", title: "SMS"},
        { id: "activity", title: "Activity"},
      ],
      initSelected: "messages",
      activePane: "messages",
    }
  },

  computed: {
  },

  created() {},

  beforeDestroy() {},

  methods: {
    tabClicked(data) {
      this.showTrending = false;
      this.activePane = data.id;
    },
  },

  mounted() {},
}