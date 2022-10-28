<template>
	<div class="verified-main">
		<div class="modal-inner">
			<div class="text-center _title">Get verified</div>
			<div class="margin-vertical">
				<div class="form-group">
					<div class="_lable">Social channel</div>
					<v-menu class="social-type-menu" content-class="social-menu__content">
						<v-select :placeholder="socialChannel ? socialChannel.title : 'Choose'" class="social-types-selector py-0"
							:class="{ '_filled': socialChannel }" single-line hide-details slot="activator"></v-select>

						<div v-for="(channel, i) in socialChannels" :key="i" @click="selectedChannel(channel)"
							class="channel-info" :class="[`${channel.id}-menu`]">
							<div class="_title">{{ channel.title }}</div>
							<div class="_tags">
								{{ channel.tags }}
							</div>
						</div>
					</v-menu>
					<div class="_lable">Social Username</div>
					<input v-model="socialUsername" placeholder="Username" class="_socialHandle width100" type="text"/>
				</div>

			</div>
			<div class="footnote">
				If we need to contact you we will send a direct message from <strong>@yousoundapp</strong>
			</div>
			<v-btn
				round
				dark
				@click.native="reRequestForVerification()"
				class="mt-3 px-3"
				>Re apply</v-btn
			>

			<!-- close sign -->
			<div class="close-button" @click="hideModal()">
				<img src="../../assets/cross.svg" width="11">
			</div>
		</div>

	</div>
</template>

<script>
import UserService from '@/services/user'
import AuthService from '@/services/auth'

export default {
	data() {
		return {
			socialChannel: "",
			socialUsername: "",
		};
	},
	computed: {
		socialChannels() {
			return [
				{
					title: "Facebook",
					id: "facebook",
				},
				{
					title: "Instagram",
					id: "instagram",
				},
				{
					title: "Twitter",
					id: "twitter",
				},
				{
					title: "Tik Tok",
					id: "tiktok",
				},
			];
		},
	},
	watch: {
		socialUsername(val) {
			if (val.length < 2) {
				this.socialUsername = "@";
			}
		},
	},
	methods: {
		selectedChannel(channel) {
			this.socialChannel = channel;
		},
		hideModal() {
			console.log("check work")
      this.$emit("showGetVerifiedModal", false);
    },

		currentUser() {
			return this.$store.state.auth.user
		},

		reRequestForVerification() {
			this.$store.dispatch('error/showLoadingActivity', true)
			let params = { social_provider: this.socialChannel, social_user_name: this.socialUsername }

			UserService.creatorReRequest(this.currentUser().id, params)
			.then((response) => {
				this.$store.dispatch('error/showLoadingActivity', false)
				this.$store.dispatch('error/showSuccessToast', ['Re Request send Successfully'])
				AuthService.setUser(response.body)
				this.$emit("showGetVerifiedModal", false);
			})
			.catch((e) => {
				this.$store.dispatch('error/showLoadingActivity', false)
				this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
			})
		},
	}

}
</script>


<style lang="scss">
.verified-main {
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

	.modal-inner {
		border-radius: 10px;
		padding: 40px 25px;
		width: 100%;
		max-width: 375px;
		background: white;
		margin-left: 280px;
		position: relative;
		color: #000000;

		._title {
			font-size: 28px;
			font-weight: 500;
			line-height: 36px;
		}

		._lable {
			font-size: 12px;
			font-family: 'Inter', sans-serif;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.6);
			line-height: 30px;
		}

		.margin-vertical {
			margin: 30px 0;
			position: relative;
		}

		.close-button{
			filter: invert(1);
			position: absolute;
			top: 15px;
			right: 15px;
			cursor: pointer;
		}
	}

	.menu {
		width: 100%;
		display: block !important;
		margin-bottom: 14px;
	}

	._socialHandle {
		color: #000000;
		font-weight: 500;
		padding: 10px;
	}

	[disabled] {
		background: none !important;
	}

	.footnote {
		font-size: 14px;
	}

	input {
		min-height: 44px;
		font-weight: 500;
	}

	.social-menu {
		width: 100%;
	}

	.input-group__selections input {
		&::placeholder {
			color: #000000 !important;
			font-weight: 500 !important;
			opacity: 1 !important;
			font-size: 14px !important;
		}

		&[placeholder="Choose"] {
			&::placeholder {
				color: rgba(0, 0, 0, 0.7) !important;
			}
		}

	}

	.input-group__input {

		background: url("../../assets/chevron.svg") no-repeat scroll 95% 16px;
		background-size: 15px 15px;

		i {
			font-size: 0;
		}
	}

	&.input-group--focused {
		.input-group__input {
			// border: 1px solid #000000;
			border-radius: 4px;


		}
	}

}

.form-group{
	font-family: "Inter",sans-serif !important;
}

.social-type-menu {
	width: 100%;
}

.social-menu__content {
	top: 414px !important;
	box-shadow: none !important;
	border-radius: 12px !important;
	border: 2px solid #000000 !important;

	.channel-info {
		color: #000000;
		width: 100%;
		background-color: #ffffff;
		padding: 10px 10px;

		// &:not(:last-child) {
		//     border-bottom: 2px solid #000000;
		// }

		&:hover {
			background-color: #000000;
			color: #ffffff;
		}
	}


}
</style>
