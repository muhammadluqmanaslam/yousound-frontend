<template>
  <v-footer class="my-footer">
    <a href="#">Faq</a>
    <a href="#">Community</a>
    <a href="#">Help</a>
    <router-link to='/terms'>Terms of Service</router-link>
    <a href="#">Contact</a>
    <div class="copyright">© {{ new Date().getFullYear() }} YouSound, Inc.</div>
  </v-footer>
</template>

<script type="text/javascript">
  export default {}
</script>
