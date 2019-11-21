<template>
  <v-footer class="my-footer">
    <a href="#">Support</a>
    <a href="#">Blog</a>
    <router-link to='/terms'>Terms of Service</router-link>
    <a href="#">Contact</a>
    <div class="copyright">© {{ new Date().getFullYear() }} YouSound, Inc.</div>
  </v-footer>
</template>
