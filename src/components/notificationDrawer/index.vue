<template>
    <div class="notification-wrapper" :style="{left: leftPos+'px'}">
        <div class="notify-head" v-if="!inviteShow">Notifications</div>
        <div v-else class="dflex align-center justify-space-between">
            <div class="notify-head">Invite</div>
            <div @click="toggleNotify()" class="cursor-pointer">
                <img src="../../assets/closeIcon.svg" width="16">
            </div>
        </div>
        <div v-if="!inviteShow" class="notify-body">
            <div class="notify-invite">
                <h2 class="invite-head">Invite 10 creators, get 3 months free!</h2>
                <v-btn class="purple-btn" @click="toggleNotify()">
                    Invite
                </v-btn>
            </div>

            <div class="notify-main">
                <div class="notify-main-card">
                    <div class="notify-content">
                        <div class="user-image" :style="{ backgroundImage: 'url(' + demoPerson + ')' }">
                            
                        </div>
                        <div class="user-data mt-1">
                            <div class="data-content">
                                <span class="name">Theo James</span> reposted your album <span class="text-light">sa assad</span>
                            </div>
                            <div class="date mt-1">
                                4m ago
                            </div>
                        </div>


                    </div>

                    <div class="notify-image">
                        <img src="../../assets/demo-n-image.png" height="48">
                    </div>
                </div>
                <div class="notify-main-card">
                    <div class="notify-content">
                        <div class="user-image" :style="{ backgroundImage: 'url(' + demoPerson + ')' }">
                        </div>
                        <div class="user-data mt-1">
                            <div class="data-content">
                                <span class="name">Theo James</span> reposted your album <span class="text-light">sa assad</span>
                            </div>
                            <div class="date mt-1">
                                4m ago
                            </div>
                        </div>


                    </div>

                    <div class="notify-image">
                        <img src="../../assets/demo-n-image.png" height="48">
                    </div>
                </div>
                <div class="notify-main-card">
                    <div class="notify-content">
                        <div class="user-image" :style="{ backgroundImage: 'url(' + demoPerson + ')' }">
                            
                        </div>
                        <div class="user-data mt-1">
                            <div class="data-content">
                                <span class="name">Theo James</span> reposted your album <span class="text-light">sa assad</span>
                            </div>
                            <div class="date mt-1">
                                4m ago
                            </div>
                        </div>


                    </div>

                    <div class="notify-image">
                        <img src="../../assets/demo-n-image.png" height="48">
                    </div>
                </div>
                <div class="notify-main-card">
                    <div class="notify-content">
                        <div class="user-image" :style="{ backgroundImage: 'url(' + demoPerson + ')' }">
                            
                        </div>
                        <div class="user-data mt-1">
                            <div class="data-content">
                                <span class="name">Theo James</span> reposted your album <span class="text-light">sa assad</span>
                            </div>
                            <div class="date mt-1">
                                4m ago
                            </div>
                        </div>


                    </div>

                    <div class="notify-image">
                        <img src="../../assets/demo-n-image.png" height="48">
                    </div>
                </div>
                <div class="notify-main-card">
                    <div class="notify-content">
                        <div class="user-image" :style="{ backgroundImage: 'url(' + demoPerson + ')' }">
                            
                        </div>
                        <div class="user-data mt-1">
                            <div class="data-content">
                                <span class="name">Theo James</span> reposted your album <span class="text-light">sa assad</span>
                            </div>
                            <div class="date mt-1">
                                4m ago
                            </div>
                        </div>


                    </div>

                    <div class="notify-image">
                        <img src="../../assets/demo-n-image.png" height="48">
                    </div>
                </div>
                <div class="notify-main-card">
                    <div class="notify-content">
                        <div class="user-image" :style="{ backgroundImage: 'url(' + demoPerson + ')' }">
                            
                        </div>
                        <div class="user-data mt-1">
                            <div class="data-content">
                                <span class="name">Theo James</span> reposted your album <span class="text-light">sa assad</span>
                            </div>
                            <div class="date mt-1">
                                4m ago
                            </div>
                        </div>


                    </div>

                    <div class="notify-image">
                        <img src="../../assets/demo-n-image.png" height="48">
                    </div>
                </div>
                                <div class="notify-main-card">
                    <div class="notify-content">
                        <div class="user-image" :style="{ backgroundImage: 'url(' + demoPerson + ')' }">
                            
                        </div>
                        <div class="user-data mt-1">
                            <div class="data-content">
                                <span class="name">Theo James</span> reposted your album <span class="text-light">sa assad</span>
                            </div>
                            <div class="date mt-1">
                                4m ago
                            </div>
                        </div>


                    </div>

                    <div class="notify-image">
                        <img src="../../assets/demo-n-image.png" height="48">
                    </div>
                </div>
                <div class="notify-main-card">
                    <div class="notify-content">
                        <div class="user-image" :style="{ backgroundImage: 'url(' + demoPerson + ')' }">
                            
                        </div>
                        <div class="user-data mt-1">
                            <div class="data-content">
                                <span class="name">Theo James</span> reposted your album <span class="text-light">sa assad</span>
                            </div>
                            <div class="date mt-1">
                                4m ago
                            </div>
                        </div>


                    </div>

                    <div class="notify-image">
                        <img src="../../assets/demo-n-image.png" height="48">
                    </div>
                </div>
                <div class="notify-main-card">
                    <div class="notify-content">
                        <div class="user-image" :style="{ backgroundImage: 'url(' + demoPerson + ')' }">
                            
                        </div>
                        <div class="user-data mt-1">
                            <div class="data-content">
                                <span class="name">Theo James</span> reposted your album <span class="text-light">s a assada assada assada assada assada assada assada assada assada assada assada assada assada assada assada assada assada assada assada assada assada assada assada assada assada assad</span>
                            </div>
                            <div class="date mt-1">
                                4m ago
                            </div>
                        </div>


                    </div>

                    <div class="notify-image">
                        <img src="../../assets/demo-n-image.png" height="48">
                    </div>
                </div>
                
            </div>

        </div>

        <div v-else class="invite-body">
            <div class="invite-upper">
                <div class="text-center">
                    <img src="../../assets/send_airplane.svg" width="32">
                </div>
                <div class="text-center">
                    <div class="invite-head">
                        Invite 10 creators, get 3 months free!
                    </div>
                    <div class="invite-sub-head">
                        *Creators invited must subscribe to be eligible
                    </div>
                </div>

                <div>
                    <v-btn class="purple-btn">
                        Copy link
                    </v-btn>
                </div>

                <div class="text-center text-muted">
                    Link expires in 72 hours & can only be used once
                </div>

            </div>
            <div class="divider"></div>
            <div class="invite-lower">
                <div class="text-normal">You have <span>4</span> more signups tp go!</div>
                <div class="invite-wrapper">
                    <div class="invite-div">
                        <div class="invite-content">
                            <div class="image" :style="{ backgroundImage: 'url(' + demoPerson + ')' }"></div>
                            <div class="text">
                                <span>Theo Hames</span> subscribed
                            </div>
                        </div>
                        <div class="date">
                            2min ago
                        </div>
                    </div>

                    <div class="invite-div">
                        <div class="invite-content">
                            <div class="image" :style="{ backgroundImage: 'url(' + demoPerson + ')' }"></div>
                            <div class="text">
                                <span>Theo Hames</span> subscribed
                            </div>
                        </div>
                        <div class="date">
                            2min ago
                        </div>
                    </div>

                    <div class="invite-div">
                        <div class="invite-content">
                            <div class="image" :style="{ backgroundImage: 'url(' + demoPerson + ')' }"></div>
                            <div class="text">
                                <span>Theo Hames</span> subscribed
                            </div>
                        </div>
                        <div class="date">
                            2min ago
                        </div>
                    </div>


                                        <div class="invite-div">
                        <div class="invite-content">
                            <div class="image" :style="{ backgroundImage: 'url(' + demoPerson + ')' }"></div>
                            <div class="text">
                                <span>Theo Hames</span> subscribed
                            </div>
                        </div>
                        <div class="date">
                            2min ago
                        </div>
                    </div>

                    <div class="invite-div">
                        <div class="invite-content">
                            <div class="image" :style="{ backgroundImage: 'url(' + demoPerson + ')' }"></div>
                            <div class="text">
                                <span>Theo Hames</span> subscribed
                            </div>
                        </div>
                        <div class="date">
                            2min ago
                        </div>
                    </div>
                    

                </div>
            </div>
        </div>
    </div>
</template>
<script>
import demoPerson from '../../assets/demo-person.png'
export default {
  props: {
    leftPos: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      demoPerson: demoPerson,
      inviteShow: false,
    }
  },
  methods: {
    toggleNotify() {
      if (this.inviteShow) {
        this.inviteShow = false
      } else {
        this.inviteShow = true
      }
    },
  },
}
</script>

<style src="./notification.scss" lang="scss" scoped></style>
