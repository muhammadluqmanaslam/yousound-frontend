<template>
  <div class="page landing-page">
    <div class="page__header">
      <div class="text-xs-center">
        <img src="/static/images/nav_logo_white.png" height="30">
        <h3>You've been invited</h3>
        <p>YouSound is a music platform for Artists, Brands & Labels.<br>
        As an invitee, you are part of the first wave of Verified Users.</p>
        <v-btn to="/register" round dark color="blue" class="px-1">Sign Up</v-btn>
      </div>
    </div>

    <v-layout>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
        <div class="section ethical-section">
          <div class="section__header">
            <h3><label>Ethical & Sustainable</label><span class="bg-color-1"></span></h3>
            <p>YouSound is designed to empower the music community with<br>
            permission based features for content & interactions</p>
          </div>

          <v-layout row wrap>
            <v-flex xs6 sm4>
              <div class="my-card">
                <div class="o-out bg-color-1"><div class="o-in"></div></div>
                <div class="my-card__title">Verified Artist</div>
                <div class="my-card__text">Each applicant is verified to ensure a legal & high quality experience.</div>
              </div>
            </v-flex>
            <v-flex xs6 sm4>
              <div class="my-card">
                <div class="o-out bg-color-2"><div class="o-in"></div></div>
                <div class="my-card__title">User Roles</div>
                <div class="my-card__text">Listeners, Verified Artists, Brands, & Labels each have specific roles.</div>
              </div>
            </v-flex>
            <v-flex xs6 sm4>
              <div class="my-card">
                <div class="o-out bg-color-3"><div class="o-in"></div></div>
                <div class="my-card__title">Private Stats</div>
                <div class="my-card__text">By hiding public stats, we encourage users to focus on the content.</div>
              </div>
            </v-flex>
            <v-flex xs6 sm4>
              <div class="my-card">
                <div class="o-out bg-color-4"><div class="o-in"></div></div>
                <div class="my-card__title">Content Control</div>
                <div class="my-card__text">Labels must direct messages to add Artists or their albums to their roster.</div>
              </div>
            </v-flex>
            <v-flex xs6 sm4>
              <div class="my-card">
                <div class="o-out bg-color-5"><div class="o-in"></div></div>
                <div class="my-card__title">Direct Comments</div>
                <div class="my-card__text">Comments are private until Artists make them public.</div>
              </div>
            </v-flex>
            <v-flex xs6 sm4>
              <div class="my-card">
                <div class="o-out bg-color-6"><div class="o-in"></div></div>
                <div class="my-card__title">Album Credits</div>
                <div class="my-card__text">Artists can credit any user & appear on album page linked to user profiles.</div>
              </div>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
    </v-layout>

    <div class="section">
      <div class="section__header">
        <h3><label>Circulate Content</label><span class="bg-color-2"></span></h3>
        <p>YouSound was built to get your content to people who want it.<br>Each feature incentivizes deep listening & engagement</p>
      </div>

      <landing-card
        klass="right-content-card"
        title="Repost Everything"
        mediaSource="/static/images/img_repost_everything.jpg"
      >
        <p>Albums, Merch, Playlists & Live Video Streams can be reposted by any user.  Maximize your reach, create sophisticated release cycles, and push previously released content back into the Stream.</p>
      </landing-card>

      <landing-card 
        title="Genre Filters"
        mediaSource="/static/images/img_genre_filters.jpg"
      >
        <p>Tailor your experience by using Genres Filters.  Your will only receive content in your Stream & Discover from your selected genres, and make room for everything you're looking for.</p>

      </landing-card>

      <landing-card klass="right-content-card"
        title="Download = Repost"
        mediaSource="/static/images/img_download_repost.jpg"
      >
        <p>All music is free to download, and when an album is downloaded it’s automatically reposted & you also have an opprotunity to support the artist with a donation.</p>
      </landing-card>

    </div>

    <div class="section">
      <div class="section__header">
        <h3><label>Generate Revenue</label><span class="bg-color-3"></span></h3>
        <p>YouSound lets every user send & receive payments.<br>
       Giving all users the ability to earn revenue allows the community to support each other</p>
      </div>

      <landing-card
        title="Sell Merch"
        mediaSource="/static/images/img_sell_merch.jpg"
      >
        <p>Verified Artists, Brands & Labels can sell physical products.  Buyers can add items to their cart from multiple sellers and check out at once. Seller keeps 90% of each transaction.</p>
      </landing-card>

      <landing-card
        klass="right-content-card"
        title="Repost Requests"
        mediaSource="/static/images/img_repost_requests.jpg"
      >
        <p>Each user can generate revenue by sharing content they love. Verified Artists, Brands, and Labels can request reposts via Direct Message. Accepted requests are automatically reposted & remain on their profile permanently.</p>
      </landing-card>

      <landing-card
        title="Sell Services"
        mediaSource="/static/images/img_sell_services.jpg"
      >
        <p>Verified Users can accept payments for services & donations.  Graphic Designers, Mixing Engineers & any creative Verified Brand can easily get paid for their services.</p>
      </landing-card>
    </div>

    <div class="section">
      <div class="section__header">
        <h3><label>Community</label><span class="bg-color-4"></span></h3>
        <p>YouSound allows you to connect & collaborate with likeminded people so your<br>
        content can be experienced in a meaningful way</p>
      </div>

      <landing-card
        title="Album Collaboration"
        mediaSource="/static/images/img_album_collaboration.jpg"
      >
        <p>Artists can request to add other Artists as collaborators via Direct Message.  Collaborators share the credit & stats of an album.  Users can also 'Follow All' collaborators of an album.</p>
      </landing-card>

      <landing-card
        klass="right-content-card"
        title="Merch Collaboration"
        mediaSource="/static/images/img_merch_collaboration.jpg"
      >
        <p>Merch collaboration allows Verified Users to automatically split merch sales.  Collaborators can assign percentage splits & recoup cost via Direct Message.  All collaborators can view all sales and see what’s been shipped.</p>
      </landing-card>

      <landing-card
        title="Video Chat"
        mediaSource="/static/images/img_video_chat.jpg"
      >
        <p>Verified Users can broadcast live and attach their albums, merch and let users download and add to cart while they watch you live.  Users can also repost your broadcast to their followers.</p>
      </landing-card>

      <landing-card
        klass="right-content-card"
        title="Verified Brands & Labels"
        mediaSource="/static/images/img_labels_brands.jpg"
      >
        <p>Verified Brands & Labels can sell products & services & can collaborate with Artists and each other to create & sell products fairly & easily.</p>
      </landing-card>
    </div>

    <div class="page__footer">
      <div class="text-xs-center">
        <h3>You sound like you're ready</h3>
        <v-btn to="/register" round dark color="blue" class="px-1">Sign Up</v-btn>
      </div>
      <app-footer></app-footer>
    </div>
  </div>
</template>

<script type="text/javascript" src="./landing.ctrl.js"></script>
