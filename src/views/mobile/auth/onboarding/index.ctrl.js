import Stager from "../stager"
import ChooseAccount from "./chooseAccount"
import AccountType from "./accountType"
import ProfileImage from "./profileImage"
import AccountInfo from "./accountInfo"
import AgeLocation from "./ageLocation"
import GetVerified from "./getVerified"
import CheckEmail from "./checkEmail"
import { mapGetters, mapState } from "vuex"

export default {
  components: {
    Stager,
    ChooseAccount,
    AccountType,
    ProfileImage,
    AccountInfo,
    AgeLocation,
    GetVerified,
    CheckEmail,
  },
  data() {
    return {
      userEmail: "",
    }
  },
  computed: {
    ...mapState({
      accountCategory: state => state.app.onboarding.accountCategory,
      current: state => state.app.onboarding.current,
    }),
    ...mapGetters({
      stages:"app/onboardingStages",
      currentStage:"app/onboardingCurrentStage",
      isAuthenticated: "auth/isAuthenticated",
    }),
    onMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  methods: {},
  created() {
    if (this.isAuthenticated || !this.onMobile) {
      this.$router.push({name: "Dashboard"})
    }
  }
}