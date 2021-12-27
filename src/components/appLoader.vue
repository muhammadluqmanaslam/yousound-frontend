<template>
  <div class="app-loader">
    <div class="loader-def center">
        <span></span>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.app-loader {
	background-color: #f0f0f0;
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
