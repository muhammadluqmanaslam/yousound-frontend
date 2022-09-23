import Vue from 'vue'
import AdminService from '@/services/admin'
import { ClientTable } from 'vue-tables-2';
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
      Header: ['First Name', 'Last Name', 'Email', 'Username', 'action'],
      Item: [],
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
    action: function (id) {
      return '';
    },
    Click(event) {
      '<button class="btn btn-success" @click="approve(' + id + ')">Approve</button> <button class="btn btn-danger" @click="reject(' + id + ')">Reject</button>'
    },
    async fetchUnverifiedCreators() {
      await AdminService.getUnverifiedCreators(this.currentUser.id)
      .then((response) => {
        if (response.body.users.length > 0) {
          this.tableData = response.body.users
        }
        else {
          this.$store.dispatch(
            'error/showErrorToast', ["No creator available for verification"]
          )
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
