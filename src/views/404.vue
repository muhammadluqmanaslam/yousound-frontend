<template>
  <div class="404 not-found text-center">
    <h2 class="_title">404</h2>
    <h3 class="_subtitle">No page found</h3>

    <img
      :src="require('@/assets/turntable.gif')"
      width="40%"
      alt="turntable vinyle gif"
    />

    <div class="back-action">
      <img
        :src="require('@/assets/arrow_back_alt.svg')"
        width="28"
        alt="arrow back"
        class="mr-2"
      />

      <router-link to="/dashboard" class="black--text">Back To Yousound</router-link>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.not-found {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100%;
  background-color: #fff9dc;
  padding: 30px;

  ._title {
    font-size: 34px;
    font-weight: 700;
  }
  ._subtitle {
    font-size: 27px;
    font-weight: 500;
  }

  .back-action {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: fit-content;
    width: -moz-fit-content;
    margin: 0 auto;
    font-size: 24px;

    &::after {
        content: "";
        width: 100%;
        height: 2px;
        background-color: #000000;
        position: absolute;
        bottom: -3px;
    }
  }
}
</style>
