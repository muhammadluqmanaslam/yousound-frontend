<template>
  <v-footer class="my-footer">
    <a href="#">FAQ</a>
    <a href="#">Blog</a>
    <a href="#">Help</a>
    <router-link to='/terms'>Terms of Service</router-link>
    <a href="#">Contact</a>
    <div class="copyright">© {{ new Date().getFullYear() }} YouSound, Inc.</div>
  </v-footer>
</template>

<script type="text/javascript">
  export default {}
</script>
