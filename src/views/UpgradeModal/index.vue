<template>
	<div class="remain-main">
		<div class="modal-inner">
			<div class="text-center _title">Get verified</div>

			<hr class="margin-vertical">
			<div class="img-flex mt-4" >
				<img src="../../assets/watch.png" width="32">
			</div>
			<div class="margin-vertical text-center">
				<p class="mb-1">Your account was reviewed & denied.</p>
				<p >You can re-apply in:</p>
			</div>
			<div class="modal-days">
				 {{daysRemaining}} Days
			</div>
			<!-- close sign -->
			<div class="close-button" @click="hideModal()">
				<img src="../../assets/cross.svg" width="11">
			</div>
		</div>
	</div>


</template>


<script>
export default{
	props: {
		daysRemaining: Number,
	},
	methods: {
		hideModal() {
      this.$emit("remainingDaysModal", false);
    },
	}
}

</script>

<style lang="scss">
.remain-main {
	position: fixed;
	z-index: 10;
	background: rgba(0, 0, 0, 0.7);
	width: 100%;
	height: 100vh;
	top: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;

	.modal-inner {
		border-radius: 10px;
		padding: 40px 25px;
		width: 100%;
		max-width: 375px;
		background: #303030;
		margin-left: 280px;
		position: relative;

		._title {
			font-size: 24px;
			font-weight: 700;
			line-height: 36px;
		}

		.margin-vertical{
			margin: 25px 0;
		}

		hr{
			border-color: rgba(255,255,255,0.1);
		}

		.img-flex{
			display: flex;
			justify-content: center;
		}

		p{
			margin: 0;
			font-weight: 500;
			font-family: 'Inter', sans-serif;

		}
		.modal-days{
			font-family: 'Inter',sans-serif;
			font-size: 24px;
			font-weight: 700;
			text-align: center;
		}

		.close-button{
			position: absolute;
			top: 15px;
			right: 15px;
			cursor: pointer;
		}
		
	}
}
</style>
