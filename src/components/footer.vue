<template>
  <v-footer class="my-footer">
    <a href="//support.yousound.com" target="_blank">Support</a>
    <!-- <a href="//yousound.ghost.io" target="_blank">Blog</a> -->
    <router-link to="/terms">Terms</router-link>
    <router-link to="#">Privacy</router-link>
    <router-link to="#">Download App</router-link>
    <!-- <router-link to="#">Contact</router-link> -->
    <div class="copyright">© {{ new Date().getFullYear() }} YouSound, Inc.</div>
  </v-footer>
</template>
