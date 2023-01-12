<template>
    <div>
        <div class="repost-banner">
            <div class="dflex gap-25 align-center justify-space-between">
              <div class="repost-content">
      
              <div class="dflex align-center mb-4">
                <img :src="Icon" width="25" height="25">
                <h2 class="repost-head">{{MainHeading}} </h2>
              </div>
              <p class="repost-text">{{MainText}}</p>
            </div>
      
            <div class="repost-img">
              <img :src="MainImage" width="100%"/>
            </div>
      
            </div>

            <router-link to="/upload" class="repost-banner-back">
                < Back
            </router-link>
          </div>
    </div>
</template>

<style lang="scss">

.repost-banner{
    background: linear-gradient(92.72deg, #0047FF 0.28%, #328BF3 59.51%);
    width: calc(100% + 32px);
    margin-left: -16px;
    padding: 73px 64px;
    overflow: hidden;
    margin-top: -24px;
    margin-bottom: 25px;
    position: relative;
    z-index: 0;

    .repost-banner-back{
        position: absolute;
        top: 35px;
        left: 66px;
        cursor: pointer;
        font-size: 14px;
        color: white;
        font-weight: bold;
        font-family: 'DM Sans';
    }

    @media screen and (max-width: 1275px){
        .repost-head{
            font-size: 28px !important;
        } 
        
        .repost-text{
            font-size: 14px !important;
            line-height: 24px !important;
        }
    }

    .gap-25{
        gap: 25px;
    }
.repost-content{
width: 50%;
max-width: 515px;
    .repost-head{
        color: white;
        font-size: 36px;
        letter-spacing: -1%;
        font-weight: bold;
        margin-left: 20px;
        white-space: no-wrap;
    }
    .repost-text{
        color: white;
        font-size: 18px;
        font-weight: bold;
        letter-spacing: -1%;
        line-height: 32px;
    }
}

.repost-img{
    width: 50%;
    max-width: 485px;
    border-radius: 40px;
    overflow: hidden;
    margin-bottom: -130px;
    margin-right: 30px; 
}


}

</style>


<script>

export default {
    props: {
        MainHeading: String,
        MainText: String,
        MainImage: String,
        Icon: String,
    }
}
</script>