export const StreamHourlyPrice = 500

export const PaymentTypes = {
  repost_price_upgrade_cost: 'Repost Price Upgrade Cost'
}

// export const RepostPrices = [5, 10, 15]

// export const MediaLiveInputTypes = {
//   UDP_PUSH: 'UDP_PUSH',
//   RTP_PUSH: 'RTP_PUSH',
//   RTMP_PUSH: 'RTMP_PUSH',
//   RTMP_PULL: 'RTMP_PULL',
//   URL_PULL: 'URL_PULL'
// }

export const MediaLiveInputTypes = ['UDP_PUSH', 'RTP_PUSH', 'RTMP_PUSH', 'RTMP_PULL', 'URL_PULL']
export const MediaLiveInputCodecs = ['MPEG2', 'AVC', 'HEVC']
export const MediaLiveInputResolutions = ['SD', 'HD', 'UHD']
export const MediaLiveInputMaximumBitrates = ['MAX_10_MBPS', 'MAX_20_MBPS', 'MAX_50_MBPS']

export const MyEvents = {
  AUTH_SIGNIN: 'auth_signin',
  AUTH_SIGNOUT: 'auth_signout',
  VIDEO_PLAYER_INIT: 'video_player_init'
}
