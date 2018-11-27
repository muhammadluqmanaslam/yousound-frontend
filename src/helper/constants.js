/* eslint-disable */
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

// Additional options being used for user registration.
export const UserBooleanOptions = [
  {id: true, name: 'Yes'},
  {id: false, name: 'No'},
]
export const UserGenderOptions = ['Male', 'Female']
export const UserArtistTypeOptions = ['Solo artist', 'Brand', 'Producer', 'DJ']
export const UserReleasedAlbumsCountOptions = [
  {id: 0, name: '0'},
  {id: 1, name: '1-5'},
  {id: 6, name: '6-10'},
  {id: 11, name: '10+'},
]
export const UserYearsSinceFirstReleasedOptions = [
  {id: 0, name: '0'},
  {id: 1, name: '1-5'},
  {id: 6, name: '6-10'},
  {id: 11, name: '10+'},
]
export const UserAnnualIncomeOnMerchSalesOptions = [
  {id: 0, name: 'None'},
  {id: 1, name: '$1-$4k'},
  {id: 5001, name: '$5k-$10k'},
  {id: 10001, name: '$11k-$50k'},
  {id: 50001, name: '$50k+'},
]
export const UserAnnualPerformancesCountOptions = [
  {id: 0, name: 'None'},
  {id: 1, name: '1-10'},
  {id: 11, name: '11-50'},
  {id: 51, name: '50+'},
]
export const UserSignedStatusOptions = ['No', 'Yes, Indie label', 'Yes, major label']
export const UserPerformanceRightsOrganizationOptions = [
  {id: 'Argentina-SADAIC', name: 'SADAIC'},
  {id: 'Australia-APRA', name: 'Australasian Performing Right Association (APRA)'},
  {id: 'Australia-PPCA', name: 'Phonographic Performance Company of Australia (PPCA)'},
  {id: 'Austria-AKM', name: 'Autoren, Komponisten und Musikverleger (AKM)'},
  {id: 'Belgium-SABAM', name: 'SABAM'},
  {id: 'Bolivia-SENAPI', name: 'Servicio Nacional de Propiedad Intelectual (SENAPI)'},
  {id: 'Brazil-ECAD', name: 'ECAD (Escritório Central de Arrecadação e Distribuição)'},
  {id: 'Bulgaria-MUSICAUTHOR', name: 'MUSICAUTHOR'},
  {id: 'Canada-SOCAN', name: 'Society of Composers, Authors and Music Publishers of Canada (SOCAN)'},
  {id: 'Chile-SCD', name: 'Sociedad Chilena del Derecho de Autor (SCD)'},
  {id: 'Colombia-SAYCO/ACINPRO', name: 'SAYCO/ACINPRO'},
  {id: 'Croatia-HDS', name: 'HDS'},
  {id: 'Czech Republic-OSA', name: 'OSA'},
  {id: 'Denmark-KODA', name: 'KODA'},
  {id: 'Estonia-EAU', name: 'EAU'},
  {id: 'Finland-Teosto', name: 'Teosto'},
  {id: 'France-SACEM', name: 'Société des auteurs, compositeurs et éditeurs de musique (SACEM)'},
  {id: 'Georgia-SAS', name: 'SAS'},
  {id: 'Germany-GEMA', name: 'Gesellschaft für musikalische Aufführungs- und mechanische Vervielfältigungsrechte (GEMA)'},
  {id: 'Greece-AEPI', name: 'AEPI'},
  {id: 'Greece-GEA-GRAMMO', name: 'GEA-GRAMMO, ERATO-APOLLON'},
  {id: 'Hong Kong-CASH', name: 'CASH'},
  {id: 'Hungary-ARTISJUS', name: 'ARTISJUS'},
  {id: 'India-The Indian Performing Right Society Ltd', name: 'The Indian Performing Right Society Ltd'},
  {id: 'Ireland-PPI', name: 'Irish Music Rights Organisation, Phonographic Performance Ireland (PPI)'},
  {id: 'Israel-ACUM', name: 'ACUM'},
  {id: 'Italy-SIAE', name: 'SIAE'},
  {id: 'Japan-JASRAC', name: 'JASRAC'},
  {id: 'Lithuania-LATGA-A', name: 'LATGA-A'},
  {id: 'Malaysia-MACP', name: 'MACP'},
  {id: 'Mexico-SACM', name: 'SACM'},
  {id: 'Nepal-MRCSN', name: 'Music Royalty Collection Society Nepal (MRCSN)'},
  {id: 'Netherlands-BUMA', name: 'BUMA'},
  {id: 'New Zealand-APRA', name: 'APRA'},
  {id: 'Norway-TONO', name: 'TONO'},
  {id: 'Panama-SPAC', name: 'SPAC'},
  {id: 'Peru-APDAYC', name: 'APDAYC'},
  {id: 'Philippines-FILSCAP', name: 'FILSCAP'},
  {id: 'Poland-ZAIKS', name: 'ZAIKS'},
  {id: 'Puerto Rico-ACEMLA', name: 'ACEMLA'},
  {id: 'Romania-UCMR', name: 'UCMR'},
  {id: 'Russia-RAO', name: 'RAO'},
  {id: 'Serbia-SOKOJ', name: 'SOKOJ'},
  {id: 'Singapore-COMPASS', name: 'COMPASS'},
  {id: 'Slovakia-SOZA', name: 'SOZA'},
  {id: 'South Africa-SAMRO', name: 'Southern African Music Rights Organisation (SAMRO)'},
  {id: 'South Korea-KOMCA', name: 'KOMCA, KOSCAP'},
  {id: 'Spain-SGAE', name: 'SGAE'},
  {id: 'Sweden-STIM', name: 'STIM'},
  {id: 'Switzerland-SUISA', name: 'SUISA'},
  {id: 'Taiwan-MUST', name: 'MUST'},
  {id: 'Thailand-MCT', name: 'MCT'},
  {id: 'Trinidad-COTT', name: 'COTT'},
  {id: 'Ukraine-UACRR', name: 'UACRR'},
  {id: 'United Kingdom-PRS', name: 'PRS, PPL'},
  {id: 'United States of America-SPACEM', name: 'ASCAP, BMI, SESAC, ACEMLA (SPACEM)'},
  {id: 'Uruguay-AGADU', name: 'AGADU'},
  {id: 'Venezuela-SACVEN', name: 'SACVEN'},
]
export const UserArtistsCountOptions = [
  {id: 0, name: 'None'},
  {id: 1, name: '1-2'},
  {id: 3, name: '3-5'},
  {id: 6, name: '6-10+'},
]
export const UserStandardBrandTypeOptions = [
  'Clothing Brand (Streetwear, Luxury)',
  'Service Brand (Mixing/Mastering Engineers, Graphic Designers, Manufacturing)',
  'Lifestyle Brand (Culture, Sports, Promoters, Food & Beverage)',
  'Broadcasting Brand (Podcasts, TV/Movie, Personality)',
  'Technology Brand (Software, Video Game)',
  'Retail Brand (Record Stores, Coffee Shop)'
]
export const UserEmployeesCountOptions = [
  {id: 1, name: '1-5'},
  {id: 6, name: '6-10'},
  {id: 11, name: '10+'},
]
export const UserYearsInBusinessOptions = [
  {id: 0, name: '0'},
  {id: 1, name: '1-5'},
  {id: 6, name: '6-10+'},
]
export const UserProductsCountOptions = [
  {id: 0, name: 'None'},
  {id: 1, name: '1-10'},
  {id: 11, name: '11-50'},
  {id: 51, name: '50+'},
]
export const UserAnnualIncomeOptions = [
  {id: 0, name: 'None'},
  {id: 5000, name: '$5k-$24k'},
  {id: 25000, name: '$25k-$80k'},
  {id: 80000, name: '$81k-$100k'},
  {id: 100000, name: '$100k-$249k'},
  {id: 250000, name: '$250k-$1m'},
  {id: 1000000, name: '$1m-$10m'},
  {id: 10000000, name: '$10m+'},
]

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
