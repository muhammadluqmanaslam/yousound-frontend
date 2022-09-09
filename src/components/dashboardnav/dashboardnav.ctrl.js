import contentTopHeader from "@/components/contentTopHeader";
import AuthService from "@/services/auth";
import { MyEvents } from "@/helper";
import UserTag from "@/components/user_tag";

export default {
  props: {
    name: String,
    replaceMenuWith: {
      type: Array,
      default: () => [],
    },
    tabActivePill: Boolean,
  },
  components: {
    contentTopHeader,
    UserTag,
  },
  data() {
    return {
      activeTab: "",
      daysFilter: 7,
      tabs: [
        {
          id: "dashboard",
          title: "Dashboard",
          pathName: "Dashboard",
          // icon: require("../../../static/images/edit-curves.svg"),
        },
        {
          id: "sales",
          title: "Sales",
          pathName: "Sell",
          // icon: require("../../../static/images/delivery.svg"),
        },
        {
          id: "manage",
          title: "Manage",
          pathName: "ManageIndex",
          // icon: require("../../../static/images/file-copies.svg"),
        },
        {
          id: "payments",
          title: "Payments",
          pathName: "PaymentIndex",
          // icon: require("../../../static/images/credit-card.svg"),
        },
        {
          id: "settings",
          title: "Settings",
          pathName: "UserSettings",
          // icon: require("../../../static/images/settings-gear.svg"),
        },
      ],
      dropdownMenu: [
        {
          id: "profile",
          title: "Profile",
          pathName: "UserProfile",
          icon: require("../../../static/images/file-copies.svg"),
        },
        {
          id: "manage",
          title: "Manage",
          pathName: "ManageIndex",
          icon: require("../../../static/images/file-copies.svg"),
        },
        {
          id: "payments",
          title: "Payments",
          pathName: "PaymentIndex",
          icon: require("../../../static/images/credit-card.svg"),
        },
        {
          id: "settings",
          title: "Settings",
          pathName: "UserSettings",
          icon: require("../../../static/images/settings-gear.svg"),
        },
        {
          id: "signOut",
          title: "Sign Out",
          icon: require("../../../static/images/log-out.svg"),
        },
      ],
    };
  },

  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },

  methods: {
    isActiveTab(tab) {
      return this.name === tab;
    },
    isActiveInnerTab(tab) {
      return this.activeInnerTab === tab;
    },
    signOut() {
      AuthService.signout();
      this.$router.push({ path: "/login" });
      this.$root.$emit(MyEvents.AUTH_SIGNOUT);
    },
    setTab(pathName) {
      this.$router.push({ name: pathName });
    },
    setMenuAction(menu) {
      switch (menu.id) {
        case "profile":
          this.$router.push(`/${this.currentUser.slug}`);
          break;
        case "signOut":
          this.signOut();
          break;
        default:
          this.$router.push({ name: menu.pathName });
          break;
      }
    },
  },

  created() {
    this.activeTab = this.name;

    if (this.replaceMenuWith.length) {
      this.tabs = this.replaceMenuWith;
    }
  },
};
