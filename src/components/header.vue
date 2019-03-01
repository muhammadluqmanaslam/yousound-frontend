<template>
  <v-layout row wrap class="my-header" :class="{'fixed': $store.getters['navigator/isHeaderFixed']}">
    <v-flex
      v-if="currentUser"
      xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1
    >
      <v-toolbar class="header">
        <router-link to="/discover"><v-toolbar-title></v-toolbar-title></router-link>
        <!-- <v-toolbar-title></v-toolbar-title> -->
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <v-btn icon slot="activator" :class="{ active: ['discover', 'merch'].indexOf(currentPage) > -1 }" @click.native="choosePage('discover')">
            <svg width="20px" height="22px" viewBox="0 0 20 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <!-- Generator: Sketch 45.2 (43514) - http://www.bohemiancoding.com/sketch -->
              <title>ic_discover</title>
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="07---Discover" transform="translate(-1382.000000, -61.000000)" fill="#FFFFFF">
                  <path d="M1385.25678,73.4758306 C1385.25678,76.0284429 1382,76.9273473 1382,81.5292976 C1382,86.0387417 1386.6721,88.8221124 1389.13112,89 C1388.66825,88.6147711 1386.55943,87.0506246 1386.55943,83.7584381 C1386.55943,80.0192591 1392.95793,78.221666 1391.34874,73.6196079 C1391.34874,73.6196079 1394.52874,75.4532261 1394.29885,78.6531056 C1394.11728,81.1803493 1395.93433,82.8960475 1396.71264,80.4506987 C1396.71264,80.4506987 1398.85828,82.0326798 1397.63218,84.9089796 C1396.70937,87.0739427 1395.39574,88.3019393 1394.8025,88.7768775 C1394.6076,88.9329031 1394.61215,88.9715344 1394.82454,88.8952873 C1396.28063,88.3725573 1402,85.9638687 1402,80.378864 C1402,73.9791049 1395.56322,68.2985556 1395.56322,68.2985556 C1395.56322,68.2985556 1390.47061,63.0594989 1395.81928,62.0299893 C1395.86103,62.0219537 1395.90393,61.9652908 1395.82178,61.8993302 C1395.49869,61.6398997 1394.56245,61 1393.18782,61 C1391.46368,61 1387.0192,62.4021787 1387.0192,66.1413577 C1387.0192,68.7659125 1388.0154,70.3118684 1388.0154,70.3118684 C1388.0154,70.3118684 1385.44743,69.1240539 1382.98224,70.969098 C1382.91016,71.0230472 1382.87168,71.129704 1383.03906,71.1374188 C1383.68546,71.1672119 1385.25678,71.4481659 1385.25678,73.4758306 Z" id="ic_discover"></path>
                </g>
              </g>
            </svg>
          </v-btn>
          <span>Discover</span>
        </v-tooltip>
        <v-badge color="red">
          <span slot="badge" v-if="$store.state.activity.badge.stream > 0">{{ $store.state.activity.badge.stream }}</span>
          <v-tooltip bottom>
            <v-btn icon slot="activator" :class="{ active: currentPage == 'stream' }" @click.native="choosePage('stream')">
              <svg width="23px" height="22px" viewBox="0 0 31 30" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 45.2 (43514) - http://www.bohemiancoding.com/sketch -->
                <title>ic_stream</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="07---Discover" transform="translate(-1311.000000, -61.000000)" fill="#FFFFFF">
                    <path d="M1322.1697,88.5769959 C1322.76943,89.008204 1322.90586,89.8438702 1322.47465,90.4436025 C1322.21357,90.8068659 1321.80323,91 1321.38807,91 C1321.11736,91 1320.84398,90.9186804 1320.60804,90.7485511 C1318.10265,88.9466793 1316.60733,86.0314774 1316.60733,82.9493563 C1316.60733,79.7955456 1318.15829,76.8407539 1320.75677,75.045302 C1321.3656,74.6247939 1322.19805,74.7783382 1322.61749,75.3855605 C1323.03747,75.9933177 1322.88499,76.825774 1322.27777,77.2457471 C1320.40207,78.5415112 1319.28232,80.6745466 1319.28232,82.9493563 C1319.28232,85.1728063 1320.36194,87.2764168 1322.1697,88.5769959 Z M1315.3778,77.4489993 C1315.98449,77.8705774 1316.13428,78.7041036 1315.71271,79.3102559 C1314.90593,80.4712007 1314.47954,81.8359795 1314.47954,83.2563981 C1314.47954,84.6302719 1314.88025,85.9570659 1315.63888,87.0939358 C1316.04868,87.709183 1315.88284,88.5389643 1315.26812,88.9493074 C1315.04021,89.1012467 1314.78235,89.1740064 1314.52769,89.1740064 C1314.09541,89.1740064 1313.67116,88.9648223 1313.41382,88.5790891 C1312.36095,87.0008462 1311.80455,85.1599195 1311.80455,83.2563981 C1311.80455,81.287607 1312.39626,79.3953205 1313.51654,77.7839078 C1313.93758,77.1772205 1314.77111,77.0268862 1315.3778,77.4489993 Z M1334.48007,61.1653143 C1334.78716,61.2760588 1342,63.9312518 1342,69.1052134 C1342,69.8440451 1341.40134,70.4427074 1340.66251,70.4427074 C1339.92367,70.4427074 1339.32501,69.8440451 1339.32501,69.1052134 C1339.32501,67.0486827 1336.98012,65.3484604 1335.13545,64.3838597 L1335.13545,83.370924 C1335.13545,86.705564 1332.35078,89.4073018 1328.49078,89.4073018 C1324.63184,89.4073018 1321.65083,86.705564 1321.65083,83.370924 C1321.65083,80.0378891 1324.78164,77.3350813 1328.64165,77.3350813 C1330.05404,77.3350813 1331.12296,77.6988796 1332.46046,78.3232218 L1332.46046,62.5798479 C1332.46046,61.7078018 1332.92591,61 1333.79795,61 C1334.03389,61 1334.45814,61.1572893 1334.48007,61.1653143 Z" id="ic_stream"></path>
                  </g>
                </g>
              </svg>
            </v-btn>
            <span>Stream</span>
          </v-tooltip>
        </v-badge>
        <v-badge color="red">
          <span slot="badge" v-if="$store.state.activity.badge.activity > 0">{{ $store.state.activity.badge.activity }}</span>
          <v-tooltip bottom>
            <v-btn icon slot="activator" :class="{ active: currentPage == 'notifications' }" @click.native="choosePage('notifications')">
              <svg width="20px" height="22px" viewBox="0 0 26 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 45.2 (43514) - http://www.bohemiancoding.com/sketch -->
                <title>ic_notifications</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="07---Discover" transform="translate(-1442.000000, -61.000000)" fill="#FFFFFF">
                    <path d="M1455.0995,88.9999532 C1453.24261,89.0090725 1451.68633,87.6842196 1451.2936,85.9063195 L1458.87934,85.8727604 C1458.50232,87.6543083 1456.95782,88.992293 1455.0995,88.9999532 Z M1466.86651,80.5306695 C1467.60912,81.0293132 1468.10968,82.1112278 1467.97936,82.9359779 C1467.84762,83.7599985 1467.01361,84.4348272 1466.12497,84.4366511 L1443.87796,84.4548897 C1442.98932,84.4556193 1442.15424,83.7818848 1442.02142,82.9585938 C1441.88861,82.1345732 1442.38737,81.0511995 1443.12927,80.5514615 C1443.12927,80.5514615 1444.50704,79.6227513 1445.05436,77.9130636 L1445.064,77.9017556 C1446.49532,73.1414773 1445.35747,65.7891272 1450.9028,63.4545846 C1451.31445,63.2816825 1451.89641,63.1346793 1452.30199,63.0434862 C1452.63081,61.8681899 1453.68404,61.0051387 1454.94113,61.0000319 C1456.2307,60.9938307 1457.31356,61.8937239 1457.62203,63.1138872 C1458.09545,63.2317087 1458.69204,63.4024221 1459.10298,63.5983048 C1464.33912,66.0896995 1463.43977,73.2370477 1464.93821,77.8966488 C1465.48768,79.605607 1466.86651,80.5306695 1466.86651,80.5306695 Z" id="ic_notifications"></path>
                  </g>
                </g>
              </svg>
            </v-btn>
            <span>Activity</span>
          </v-tooltip>
        </v-badge>
        <v-badge color="red">
          <span slot="badge" v-if="$store.state.activity.badge.message > 0">{{ $store.state.activity.badge.message }}</span>
          <v-tooltip bottom>
            <v-btn icon slot="activator" :class="{ active: currentPage == 'messages' }" @click.native="choosePage('messages')">
              <svg width="19px" height="18px" viewBox="0 0 24 23" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 45.2 (43514) - http://www.bohemiancoding.com/sketch -->
                <title>ic_inbox</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="07---Discover" transform="translate(-1508.000000, -64.000000)" fill="#FFFFFF">
                    <path d="M1529.6,64 L1510.4,64 C1509.08,64 1508,65.0788576 1508,66.3974614 L1508,86.3083785 C1508,86.9233273 1508.744,87.2314011 1509.1796,86.7962619 L1512.8,83.1796913 L1529.6,83.1796913 C1530.92,83.1796913 1532,82.1008337 1532,80.7822299 L1532,66.3974614 C1532,65.0788576 1530.92,64 1529.6,64" id="ic_inbox" transform="translate(1520.000000, 75.500000) scale(-1, 1) translate(-1520.000000, -75.500000) "></path>
                  </g>
                </g>
              </svg>
            </v-btn>
            <span>Messages</span>
          </v-tooltip>
        </v-badge>
        <v-badge color="red">
          <span slot="badge" v-if="$store.state.activity.badge.cart > 0">{{ $store.state.activity.badge.cart }}</span>
          <v-tooltip bottom>
            <v-btn icon slot="activator" :class="{ active: currentPage == 'cart' }" @click.native="choosePage('cart')">
              <svg width="22px" height="18px" viewBox="0 0 29 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 45.2 (43514) - http://www.bohemiancoding.com/sketch -->
                <title>ic_cart</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="07---Discover" transform="translate(-1572.000000, -64.000000)" fill="#FFFFFF">
                    <path d="M1600.22789,64 C1600.65212,64 1601,64.3454077 1601,64.7672729 L1601,66.1448562 C1601,66.5676209 1600.65212,66.9130286 1600.22789,66.9130286 L1597.63686,66.9130286 L1595.96252,68.5807004 L1592.82031,78.6060704 C1592.53116,79.5307557 1591.49746,80.2881342 1590.52385,80.2881342 L1585.11545,80.2881342 L1582.95408,80.2881342 L1577.54477,80.2881342 C1576.57161,80.2881342 1575.53836,79.5312055 1575.24786,78.6060704 L1572.07628,68.4835545 C1571.78713,67.5588692 1572.34555,66.8014907 1573.31916,66.8014907 L1582.95408,66.8014907 L1585.11545,66.8014907 L1593.80205,66.8014907 C1593.83684,66.7358273 1593.87886,66.6728623 1593.93397,66.6175431 C1593.93397,66.6175431 1596.90948,64 1597.03146,64 L1600.22789,64 Z M1578.57892,81.3023647 C1579.88189,81.3023647 1580.93818,82.3538794 1580.93818,83.6509575 C1580.93818,84.9480355 1579.88189,85.9995503 1578.57892,85.9995503 C1577.27595,85.9995503 1576.21967,84.9480355 1576.21967,83.6509575 C1576.21967,82.3538794 1577.27595,81.3023647 1578.57892,81.3023647 Z M1589.4906,81.3019149 C1590.79402,81.3019149 1591.85031,82.3534296 1591.85031,83.6509575 C1591.85031,84.9484853 1590.79402,86 1589.4906,86 C1588.18718,86 1587.13089,84.9484853 1587.13089,83.6509575 C1587.13089,82.3534296 1588.18718,81.3019149 1589.4906,81.3019149 Z" id="ic_cart" transform="translate(1586.500000, 75.000000) scale(-1, 1) translate(-1586.500000, -75.000000) "></path>
                  </g>
                </g>
              </svg>
            </v-btn>
            <span>Cart</span>
          </v-tooltip>
        </v-badge>
        <v-badge color="red" v-if="currentUser && ['artist', 'brand', 'label'].indexOf(currentUser.user_type) > -1">
          <span slot="badge" v-if="$store.state.activity.badge.sell > 0">{{ $store.state.activity.badge.sell }}</span>
          <v-tooltip bottom>
            <v-btn icon slot="activator" :class="{ active: currentPage == 'sell' }" @click.native="choosePage('sell')">
              <svg width="20px" height="22px" viewBox="0 0 24 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 45.2 (43514) - http://www.bohemiancoding.com/sketch -->
                <title>ic_delivery</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g id="07---Discover" transform="translate(-1641.000000, -61.000000)" fill-rule="nonzero" fill="#FFFFFF">
                    <path d="M1658.1416,80 L1659.28232,80 C1659.67883,80 1660.00026,80.3214366 1660.00026,80.7179487 L1660.00026,88.2564103 C1660.00026,88.6529224 1659.67883,88.974359 1659.28232,88.974359 L1646.71821,88.974359 L1646.71821,88.974359 C1646.3217,88.974359 1646.00026,88.6529224 1646.00026,88.2564103 L1646.00026,80.7179487 C1646.00026,80.3214366 1646.3217,80 1646.71821,80 L1647.78702,80 L1641.17667,72.4412308 C1641.04467,72.2901026 1640.98794,72.1005641 1641.00212,71.9160513 C1641.48685,65.7948205 1646.7414,61 1652.9643,61 C1659.1894,61 1664.44358,65.7951795 1664.92649,71.9167692 C1664.9414,72.1009231 1664.8843,72.2904615 1664.7523,72.4412308 L1658.1416,80 Z M1655.90976,72.2143578 C1655.08649,71.5385053 1654.05594,71.1686667 1652.96467,71.1686667 C1651.8723,71.1686667 1650.84176,71.5385053 1650.01849,72.2143578 L1652.41382,80 L1653.54436,80 L1655.90976,72.2143578 Z M1642.75412,72.0139136 L1650.07818,80 L1650.99891,80 L1648.5523,72.3740923 C1647.70612,71.5981901 1646.60612,71.1686667 1645.43194,71.1686667 C1644.45412,71.1686667 1643.52612,71.4681256 1642.75412,72.0139136 Z M1654.98976,80 L1655.90976,80 L1663.17485,72.0135686 C1662.40358,71.4681256 1661.47558,71.1686667 1660.49812,71.1686667 C1659.32358,71.1686667 1658.22321,71.5985351 1657.37558,72.3747823 L1654.98976,80 Z" id="ic_delivery"></path>
                  </g>
                </g>
              </svg>
            </v-btn>
            <span>Sell</span>
          </v-tooltip>
        </v-badge>
        <v-menu
          v-if="currentUser"
          bottom
          left
          offset-y
          nudge-top="-5"
          nudge-left="-70"
          class="profile-menu"
          content-class="profile-menu__content"
        >
          <v-btn icon slot="activator">
            <div class="profile-image" :style="{'background-image': 'url(' + currentUser.avatar.thumb.url + ')'}" v-if="currentUser"></div>
          </v-btn>
          <v-list two-line>
            <v-list-tile
              avatar
              :to="'/' + currentUser.slug"
              class="profile"
            >
              <v-list-tile-avatar>
                <img v-bind:src="currentUser.avatar.url">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ currentUser.display_name }}
                  <v-icon class="user-status online" v-if="['artist', 'label', 'brand'].indexOf(currentUser.user_type) > -1">fa-check-circle</v-icon>
                </v-list-tile-title>
                <v-list-tile-sub-title>View Profile</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile class="chat">
              <label
                v-if="currentUser.user_type=='artist'"
                @click="$router.push(`/upload/album`)"
              >Upload</label>
              <label
                v-if="!$store.getters['app/disabledLiveVideo'] && currentUser.enabled_live_video"
                @click="$router.push(`/user/${currentUser.slug}/video`)"
              >Live Video</label>
              <label
                @click="$router.push(`/user/${currentUser.slug}/chat`)"
              >Chat</label>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list-tile key="manage" to="/albums" v-if="currentUser.user_type=='artist'">
              <v-list-tile-content>
                <v-list-tile-title>Manage</v-list-tile-title>
                <v-list-tile-sub-title>Edit your albums</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile key="settings" to="/settings">
              <v-list-tile-content>
                <v-list-tile-title>Settings</v-list-tile-title>
                <v-list-tile-sub-title>Edit profile, password, bank info</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <!-- <v-list-tile key="moderator">
              <v-list-tile-title class="profile-menu-item">
                <v-icon right>fa-users</v-icon>
                <label>Moderator</label>
              </v-list-tile-title>
            </v-list-tile>
            <v-list-tile key="getverified" to="/verified" v-if="currentUser.user_type=='artist'">
              <v-list-tile-title class="profile-menu-item">
                <v-icon right>fa-gear</v-icon>
                <label>Get Verified</label>
              </v-list-tile-title>
            </v-list-tile>
            <v-list-tile key="main_landing" to="/">
              <v-list-tile-title class="profile-menu-item">
                <label>Main Landing</label>
              </v-list-tile-title>
            </v-list-tile>
            <v-list-tile key="landing" to="/home">
              <v-list-tile-title class="profile-menu-item">
                <label>Landing</label>
              </v-list-tile-title>
            </v-list-tile> -->
            <v-list-tile key="payments" to="/payments" v-if="['listener', 'artist', 'label'].indexOf(currentUser.user_type) > -1">
              <v-list-tile-content>
                <v-list-tile-title>Payments</v-list-tile-title>
                <v-list-tile-sub-title>View transactions, refunds</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile key="admin" to="/admin" v-if="['admin', 'moderator'].indexOf(currentUser.user_type) > -1">
              <v-list-tile-content>
                <v-list-tile-title>Admin</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile key="labels" to="/labels" v-if="['artist', 'label'].indexOf(currentUser.user_type) > -1">
              <v-list-tile-content v-if="currentUser.user_type=='artist'">
                <v-list-tile-title>My Labels</v-list-tile-title>
                <v-list-tile-sub-title>Manage your labels</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-content v-else>
                <v-list-tile-title>Record Labels</v-list-tile-title>
                <v-list-tile-sub-title>Manage record labels</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile key="support" @click="">
              <v-list-tile-content>
                <v-list-tile-title>Support</v-list-tile-title>
                <v-list-tile-sub-title>Help docs</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>            
            <v-list-tile key="signout" @click="signOut">
              <v-list-tile-content>
                <v-list-tile-title>Sign Out</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar>
      <div class="search-box">
        <div class="search-container">
            <span class="icon">
            <svg width="20px" height="20px" viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 45.2 (43514) - http://www.bohemiancoding.com/sketch -->
                <title>Group 22</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="searchIcon" transform="translate(-732.000000, -61.000000)" stroke="#FFFFFF" stroke-width="1.5999999">
                        <g id="Group-29" transform="translate(710.000000, 50.000000)">
                            <g id="Group-22" transform="translate(23.000000, 12.000000)">
                                <circle id="Oval-2" cx="11.375" cy="11.375" r="11.375"></circle>
                                <path d="M19.5,19.5 L25.59375,25.59375" id="Line" stroke-linecap="round" stroke-linejoin="round"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
          </span>
          <input class="search-field" type="search" id="search" v-model="keyword" placeholder="Search artist, song or keyword" @keyup.enter="goToSearch()" />
        </div>
      </div>
    </v-flex>

    <v-flex
      v-else
      xs12 sm10 offset-sm1 md10 offset-md1 lg10 offset-lg1 xl10 offset-xl1
    >
      <v-toolbar class="header">
        <router-link to="/discover"><v-toolbar-title></v-toolbar-title></router-link>
        <v-spacer></v-spacer>
        <v-btn flat class="my-0" @click.native="choosePage('login')">Login</v-btn>
        <v-btn dark round color="green" class="my-0" @click.native="choosePage('register')">Sign Up</v-btn>
      </v-toolbar>
    </v-flex>
  </v-layout>
</template>

<script type="text/javascript" src="./header.ctrl.js"></script>
