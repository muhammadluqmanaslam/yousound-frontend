import Vue from 'vue'
import AdminService from '@/services/admin'
import { ClientTable } from 'vue-tables-2';
import SubscriptionService from '@/services/subscription'

new Vue({
  el: '#index',
  template: '<index/>',
})

Vue.use(ClientTable, {
  perPage: 10
}, false);
export default {
  data() {
    return {
      columns: ['first_name', 'last_name', 'email', 'username', 'action'],
      tableData: [],
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
  },
  // reject and approve function
  methods: {
    async approve(id, action) {
      let params = { user_id: id, verify_creator: action }
      await SubscriptionService.creatorVerified(params).then((response) => {
        this.tableData = this.tableData.filter(data => data.id != id)
        this.$store.dispatch('error/showSuccessToast', [`User account has been successfully ${action == "approve" ? "approved" : "rejected"}.`])
      }).catch((e) => {
        this.$store.dispatch(
          'error/showErrorToast', [e.body.error] || [e.body.errors]
        )
      })
    },

    async fetchUnverifiedCreators() {
      await AdminService.getUnverifiedCreators(this.currentUser.id)
      .then((response) => {
        if (response.body.users.length > 0) {
          this.tableData = response.body.users.map(({first_name, last_name, email, username, id}) => ({first_name, last_name, email, username, id}) )
        }
      })
      .catch((e) => {
        this.$store.dispatch(
          'error/showErrorToast', ["There was an error on fetching user info "]
        )
      })
    },
  },
  async mounted() {
    await this.fetchUnverifiedCreators();
  },
}
