<template>
    <div class="analytics_modal">
        <div class="modal_body">
            <div class="modal_insight">
                <div>
                    <h2 class="modal_main_title mb-1">Ublock analytics insights</h2>
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
                        <li class="_point">Content Performance</li>
                        <li class="_point">Content Performance</li>
                        <li class="_point">Content Performance</li>
                        <li class="_point">Content Performance</li>
                        <li class="_point">Content Performance</li>
                        <li class="_point">Content Performance</li>
                        <li class="_point">Content Performance</li>
                        <li class="_point">Content Performance</li>
                        <li class="_point">Content Performance</li>
                        <li class="_point">Content Performance</li>
                    </ul>
                </div>

                <div class="modal_pricing">
                    <p class="_price"><span class="currency">$</span>100<span class="_time"> /month</span></p>
                </div>

                <div class="button-wrapper">
                    <v-btn block round dark class="py-4">Upgrade</v-btn>
                </div>

            </div>
        </div>

    </div>
</template>


<script>
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

@media screen and (max-width: 1250px) {

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