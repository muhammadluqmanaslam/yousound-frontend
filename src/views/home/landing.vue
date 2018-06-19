<template>
  <div class="page landing-page">
    <div class="page__header">
      <div class="text-xs-center">
        <img src="/static/images/nav_logo_white.png" height="30">
        <h3>You've been invited</h3>
        <p>YouSound is a music platform for Artists, Brands & Labels to create without compromise.<br>
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
                <div class="my-card__text">Each artist is verified by a human. Verifying each artist ensures a legal & high quality experience.</div>
              </div>
            </v-flex>
            <v-flex xs6 sm4>
              <div class="my-card">
                <div class="o-out bg-color-2"><div class="o-in"></div></div>
                <div class="my-card__title">User Roles</div>
                <div class="my-card__text">Listeners, Verified Artists, Labels, & Brands each have specific roles for what they can do.</div>
              </div>
            </v-flex>
            <v-flex xs6 sm4>
              <div class="my-card">
                <div class="o-out bg-color-3"><div class="o-in"></div></div>
                <div class="my-card__title">Private Stats</div>
                <div class="my-card__text">By hiding public stats, we encourage users to focus on the music itself.</div>
              </div>
            </v-flex>
            <v-flex xs6 sm4>
              <div class="my-card">
                <div class="o-out bg-color-4"><div class="o-in"></div></div>
                <div class="my-card__title">Content Control</div>
                <div class="my-card__text">Labels must direct messages to add you or your albums to their roster.</div>
              </div>
            </v-flex>
            <v-flex xs6 sm4>
              <div class="my-card">
                <div class="o-out bg-color-5"><div class="o-in"></div></div>
                <div class="my-card__title">Direct Comments</div>
                <div class="my-card__text">Comments are private to ensure respect conversation.  Artists can make comments public.</div>
              </div>
            </v-flex>
            <v-flex xs6 sm4>
              <div class="my-card">
                <div class="o-out bg-color-6"><div class="o-in"></div></div>
                <div class="my-card__title">Album Credits</div>
                <div class="my-card__text">Artists can credit any user. Album credits appear on album page & link to user profiles.</div>
              </div>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
    </v-layout>

    <div class="section">
      <div class="section__header">
        <h3><label>Circulate Content</label><span class="bg-color-2"></span></h3>
        <p>YouSound was built to get your content to the people who want it.<br>Each feature incentivizes deep listening & engagement with all of your content.</p>
      </div>

      <landing-card
        title="Download = Repost"
        mediaSource="/static/images/img_download_repost.jpg"
      >
        <p>When an album is downloaded, it’s automatically reposted to the user’s followers.  Before a song is downloaded, users have an opprotunity to support the artist.</p>
      </landing-card>

      <landing-card
        klass="right-content-card"
        title="Repost Everything"
        mediaSource="/static/images/img_repost_everything.jpg"
      >
        <p>Albums, Merch, Playlists & Live Video Streams can be reposted by any user.  This allows you to maximize your reach, create sophisticated release cycles, and allows you to push previously released content back into the Stream.</p>
      </landing-card>

      <landing-card
        title="Genre Filters"
        mediaSource="/static/images/img_genre_filters.jpg"
      >
        <p>Every user can tailor their experience by customizing Music Genres.  Users will only receive content in their Stream & Discover pages from their selected genres.  Genre filters also prevent Verified Users from requesting reposts for albums tagged with Genres not selected by the user.</p>
      </landing-card>
    </div>

    <div class="section">
      <div class="section__header">
        <h3><label>Generate Revenue</label><span class="bg-color-3"></span></h3>
        <p>YouSound lets every user send & receive payments.<br>
        Giving all users the ability to make money allows the community to support each other.</p>
      </div>

      <landing-card
        title="Sell Merch"
        mediaSource="/static/images/img_sell_merch.jpg"
      >
        <p>Verified Artists, Brands & Labels can sell physical and digital products.  Buyers can add items to their cart from multiple sellers and check out at once.  Seller keeps 90% of each transaction.</p>
      </landing-card>

      <landing-card
        klass="right-content-card"
        title="Repost Requests"
        mediaSource="/static/images/img_repost_requests.jpg"
      >
        <p>Each user can generate revenue by sharing content they love. Verified Artists can request a reposts via Direct Message. If a user reposts your content, it’s automatically reposted to their followers & remains on their profile permanently.</p>
      </landing-card>

      <landing-card
        title="Sell Services"
        mediaSource="/static/images/img_sell_services.jpg"
      >
        <p>Verified Users can accept payments for services & donations.  Graphic Designers, Mixing Engineers & any creative entity can easily get paid for their services.</p>
      </landing-card>
    </div>

    <div class="section">
      <div class="section__header">
        <h3><label>Community</label><span class="bg-color-4"></span></h3>
        <p>YouSound allows you to connect with likeminded people so your<br>
        content can be experienced in a meaningful way.</p>
      </div>

      <landing-card
        title="Album Collaboration"
        mediaSource="/static/images/img_album_collaboration.jpg"
      >
        <p>Artists can request to add other Artists as collaborators via Direct Message.  Collaborators share the credit & stats of an album.  Users also have the option to Follow All collaborators on the album page.</p>
      </landing-card>

      <landing-card
        klass="right-content-card"
        title="Merch Collaboration"
        mediaSource="/static/images/img_merch_collaboration.jpg"
      >
        <p>Merch collaboration is a powerful feature that allows Verified Users to split merch sales.  Collaborators can assign percentage splits, recoup cost via Direct Message.  All collaborators can view all sales and see what’s been shipped.</p>
      </landing-card>

      <landing-card
        title="Video Chat"
        mediaSource="/static/images/img_video_chat.jpg"
      >
        <p>Each Verified User can Live Video Stream and leverage all of the connected features.  Attach Merch, Albums and accept donations from users while you broadcast live.  User can also repost your broadcast to their followers.</p>
      </landing-card>

      <landing-card
        klass="right-content-card"
        title="Verified Labels & Brands"
        mediaSource="/static/images/img_labels_brands.jpg"
      >
        <p>Verified Brands & Labels can sell products & services. Both play an important role when collaborating with Artists and each other to create & sell products fairly & easily.</p>
      </landing-card>
    </div>

    <div class="page__footer">
      <div class="text-xs-center">
        <h3>YouSound... like you're ready to</h3>
        <v-btn to="/register" round dark color="blue" class="px-1">Sign Up</v-btn>
      </div>
      <app-footer></app-footer>
    </div>
  </div>
</template>

<script type="text/javascript" src="./landing.ctrl.js"></script>
