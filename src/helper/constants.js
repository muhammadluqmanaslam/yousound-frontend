export const Countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Anguilla', 'Antigua & Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia & Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands',
  'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China', 'Colombia', 'Congo', 'Cook Islands', 'Costa Rica',
  'Cote D Ivoire', 'Croatia', 'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
  'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana',
  'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India',
  'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyz Republic', 'Laos', 'Latvia',
  'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania',
  'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia',
  'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Pierre & Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
  'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts & Nevis', 'St Lucia', 'St Vincent', 'St. Lucia', 'Sudan',
  'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor L\'Este', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia',
  'Turkey', 'Turkmenistan', 'Turks & Caicos', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'United States Minor Outlying Islands', 'Uruguay',
  'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'
]

export const StreamHourlyPrice = 1000

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

// #TODO - combile audio_player_play and replay
export const MyEvents = {
  AUTH_SIGNIN: 'auth_signin',
  AUTH_SIGNOUT: 'auth_signout',
  USER_FOLLOW: 'follow',
  AUDIO_PLAYER_PAUSE: 'pause',
  AUDIO_PLAYER_PLAY: 'play',
  AUDIO_PLAYER_REPLAY: 'replay',
  AUDIO_PLAYER_SKIPTO: 'skipTo',
  VIDEO_PLAYER_INIT: 'video_player_init',
  VIDEO_PLAYER_FULLSCREEN_ENTER: 'video_player_fullscreen_enter'
}
