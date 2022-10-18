<template>
    <div class="side-player-placeholder">
        <div class="side-player-placeholder__wrapper">
            <img :src="require('@/assets/player_radio.svg')" width="80%" alt="">
            
            <div class="cta__wrapper">
                <span class="cta__text">Play something new!</span>
            </div>
        </div>
        <div class="side-player-placeholder__action">
            <img :src="require('@/assets/ic_rewind_outline.svg')" class="_previous" alt="previous button">
            <img :src="require('@/assets/ic_play_outline.svg')" class="_play" alt="play button">
            <img :src="require('@/assets/ic_skip_outline.svg')" class="_skip" alt="skip button">

        </div>
    </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.side-player-placeholder {
    padding-left: 12px;
    padding-right: 12px;

    &__wrapper {
        text-align: center;
        background-color: #242732;
        padding: 30px 15px;
        border-radius: 6px;
        
        img {
            margin: 0 auto;
        }

        .cta__wrapper {
            background-color: #DDDFE8;
            border-radius: 100px;
            padding: 7px 10px;
            text-align: center;
            margin: 0 auto;
            width: 80%;
            margin-top: 20px;
        }
        .cta__text {
            color: #000000;
            font-weight: 500;
        }
    }
    &__action {
        width: 60%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        margin-top: 20px;

        img {
            width: 20px;
            cursor: pointer;

            &.play {
                width: 26px;
            }
        }
    }
}
</style>
