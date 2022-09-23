import Vue from 'vue'
import {ServerTable, ClientTable, Event} from 'vue-tables-2';
import axios from 'axios';
import index from './index'

import 'bootstrap/dist/css/bootstrap.css'

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
            columns: ['First_Name','Last_Name','Email','Phone','action'],
            tableData: [
                {id: "1", First_Name:"John",  Last_Name:"John",  Email:"aliraza@gamil.com", Phone:"83478324823"},
                {id: "2", First_Name:"Dean",  Last_Name:"Susan", Email:"aliraza@gamil.com", Phone:"83478324823"},
                {id: "3", First_Name:"Sarim", Last_Name:"Jane",  Email:"aliraza@gamil.com", Phone:"83478324823"},
                {id: "4", First_Name:"Fami",  Last_Name:"Chris", Email:"aliraza@gamil.com", Phone:"83478324823"},
                {id: "5", First_Name:"Kami",  Last_Name:"Dvd",   Email:"aliraza@gamil.com", Phone:"83478324823"},
                {id: "6", First_Name:"Jan",   Last_Name:"Hani",  Email:"aliraza@gamil.com", Phone:"83478324823"},
                {id: "8", First_Name:"Rahu",  Last_Name:"Mani",  Email:"aliraza@gamil.com", Phone:"83478324823"},
                {id: "8", First_Name:"Fakhr", Last_Name:"Sami",  Email:"aliraza@gamil.com", Phone:"83478324823"}
            ],
        };
    },

    // reject and approve function
    methods: {
      action: function (id) {
        return '';
      },
      Click(event) {
        '<button class="btn btn-success" @click="approve('+id+')">Approve</button> <button class="btn btn-danger" @click="reject('+id+')">Reject</button>'
      },
    },

}