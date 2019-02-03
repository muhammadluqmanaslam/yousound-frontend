<template>
  <div class="page discover-page">
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <v-radio-group v-model="type" row>
        <v-radio label="Empty Stream" value="stream" ></v-radio>
        <v-radio label="Empty Actvity" value="activity"></v-radio>
        <v-radio label="Empty Message" value="message"></v-radio>
        <v-radio label="Empty Cart" value="cart"></v-radio>
        <v-radio label="Empty Order" value="order"></v-radio>
        <v-radio label="Empty Profile" value="profile"></v-radio>
        <v-radio label="Empty Search" value="search"></v-radio>
      </v-radio-group>
    </v-flex>
    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1>
      <h2 class="page-title">{{ type }}</h2>
    </v-flex>

    <v-flex xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1 class="empty-section" text-xs-center>
      <img class="empty-icon" :src="`static/images/ic_empty_${type}.svg`"  v-if="type!='profile'"/>
      <p class="empty-title" v-if="type=='stream'">Your stream is empty</p>
      <p class="empty-title" v-if="type=='activity'">No Activity</p>
      <p class="empty-title" v-if="type=='message'">No messages</p>
      <p class="empty-title" v-if="type=='cart'">Your Cart is Empty</p>
      <p class="empty-title" v-if="type=='order'">New Orders</p>
      <p class="empty-title" v-if="type=='profile'">Your Profile is Empty</p>
      <p class="empty-title" v-if="type=='search'">No Results Found</p>
      <p class="empty-description" v-if="type=='stream'">Follow people to discover new music & products.</p>
      <p class="empty-description" v-if="type=='activity'">This is where you'll see who followed, commented, and other activity.</p>
      <p class="empty-description" v-if="type=='message'">Your conversations will appear here.</p>
      <p class="empty-description" v-if="type=='cart'">Looking for something new?</p>
      <p class="empty-description" v-if="type=='order'">You have no orders yet.</p>
      <p class="empty-description" v-if="type=='profile'">It’s a little lonely in here...</p>
      <p class="empty-description" v-if="type=='search'"> </p>
      <v-btn class="empty-discover-btn" v-if="type=='stream' || type=='cart' || type=='profile'">Discover </v-btn>
      <v-btn class="empty-discover-btn" v-if="type=='activity'">Discover artists</v-btn>
    </v-flex>
  </div>
</template>

<script type="text/javascript" src="./empty.ctrl.js"></script>
