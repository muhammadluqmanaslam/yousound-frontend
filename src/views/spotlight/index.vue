<template>
    <div>
        <BannerUpload 
        MainHeading="Spotlight video" 
        MainText="Upload a 15 second video clip to attract new followers when new potential subscribers preview your content"
        :Icon="iconImage"
        :MainImage="bannerImage"
        />

        <div class="spotlight-header dflex align-center justify-space-between">
            <div class="replace"> 
                < Replace video
            </div>
            <div>
                <v-btn class="head-button">
                    Save video
                </v-btn>
            </div>
        </div>

        <div class="main-flex">
            <div class="w-75">
                <h2 class="heading">Web Preview</h2>
                <div class="web-container">
                    <div class="web-content">
                        <div class="_logo mb-5">
                            <img src="../../assets/nav_logo_white.png" width="140">
                        </div>
                        <div class="_user-icon mb-4">
                            <div class="user-icon-inner">
                            </div>
                        </div>
                        <div class="_info mb-4">
                            <p>Subscribe to support</p>
                            <div class="dflex align-center">
                                <p class="font-bold mr-1">Username</p>
                                <img src="../../assets/check_success.svg" width="12">
                            </div>
                        </div>
                        <div class="_text mb-4">
                            asdad a sdas das dasdas das dasd asdas das das das da sdas das das dasdasdasd as das dasdasdasd asd asdasdasd asdas
                        </div>
                        <div class="_button">
                            <v-btn rounded class="button-web">
                                Subscribe
                            </v-btn>
                        </div>
                    </div>
                    <div class="web-video">
                        
                    </div>
                </div>
            </div>

            <div class="w-25">
                <h2 class="heading">Mobile Preview</h2>
                <div class="mob-container">
                    <div class="mob-video">

                    </div>
                    <div class="mob-content">
                        <div class="_info">
                            <p>Subscribe to support</p>
                            <div class="dflex align-center">
                                <p class="font-bold mr-1">Username</p>
                                <img src="../../assets/check_success.svg" width="12">
                            </div>
                        </div>
                        <div class="_content">
                            <div class="_logo mb-3">
                                <img src="../../assets/ys_logo_primary-black.svg" width="70">
                            </div>

                            <div class="_text mb-3">
                                asdad a sdas das dasdas das dasd asdas das das das da sdas das das dasdasdasd as das dasdasdasd asd asdasdasd asdas
                            </div>

                            <div class="_button">
                                <v-btn class="button-mob">
                                    Start 30 day free trial
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BannerUpload from '../BannerUpload'
import iconImage from '../../assets/flashlight-white.svg'
import mainImage from '../../assets/live-drop.gif'

export default {
    components:{
        BannerUpload,
    },
    data(){
        return{
            iconImage: iconImage,
            bannerImage: mainImage,
        }
    }
}
</script>

<style src="./spotlight.scss" lang="scss" scoped>