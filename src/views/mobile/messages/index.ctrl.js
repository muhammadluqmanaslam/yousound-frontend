import PaneTabs from "../components/paneTabs.vue";

export default {
  components: {
    PaneTabs,
  },

  data() {
    return {
      tabs: [
        { id: "messages", title: "Messages"},
        { id: "sms", title: "SMS"},
        { id: "activity", title: "Activity"},
      ],
      initSelected: "messages",
      activeDiscover: "messages",
    }
  },

  computed: {
  },

  created() {},

  beforeDestroy() {},

  methods: {
    tabClicked(data) {
      console.log("clickr 2");
      this.showTrending = false;
      this.activeDiscover = data.id;
    },
  },

  mounted() {},
}