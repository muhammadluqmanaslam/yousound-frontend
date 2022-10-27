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

				<div class="button-wrapper">
					<v-btn block round dark class="py-4" @click.native="planUpgrade()">Upgrade</v-btn>
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

export default {
	components: {
		dashboardNav, PaymentCard, AuthPlan
	},

	data() {
		return {
			initPayment: false,
			selectedPlan: {},
			plansUpgradeModal: false,
			plansName: {'basic': 'Listener', plus: 'Creator', pro: 'Advance'},
			proBenefits: ['Content Performance', 'Listeners/Buyers by country', 'External Traffic Location',
				'Average listening/watch time', 'Page Views', 'Watching/listening now', 'Product Conversion %',
				'When songs are listened to most', 'When sales happen most'
			],
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

		subscriptionChange() {
			let params = { selectedPlan: 'pro' }
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

		planUpgrade() {
			this.plansUpgradeModal = true
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
	z-index: 11;
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
