<template>
  <div class="page landing-page">
    <div class="section section-intro">
      <div class="section-content">
        <v-layout wrap>
          <v-flex xs12 text-xs-center>
            <div class="logo-icon" style="background-image: url('static/images/logo_icon.svg')"></div>
            <h1 class="logo-headline" role="text">  <br class="small-hide">You've been invited.</h1>
            <v-btn class="signup-btn" to="register/listener">SIGN UP</v-btn>
          </v-flex>
          <v-flex xs12 class="section-intro-image">
            <div class="intro-image"></div>
          </v-flex>
        </v-layout>
      </div>
    </div>

    <div class="section section-design">
      <div class="section-content">
        <v-layout row>
          <div class="keyline">&nbsp;</div>
        </v-layout>

        <div class="hero-copy">
          <v-layout row wrap justify-center>
            <v-flex xs12 sm12 md10 lg10 text-xs-center>
              <p>A music platform for Artists to create income without compromise.</p>
            </v-flex>
          </v-layout>
        </div>

        <v-layout row>
          <div class="lockline">&nbsp;</div>
        </v-layout>

        <div class="hero-2">
          <v-layout row wrap justify-center>
            <v-flex xs12 sm12 md10 lg10 text-xs-center>
              <p>As artists ourselves, we've identified problems we've struggled with and built the tools needed to sustain our creative careers. <br> You are the first wave of Verified Artists.</p>
            </v-flex>
          </v-layout>
          <v-layout row>
            <div class="keyline">&nbsp;</div>
          </v-layout>
        </div>
      </div>
    </div>

    <div class="section section-thoughtful section-background-white">
      <div class="section-content">
        <v-layout row wrap justify-center>
          <v-flex xs12 sm12 md10 text-xs-center>
            <div class="copy-thoughtful">
              <h2>Ethical & Sustainable.</h2>
              <p>Artists have unprecedented control of their content. Clear user roles let the community enjoy engaging experiences with your content.</p>
            </div>
          </v-flex>

          <v-flex xs12 text-xs-center class="large-hide small-show">
          </v-flex>
        </v-layout>

        <div class="gallery-copy">
          <v-layout row wrap>
            <v-flex xs12 sm5 md5 lg5 offset-sm1 offset-md0 class="copy-left river-content daily-stories">
              <h3>Verified Artists</h3>
              <p>Each artist is verified by a human. By verifying each artist, label & brand, we ensure a legal & high quality experience for every user.</p>
            </v-flex>
            <v-flex xs12 sm5 md5 lg6 offset-md1 offset-lg1 class="river-padding river-hw-padding">
              <figure class="image-hardware-river">
                <figure class="screen-position image-app-store-daily"></figure>
              </figure>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12 sm4 lg6 md5 offset-sm2 offset-md2 offset-lg2 class="copy-left river-content river-right">
              <h3>User Roles</h3>
              <p>Listeners, Artists, Labels & Brands are all given specific permissions of what they can do.  User Roles ensure content is organized which increases deeper engagement.</p>
            </v-flex>
            <v-flex xs12 sm3 lg3 md3 offset-sm1 offset-md1 class="river-padding padding-top">
              <figure class="image-hardware-river">
                <figure class="screen-position image-app-store-tips-tricks"></figure>
              </figure>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12 sm5 md5 lg5 offset-sm1 offset-md0 class="copy-left river-content">
              <h3>Privacy</h3>
              <p>Views, plays & other metrics are hidden from the public so music is the focus.  Comments are only seen by the artist and users @mentioned, unless artist makes comment public.  This ensures respectful conversation.</p>
            </v-flex>
            <v-flex xs12 sm5 md5 lg6 offset-md1 offset-lg1 class="river-padding river-hw-padding padding-top">
              <figure class="image-hardware-river">
                <figure class="screen-position image-app-store-collection"></figure>
              </figure>
            </v-flex>
          </v-layout>


          <v-layout row wrap>
            <v-flex xs12 sm4 lg6 md5 offset-sm2 offset-md2 offset-lg2 class="copy-left river-content river-right">
              <h3>Content Control</h3>
              <p>Labels must request to add an artist or their albums to their profile via Direct Message. Artists can remove themselves and their content from a label at any time.</p>
            </v-flex>
            <v-flex xs12 sm3 lg3 md3 offset-sm1 offset-md1 class="river-padding padding-top">
              <figure class="image-hardware-river">
                <figure class="screen-position image-app-store-tips-tricks"></figure>
              </figure>
            </v-flex>
          </v-layout>
        </div>
      </div>
    </div>

    <div class="section section-thoughtful section-background-white">
      <div class="section-content">
        <v-layout row wrap justify-center>
          <v-flex xs12 sm12 md10 text-xs-center>
            <div class="copy-thoughtful">
              <h2>Circulation</h2>
              <p>The core of this platform was designed to get your content to people who actually want it. We make it easy to incentivize users to listen deeply, while giving each user filters to control the flow of content.</p>
            </div>
          </v-flex>

          <v-flex xs12 text-xs-center class="large-hide small-show">
          </v-flex>
        </v-layout>

        <div class="gallery-copy">
          <v-layout row wrap>
            <v-flex xs12 sm5 md5 lg5 offset-sm1 offset-md0 class="copy-left river-content daily-stories">
              <h3>Download = Repost</h3>
              <p>When an album is downloaded it’s reposted to the user’s followers. Users who really love your music will download it, and that makes it easier for people with similar taste to discover your album.</p>
            </v-flex>
            <v-flex xs12 sm5 md5 lg6 offset-md1 offset-lg1 class="river-padding river-hw-padding">
              <figure class="image-hardware-river">
                <figure class="screen-position image-app-store-daily"></figure>
              </figure>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12 sm4 lg6 md5 offset-sm2 offset-md2 offset-lg2 class="copy-left river-content river-right">
              <h3>Promote</h3>
              <p>Every user can generate revenue by promoting content they love. Artists & Labels can request a repost from any user via Direct Message. If a user accepts the request, they receive payment & content is permanently reposted. </p>
            </v-flex>
            <v-flex xs12 sm3 lg3 md3 offset-sm1 offset-md1 class="river-padding padding-top">
              <figure class="image-hardware-river">
                <figure class="screen-position image-app-store-tips-tricks"></figure>
              </figure>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12 sm5 md5 lg5 offset-sm1 offset-md0 class="copy-left river-content">
              <h3>Genre Filters</h3>
              <p>Users can hide genres to customize their experience. Genre filters also prevent Artists & Labels from requesting reposts from users who don't subscribe to their album's genre.</p>
            </v-flex>
            <v-flex xs12 sm5 md5 lg6 offset-md1 offset-lg1 class="river-padding river-hw-padding padding-top">
              <figure class="image-hardware-river">
                <figure class="screen-position image-app-store-collection"></figure>
              </figure>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12 sm4 lg6 md5 offset-sm2 offset-md2 offset-lg2 class="copy-left river-content river-right">
              <h3>Repost Everything</h3>
              <p>From Albums, Videos, Merch, and Playlists, all content can be reposted. All of your content can circulate together.</p>
            </v-flex>
            <v-flex xs12 sm3 lg3 md3 offset-sm1 offset-md1 class="river-padding padding-top">
              <figure class="image-hardware-river">
                <figure class="screen-position image-app-store-tips-tricks"></figure>
              </figure>
            </v-flex>
          </v-layout>
        </div>
      </div>
    </div>

    <div class="section section-thoughtful section-background-white">
      <div class="section-content">
        <v-layout row wrap justify-center>
          <v-flex xs12 sm12 md10 text-xs-center>
            <div class="copy-thoughtful">
              <h2>Generate Revenue</h2>
              <p>We've built an economy. Not only can artists make money, now every user can generate revenue. This will allow users to support the artists they love while increasing overall engagement.</p>
            </div>
          </v-flex>

          </v-flex>
        </v-layout>

        <div class="gallery-copy">
          <v-layout row wrap>
            <v-flex xs12 sm5 md5 lg5 offset-sm1 offset-md0 class="copy-left river-content daily-stories">
              <h3>Sell Merch & Digital Content</h3>
              <p>Verified Artists, Labels, and Brands can sell physical and digital merch. Buyers can add items to their cart from multiple sellers, and check out at once. Sellers keep 90% of the transaction.</p>
            </v-flex>
            <v-flex xs12 sm5 md5 lg6 offset-md1 offset-lg1 class="river-padding river-hw-padding">
              <figure class="image-hardware-river">
                <figure class="screen-position image-app-store-daily"></figure>
              </figure>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12 sm4 lg6 md5 offset-sm2 offset-md2 offset-lg2 class="copy-left river-content river-right">
              <h3>Repost Requests</h3>
              <p>Every user can make money promoting content from Verified Artists, Labels & Brands they support. Money earned is kept in their account to allow instant purchases using their balance. </p>
            </v-flex>
            <v-flex xs12 sm3 lg3 md3 offset-sm1 offset-md1 class="river-padding padding-top">
              <figure class="image-hardware-river">
                <figure class="screen-position image-app-store-tips-tricks"></figure>
              </figure>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12 sm5 md5 lg5 offset-sm1 offset-md0 class="copy-left river-content">
              <h3>Services</h3>
              <p>Artists, Labels & Brands can accept or pay for services from other users inside Direct Message. Payments for features, production or any creative service can be completed here.</p>
            </v-flex>
            <v-flex xs12 sm5 md5 lg6 offset-md1 offset-lg1 class="river-padding river-hw-padding padding-top">
              <figure class="image-hardware-river">
                <figure class="screen-position image-app-store-collection"></figure>
              </figure>
            </v-flex>
          </v-layout>


          <v-layout row wrap>
            <v-flex xs12 sm4 lg6 md5 offset-sm2 offset-md2 offset-lg2 class="copy-left river-content river-right">
              <h3>Send Love</h3>
              <p>Verified Artists & Labels can use the Send Love button to accept contributions from any user for any reason. Get creative with how they incentivize users to support. </p>
            </v-flex>
            <v-flex xs12 sm3 lg3 md3 offset-sm1 offset-md1 class="river-padding padding-top">
              <figure class="image-hardware-river">
                <figure class="screen-position image-app-store-tips-tricks"></figure>
              </figure>
            </v-flex>
          </v-layout>
        </div>
      </div>
    </div>

    <div class="section section-thoughtful section-background-white">
      <div class="section-content">
        <v-layout row wrap justify-center>
          <v-flex xs12 sm12 md10 text-xs-center>
            <div class="copy-thoughtful">
              <h2>Community</h2>
              <p>Community is the foundation of everything. We give every user the tools to connect with likeminded people so content can be experienced in a meaningful way.</p>
            </div>
          </v-flex>

          <v-flex xs12 text-xs-center class="large-hide small-show">
          </v-flex>
        </v-layout>

        <div class="gallery-copy">
          <v-layout row wrap>
            <v-flex xs12 sm5 md5 lg5 offset-sm1 offset-md0 class="copy-left river-content daily-stories">
              <h3>Album Collaboration</h3>
              <p>Artists can request any artist to be a collaborator via Direct Message. Collaborators share the stats of an album, and users have the option of “Following All” collaborators.</p>
            </v-flex>
            <v-flex xs12 sm5 md5 lg6 offset-md1 offset-lg1 class="river-padding river-hw-padding">
              <figure class="image-hardware-river">
                <figure class="screen-position image-app-store-daily"></figure>
              </figure>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12 sm4 lg6 md5 offset-sm2 offset-md2 offset-lg2 class="copy-left river-content river-right">
              <h3>Merch Collaboration</h3>
              <p>Verified Artists, Labels & Brands can split merch sales and view incoming orders. Collaborators can assign percentage splits & confirm it via Direct Message. </p>
            </v-flex>
            <v-flex xs12 sm3 lg3 md3 offset-sm1 offset-md1 class="river-padding padding-top">
              <figure class="image-hardware-river">
                <figure class="screen-position image-app-store-tips-tricks"></figure>
              </figure>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12 sm5 md5 lg5 offset-sm1 offset-md0 class="copy-left river-content">
              <h3>Audio Chat</h3>
              <p>Each user gets their own chat room, and every room allows any user in a room to broadcast what they’re currently listening to on their player. Any user can tune into anyone broadcasting. Users can also share albums and merch to chat rooms.</p>
            </v-flex>
            <v-flex xs12 sm5 md5 lg6 offset-md1 offset-lg1 class="river-padding river-hw-padding padding-top">
              <figure class="image-hardware-river">
                <figure class="screen-position image-app-store-collection"></figure>
              </figure>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12 sm4 lg6 md5 offset-sm2 offset-md2 offset-lg2 class="copy-left river-content river-right">
              <h3>Labels & Brands</h3>
              <p>Labels can invite artists to their roster, and request to artist albums via Direct Message. Labels can promote any album on their roster & sell merch. Brand accounts are listener accounts with the ability to sell merch.</p>
            </v-flex>
            <v-flex xs12 sm3 lg3 md3 offset-sm1 offset-md1 class="river-padding padding-top">
              <figure class="image-hardware-river">
                <figure class="screen-position image-app-store-tips-tricks"></figure>
              </figure>
            </v-flex>
          </v-layout>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript" src="./artist_landing.ctrl.js"></script>
