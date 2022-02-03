<template>
  <div class="app-loader" :style="{'background-color': bgColor}">
    <div v-if="loaderType === 'fullBG'" class="_fullBG">
		<div class="loader-def center">
        	<span></span>
    	</div>
	</div>


	<div v-if="loaderType === 'linear'" class="_linear">
		<!-- <div class="text-xs-center"> loaderWithhold: {{ loaderWithhold }} || {{ loadStatus }} : {{ loadValue }}</div> -->
		<v-progress-linear
		:value="loadValue"
        height="2"
        class="primary--text app-loader_linear"
      ></v-progress-linear>
	</div>
  </div>
</template>

<script>
export default {
  props: {
    bgColor: {
      type: String,
      default: 'transparent',
    },
    loaderType: {
      type: String,
      default: 'linear',
    },
  },
  data() {
    return {
      loadValue: 0,
      trackLoader: null,
      loaderWithhold: false,
    }
  },
  computed: {
    loadStatus() {
      return this.$store.getters['error/isLoading']
    },
  },
  methods: {
    updateLoader(val) {
      // update load value
      this.loadValue = val
    },
  },
  watch: {
    loadStatus(val) {
      if (!val) {
        // update load value to almost hundred
        this.loadValue = 99

        // update load value too full after delay
        setTimeout(() => {
          this.loadValue = 100
        }, 500);

        // close and finish load experience
        clearInterval(this.trackLoader)
      }
    },
    loadValue(val) {
      // only run when loader is not in domant null state
      if (val !== null) {
        // by 0, means app loader has been triggered
        if (val === 0) {
          // IMPORTANT
          // fix glitch on brute back btn click
          clearInterval(this.trackLoader)

          // init loader
          this.trackLoader = setInterval(() => {
            this.loadValue += 10
          }, 500);
        }

        // when load value is full
        if (val > 100) {
          clearInterval(this.trackLoader)
          this.loadValue = null
          // this.trackLoader = null
        } else if (val === 100) {
          clearInterval(this.trackLoader)

          // reset loaderWithhold
          this.loaderWithhold = false
        } else if (val > 50 && this.loadStatus === true) {
          // stop adding to loader value
          // means at this stage, api is still loading i.e loadStatus
          clearInterval(this.trackLoader)

          // re-init loader with lower pace
          this.trackLoader = setInterval(() => {
            this.loadValue += 5
          }, 500);
        } else if (val > 60 && this.loadStatus === true) {
          // stop adding to loader value
          this.loaderWithhold = true
          clearInterval(this.trackLoader)

          // withhold loader state
          // means at this stage, api is still loading i.e loadStatus
          if (this.loaderWithhold === true) {
            // re-init loader with lower pace
            this.trackLoader = setInterval(() => {
              this.loadValue += 1
            }, 500);
          }
        }

        // emit load value to listener
        this.$emit('getLoadUpdate', val)
      }
    },
  },
  mounted() {
    this.trackLoader = setInterval(() => {
      this.loadValue += 10
    }, 100);
  },
}
</script>

<style lang="scss" scoped>
.app-loader {
	display: -webkit-flex;
	display:         flex;
	-webkit-flex-flow: row wrap;
	        flex-flow: row wrap;
	-webkit-justify-content: center;
	        justify-content: center;
	-webkit-align-items: center;
	        align-items: center;
	-webkit-align-content: center;
	        align-content: center;
	position: relative;
	width: 100%;
	height: 100%;
	clear: both;
}

._linear {
	width: 100%;
	position: fixed;
    top: 0;
    z-index: 3;

	.progress-linear {
		margin: 0;
	}
}

.center {
	display: block;
	position: absolute;
	top: 0; left: 0;
	bottom: 0; right: 0;
	margin: auto;
}
.loader-def {
	position: relative;
	display: block;
	width: calc(100% / 3);
	height: calc(100vh / 4);

	height: 32px;
	width: 32px;
	-webkit-animation: loader-def-1 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
	        animation: loader-def-1 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
}
@-webkit-keyframes loader-def-1 {
	0%   { -webkit-transform: rotate(0deg); }
	100% { -webkit-transform: rotate(360deg); }
}
@keyframes loader-def-1 {
	0%   { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}
.loader-def::before {
	content: "";
	display: block;
	position: absolute;
	top: 0; left: 0;
	bottom: 0; right: auto;
	margin: auto;
	width: 8px;
	height: 8px;
	background: #39b5ff;
	border-radius: 50%;
	-webkit-animation: loader-def-2 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
	        animation: loader-def-2 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
}
@-webkit-keyframes loader-def-2 {
	0%   { -webkit-transform: translate3d(0, 0, 0) scale(1); }
	50%  { -webkit-transform: translate3d(24px, 0, 0) scale(.5); }
	100% { -webkit-transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes loader-def-2 {
	0%   { transform: translate3d(0, 0, 0) scale(1); }
	50%  { transform: translate3d(24px, 0, 0) scale(.5); }
	100% { transform: translate3d(0, 0, 0) scale(1); }
}
.loader-def::after {
	content: "";
	display: block;
	position: absolute;
	top: 0; left: auto;
	bottom: 0; right: 0;
	margin: auto;
	width: 8px;
	height: 8px;
	background: #39b5ff;
	border-radius: 50%;
	-webkit-animation: loader-def-3 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
	        animation: loader-def-3 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
}
@-webkit-keyframes loader-def-3 {
	0%   { -webkit-transform: translate3d(0, 0, 0) scale(1); }
	50%  { -webkit-transform: translate3d(-24px, 0, 0) scale(.5); }
	100% { -webkit-transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes loader-def-3 {
	0%   { transform: translate3d(0, 0, 0) scale(1); }
	50%  { transform: translate3d(-24px, 0, 0) scale(.5); }
	100% { transform: translate3d(0, 0, 0) scale(1); }
}
.loader-def span {
	display: block;
	position: absolute;
	top: 0; left: 0;
	bottom: 0; right: 0;
	margin: auto;
	height: 32px;
	width: 32px;
}
.loader-def span::before {
	content: "";
	display: block;
	position: absolute;
	top: 0; left: 0;
	bottom: auto; right: 0;
	margin: auto;
	width: 8px;
	height: 8px;
	background: #39b5ff;
	border-radius: 50%;
	-webkit-animation: loader-def-4 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
	        animation: loader-def-4 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
}
@-webkit-keyframes loader-def-4 {
	0%   { -webkit-transform: translate3d(0, 0, 0) scale(1); }
	50%  { -webkit-transform: translate3d(0, 24px, 0) scale(.5); }
	100% { -webkit-transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes loader-def-4 {
	0%   { transform: translate3d(0, 0, 0) scale(1); }
	50%  { transform: translate3d(0, 24px, 0) scale(.5); }
	100% { transform: translate3d(0, 0, 0) scale(1); }
}
.loader-def span::after {
	content: "";
	display: block;
	position: absolute;
	top: auto; left: 0;
	bottom: 0; right: 0;
	margin: auto;
	width: 8px;
	height: 8px;
	background: #39b5ff;
	border-radius: 50%;
	-webkit-animation: loader-def-5 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
	        animation: loader-def-5 2s cubic-bezier(0.770, 0.000, 0.175, 1.000) infinite;
}
@-webkit-keyframes loader-def-5 {
	0%   { -webkit-transform: translate3d(0, 0, 0) scale(1); }
	50%  { -webkit-transform: translate3d(0, -24px, 0) scale(.5); }
	100% { -webkit-transform: translate3d(0, 0, 0) scale(1); }
}
@keyframes loader-def-5 {
	0%   { transform: translate3d(0, 0, 0) scale(1); }
	50%  { transform: translate3d(0, -24px, 0) scale(.5); }
	100% { transform: translate3d(0, 0, 0) scale(1); }
}
</style>
