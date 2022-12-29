<template>
    <div>
        <dashboard-nav name="top-creators" />
        <div class="page-content px-5">
            <div class="dflex align-center">
                <img src="../../assets/heart-icon.png" width="20" height="20">
                <h2 class="main-heading ml-2">These creators will share 50% of your subscription this month</h2>
            </div>

            <div v-if="pageReady" class="table-margin">
                <table class="text-xs-left">
                    <tr class="border-bottom">
                      <th class="w-30">Name</th>
                      <th>Total plays</th>
                      <th>Earning</th>
                      <th class="w-30"></th>
                    </tr>

                    <div class="my-2"></div>
                    
                    <tr v-for="(creator, index) in top_creators" :key="index" class="tbl-row">
                        <td>
                            <div class="dflex align-center my-2 ml-2">
                                <div class="tbl-num">{{ index + 1 }}</div>
                                <div class="tbl-img mx-3" :style="{'background-image': `url(${creator.avatar_url})`,}"></div>
                                <div class="tbl-content">
                                    <div class="tbl-title">{{ creator.display_name }}</div>
                                    <div class="tbl-subtitle">@{{ creator.user }}  •  {{ creator.user_type }}</div>
                                </div>
                            </div>
                        </td>
                        <td><div class="number-text ml-4">{{ creator.playedViewed }}</div></td>
                        <td><div class="number-text ml-3">${{ creator.subscriptionShare }}</div></td>
                        <td></td>


                        <div class="msg-absolute">
                            <img src="../../assets/message_icon.svg" width="24">
                        </div>
                        </tr>
                  </table>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript" src="./creator.ctrl.js"></script>
<style scoped src="./creator.scss" lang="scss"></style>
