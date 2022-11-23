<template>
	<div class="analytics_modal">
		<div class="modal_body">
			<div class="modal_insight">
				<div>
					<h2 class="modal_main_title mb-1">Unlock analytics insights</h2>
					<p class="modal_text">Get in-depth metrics for all of your content & maximize your growth.</p>
				</div>

				<div class="modal_graphic mt-3">
					<img src="../../assets/vector..gif" width="100%">
				</div>

			</div>
			<div class="modal_content">
				<h2 class="modal_content_title">
					Track 60+ metrics, including:
				</h2>

				<div class="modal_points-div">
					<ul class="_points">
						<li class="_point" v-for="item in this.proBenefits">
							{{ item }}
						</li>
						<li class="_point">Content Performance</li>
					</ul>
				</div>

				<div class="modal_pricing">
					<p class="_price"><span class="currency">$</span>100<span class="_time"> /month</span></p>
				</div>

				<div v-if="currentUser.request_status !== 'denied'">
					<v-btn
						class="py-4 button-wrapper"
						@click.native="planUpgrade()"
						round
						dark
						style="width: 100%"
					>
						Upgrade
					</v-btn>
				</div>

			</div>
		</div>
		<div v-if="showGetVerifiedModal">
			<div class="verified-main">
				<div class="modal-inner">
					<div class="text-center _title">Get verified</div>
					<div class="margin-vertical">
						<div class="form-group">
							<div class="_lable">Social channel</div>
							<v-menu class="social-type-menu" content-class="s-menu__content">
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
						@click.native="verifiedSocialAttributes()"
						class="mt-3 px-3"
						>Get Verified</v-btn
					>

					<!-- close sign -->
					<div class="close-button" @click="hideModal()">
						<img src="../../assets/cross.svg" width="11">
					</div>
				</div>

			</div>
		</div>
		<v-dialog v-model="initPayment" content-class="plans-dialog">
			<payment-card :item="selectedPlan" :totalPayable="totalPayable" :closePayment="closePaymentModal" />
		</v-dialog>

		<v-dialog v-model="plansUpgradeModal" v-if="currentUser !== null">
			<v-card>
				<v-card-title class="headline">Plan Changes</v-card-title>
				<v-card-text v-if="plansName[currentUser.plan] == 'Listener' || currentUser.plan == null">
					<p>Your current plan is <b> {{ currentUser.plan == null ? "Free Plan" : plansName[currentUser.plan] }} </b> and you are trying to upgrade it to <b> Advanced Plan. </b> </p>
					<p>You will remain in your current plan until admin approve your account. Once you verified, you will be charged
						according to subscription of current plan and new chosen plan.
						Are you sure you want to continue?
					</p>
				</v-card-text>
				<v-card-text v-else>
					<p>Your current plan is <b> {{ plansName[currentUser.plan] }} </b> and you are trying to upgrade it to <b> Advanced Plan. </b> </p>
					<p>This will have an immediate effect and you will be charged according to subscription of current
						plan and new chosen plan.
						Are you sure you want to continue?
					</p>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn class="blue--text darken-1" flat="flat" @click.native="verifyUserType()">Ok
					</v-btn>
					<v-btn class="blue--text darken-1" flat="flat" @click.native="hidePlanChangeModal()">Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

	</div>
</template>


<script>
import dashboardNav from '@/components/dashboardnav'
import AuthPlan from "@/views/mobile/auth/onboarding/authPlan";
import { mapState } from "vuex";
import PaymentCard from "@/components/paymentCard";
import { Stripe } from "@/helper";
import SubscriptionService from '@/services/subscription'
import UserService from '@/services/user'
import AuthService from '@/services/auth'

export default {
	components: {
		dashboardNav, PaymentCard, AuthPlan
	},

	data() {
		return {
			socialChannel: "",
			socialUsername: "",
			initPayment: false,
			selectedPlan: {},
			plansUpgradeModal: false,
			plansName: {'basic': 'Listener', plus: 'Creator', pro: 'Advance'},
			proBenefits: ['Content Performance', 'Listeners/Buyers by country', 'External Traffic Location',
				'Average listening/watch time', 'Page Views', 'Watching/listening now', 'Product Conversion %',
				'When songs are listened to most', 'When sales happen most'
			],
			showGetVerifiedModal: false,
		}
	},

	computed: {
		...mapState({
			plansData: (state) => state.app.plansData,
			current: (state) => state.app.onboarding.current,
		}),
		plans() {
			const plans = this.plansData.map((plan) => {
				if (plan.id == "basic") {
					plan.title = "Everyone";
				}
				return plan;
			});

			return plans;
		},

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

		currentUser() {
			return this.$store.state.auth.user;
		},

		totalPayable() {
			const fee = parseFloat(this.selectedPlan.price);
			const subFee = Stripe.calculateSubFee(this.selectedPlan.price);

			let total = parseFloat(subFee) + parseFloat(fee);
			total = parseFloat(total.toFixed(2));

			return total
		},
	},

	methods: {
		openPaymentModal() {
			this.initPayment = true;
		},

		closePaymentModal() {
			this.initPayment = false;
			this.selectedPlan = {};
		},

		hideModal() {
			this.showGetVerifiedModal = false;
		},

		remainingDays() {
			const reRequest = new Date(this.currentUser.re_requested_at)
			const todayDate = new Date()
			const diffTime = Math.abs(todayDate - reRequest);
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			return diffDays;
		},

		subscriptionChange() {
			let params = { selectedPlan: 'pro', social_provider: this.socialChannel.id, social_user_name: this.socialUsername  }
			SubscriptionService.subscriptionChange(params)
				.then((response) => {
					this.hidePlanChangeModal()
					this.$store.dispatch('error/showSuccessToast', [response.body.success_response])
					setTimeout(function() {
						window.location.href = '/dashboard'
					}, 2000);
				})
				.catch((e) => {
					this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
				})
		},

		verifyUserType() {
			if (this.currentUser && this.currentUser.stripe_customer_id == null) {
				this.openPaymentModal()
			}
			else {
				this.subscriptionChange()
			}
		},

		verifiedSocialAttributes () {
			let params = { social_provider: this.socialChannel.id, social_user_name: this.socialUsername }
				this.$store.dispatch('error/showLoadingActivity', true)
				UserService.updateUserInfo(this.currentUser.id, params)
					.then((response) => {
						this.$store.dispatch('error/showLoadingActivity', false)
						this.$store.dispatch('error/showSuccessToast', ['Social Username and channel saved successfully'])
						AuthService.setUser(response.body)
						this.plansUpgradeModal = true
						this.showGetVerifiedModal = false;
					})
					.catch((e) => {
						this.$store.dispatch('error/showLoadingActivity', false)
						this.$store.dispatch('error/showErrorToast', e.body.errors || [e.body])
					})
		},

		planUpgrade() {
			if ((this.currentUser.plan == "basic" || this.currentUser.plan == null) && (this.selectedPlan.id !== 'basic' )) {
				this.showGetVerifiedModal = true
			} else {
				this.plansUpgradeModal = true
			}
		},

		selectedChannel(channel) {
			this.socialChannel = channel;
		},

		hidePlanChangeModal() {
			this.plansUpgradeModal = false
		},
	},

	mounted() {
		this.selectedPlan = this.plans[2];
	},
}
</script>

<style lang="scss">
.analytics_modal {
	position: absolute;
	top: 0;
	z-index: 9;
	width: 100%;
	height: 100%;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, #F5F3F5 59.9%);

	.modal_body {
		width: 85%;
		max-width: 900px;
		background: white;
		border-radius: 30px;
		border: 1px solid #e1e1e1;
		margin: 150px auto 0;
		display: flex;
		overflow: hidden;


		.modal_insight {
			width: 61%;
			padding: 45px 25px 30px;
			background: #f1eff3;

			.modal_main_title {
				font-size: 28px;
				font-weight: bold;
			}

			.modal_text {
				font-size: 14px;
				line-height: 20px;
			}

		}

		.modal_content {
			width: 39%;
			padding: 45px 35px;

			.modal_content_title {
				font-size: 18px;
				font-weight: bold;
			}

			.modal_points-div {
				margin: 20px 0;

				._points {
					margin-left: 18px;
					font-size: 15px;
					line-height: 32px;
				}
			}
		}


		.modal_pricing {
			._price {
				font-size: 32px;
				font-weight: bold;
				margin-bottom: 0px;

				.currency {
					font-size: 16px;
					font-weight: 400;
				}

				._time {
					font-family: 'Inter', sans-serif;
					font-size: 12px;
					font-weight: 400;
					color: rgba(0, 0, 0, 0.7);
				}
			}
		}
	}
}
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

.s-menu__content {
	position: fixed;
	top: 320px !important;
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

@media screen and (max-width: 1500px) {

	.analytics_modal {


		.modal_body {
			width: 90%;
			margin: 50px auto 0;

			.modal_insight {
				padding: 25px 15px 20px;
			}

			.modal_content {
				padding: 25px 15px;
			}
		}
	}
}
</style>
