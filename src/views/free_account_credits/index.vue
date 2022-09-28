<template>
  <div class="discover-nav verify-align">
    <content-top-header>
      <template slot="topHeader">
        <ul class="pr-3">
          <li v-for="tab in tabs" :key="tab.id" :href="`#${tab.id}`" class="nav-li"
            :class="[{active: isActiveTab(tab.id) }, `nav-${tab.id}`]">
            <label class="nav-label" @click="onTab(tab.id)">
              <img :src="tab.icon" width="18" class="li-icon">
              {{ tab.title }}
            </label>
          </li>
        </ul>
      </template>
    </content-top-header>

    <v-spacer></v-spacer>
    <v-client-table :data="this.tableData" :columns="columns" :key="this.tableData.id">

      <template slot="choose_month" slot-scope="props">
        <v-select attach
        class="month-dd"
        :items="choose_month"
        @change="selectMonth($event, props.row.id)"
        ></v-select>
      </template>

      <template slot="action" slot-scope="props">
        <v-btn flat class="my-0 btn-verify-1" @click.native="verify(props.row.id)">
          Verify
        </v-btn>
      </template>
    </v-client-table>
  </div>

</template >


<style>
  .verify-align{
    text-align: center;
  }

  .VueTables__search-field{
    text-align: left !important;
  }
  .btn-verify-1{
    background-color: #16b516 !important;
    color: white !important;
    font-size: 15px;
    font-weight: 600;
    border-radius: 5px;
    padding: 5px 10px;
    margin: 0 5px;
  }
  .btn-verify-1:hover{
    background-color: #075207 !important;
    color: white !important;
  }
  .month-dd{
    margin-top: -15px !important;
  }

  .menu__content{
    margin-top: 32px !important;
  }

  .input-group--select .input-group__input {
    min-height: 31px;
    border: 1px solid #000000 !important;
    border-radius: 3.75px;
  }
  .input-group__details {
    min-height: 0px !important;
  }
  .select-month{
    padding-top: 0 !important;
    margin-bottom: 11px !important;
    width: 100% !important;
    background-color: rgba(240, 248, 255, 0);
  }

  </style>

<script>
import contentTopHeader from '@/components/contentTopHeader'
import SearchInput from '@/components/searchInput'
import AdminService from '@/services/admin.js'
import { ClientTable } from 'vue-tables-2';
import Vue from 'vue'
import SubscriptionService from '../../services/subscription';

new Vue({
  el: '#index',
  template: '<index/>',
})

Vue.use(ClientTable, {
  perPage: 10
}, false);
new Vue({
  el: '#index',
  template: '<index/>',
})

Vue.use(ClientTable, {
  perPage: 10
}, false);
export default {
  props: {
    pageName: String,
  },
  components: {
    contentTopHeader,
    SearchInput,
  },
  data() {
    return {
      activeTab: '',
      tabs: [
        { id: 'listener', title: 'Listener' },
        { id: 'creator', title: 'Creator' },
      ],
      listeners: [],
      creators: [],
      tableData: [],
      columns: ['first_name', 'last_name', 'email', 'username', 'choose_month', 'action'],
      choose_month: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "Forever"],
      selectedMonth: [],
    }
  },

  methods: {
    isActiveTab(tab) {
      return this.activeTab === tab
    },
    onTab(tab) {
      this.activeTab = tab
      switch (tab) {
        case 'listener':
          this.tableData = this.listeners
          break;
        case 'creator':
          this.tableData = this.creators
          break;
        default:
          break;
      }
    },

    selectMonth(month, id) {
      if(this.selectedMonth.length == 0) {
        this.selectedMonth.push({"id": id, "month": month})
      } else {
        for(let i=0;i<this.selectedMonth.length;i++) {
          if (this.selectedMonth[i].id == id) {
            this.selectedMonth[i] = {"id": id, "month": month}
          } else {
            this.selectedMonth.push({ "id": id, "month": month})
          }
        }
      }
    },

    async verify(id) {
      const row = this.selectedMonth.filter(m => m.id == id)[0]
      if (row != null) {
        let month = row.month
        let params = { id: id, free_credit_month: month }
        await SubscriptionService.freeAccountCredit(params).then((response) => {
          this.$store.dispatch('error/showSuccessToast', [response.body.success_response])
        }).catch((e) => {
          this.$store.dispatch(
            'error/showErrorToast', [e.body.exception]
          )
        })
      } else {
        this.$store.dispatch(
          'error/showErrorToast', ["Please select a month"]
        )
      }
    },
    async freeAccountCreditUsers() {
      await AdminService.getFreeAccountCreditUsers(this.currentUser.id)
      .then(response => {
        let users = response.body.users
        this.listeners = users.filter(user => user.user_type == 'listener')
        this.tableData = this.listeners
        this.creators = users.filter(user => user.user_type != 'listener')
      })
      .catch(e => {
        console.log(e)
        this.$store.dispatch(
          'error/showErrorToast', [e.body.errors]
        )
      })
    },
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user
    },
  },

  created() {
    // set active tab
    if (this.pageName) {
      this.activeTab = this.pageName
    }
  },

  mounted() {
    this.freeAccountCreditUsers();
  }
}
</script>

