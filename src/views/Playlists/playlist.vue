<template>
  <div class="playlist px-5">
    <content-top-header class="mt-3">
      <template slot="topHeader">
        <ul>
          <li
            v-for="tab in tabs"
            :key="tab.id"
            :href="`#${tab.id}`"
            :class="{ 'active tab-active': isActiveTab(tab.id) }"
          >
            <label @click="onTab(tab.id)" class="innerBold">{{
              tab.title
            }}</label>
          </li>
        </ul>
      </template>
    </content-top-header>

    <div class="breadcrumb">Playlists > {{ "Playlist" }}</div>

    <div class="meta-summary">
      <span
        >{{ playlist.tracks.length }}
        {{ "track" | pluralize(playlist.tracks.length) }}</span
      >
      <span class="mx-1">&#8226;</span>
      <span>{{ playlist.status }}</span>
    </div>

    <div class="list-track-view list-track-view-trackCard listings">
      <div
        v-for="(track, index) in playlist.tracks"
        :key="index"
        class="list-track-view-item listing"
      >
        <track-card
          :objects="[tempAlbum]"
          :objectIndex="0"
          hideMoreMenu
          hideTrackLength
        />

        <div class="d-none list-track-view-action listing-action">
            <span class="share" @click="shareTrack(track)">
                <img :src="require('@/assets/ic_share.svg')" alt="share icon">
            </span>
            <span class="add">
                <v-icon>add</v-icon>
            </span>
            <span class="more">
                <v-icon>more_horiz</v-icon>
            </span>
        </div>
      </div>
    </div>

    <share-modal
      v-if="share_dialog"
      :item="shareTrack()"
      :dismiss="closeShareTrack"
    />
  </div>
</template>

<script>
import trackCard from "@/components/trackcard";
import contentTopHeader from "@/components/contentTopHeader";
import shareModal from "@/components/sharemodal"

export default {
  components: {
    contentTopHeader,
    trackCard,
    shareModal,
  },
  data() {
    return {
      playlist: {
        name: "Temp Playlist",
        status: "private",
        tracks: [1, 2, 3, 4],
      },
      activeTab: "music",
      tabs: [
        { id: "music", title: "Music" },
        { id: "videos", title: "Videos" },
        { id: "products", title: "Products" },
      ],
      share_dialog: false,
    };
  },
  methods: {
    onTab(tab) {
      this.activeTab = tab;
      this.$router.push({
        name: "CollectionIndex",
        params: { activeTab: tab },
      });
    },
    isActiveTab(tab) {
      return this.activeTab === tab;
    },
    shareTrack(track) {
      this.share_dialog = true;

      return track;
    },
    closeShareTrack(tab) {
      this.share_dialog = false;
    },
  },
  computed: {
    tempAlbum() {
      return {
        id: 1236,
        slug: "lov3bomb",
        name: "LOV3BOMB",
        description: "An EP by Tri Nohbi",
        cover: {
          url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
          large: {
            url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/large_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
          },
          thumb: {
            url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/thumb_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
          },
        },
        album_type: "album",
        collaborators_count: 2,
        status: "collaborated",
        genres: [
          {
            id: 159,
            slug: "hip-hop",
            name: "Hip Hop",
            region: "HIP HOP / RAP",
            color: "",
            sequence: 0,
            users_size: 0,
          },
        ],
        is_only_for_live_stream: false,
        is_content_acapella: false,
        is_content_instrumental: false,
        is_content_stems: false,
        is_content_remix: false,
        is_content_dj_mix: false,
        recommended: true,
        played: 0,
        downloaded: 0,
        reposted: 0,
        commented: 5,
        enabled_sample: false,
        created_at: "2022-07-08T06:11:17.179Z",
        released_at: "2022-07-08T00:00:00.000Z",
        recommended_at: "2022-07-08T23:52:56.661Z",
        location: "Chicago, Illinois, United States",
        tracks: [
          {
            id: 9678,
            slug: "01-talk-dirty",
            name: "TALK",
            audio: {
              url: "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9678/ef01af4c-73ed-4770-9c91-59dd0a2818bf.mp3?X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=f61531524a7e20a2edf3966ae74cbde89834aa24cb72abd1b87a5928bd2b8bc4",
            },
            status: "active",
            downloaded: 0,
            played: 7,
            audio_download_url:
              "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9678/ef01af4c-73ed-4770-9c91-59dd0a2818bf.mp3?response-content-disposition=attachment%3B%20filename%3D%22TALK.mp3%22&X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=9287bca1c4ec54ec73078ec953fe301edd4df0a2c68840eea119c992788305a2",
            album: {
              id: 1236,
              name: "LOV3BOMB",
              slug: "lov3bomb",
              cover: {
                url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                large: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/large_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
                thumb: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/thumb_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
              },
              album_type: "album",
            },
            position: 0,
          },
          {
            id: 9677,
            slug: "02-hml-dirty",
            name: "HML",
            audio: {
              url: "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9677/c3508291-7041-4eb2-aa53-628467c73b52.mp3?X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=4a6833dbdb74ec862c2fb545438693f34aeadfe28b0d054402f54e531465f84a",
            },
            status: "active",
            downloaded: 0,
            played: 6,
            audio_download_url:
              "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9677/c3508291-7041-4eb2-aa53-628467c73b52.mp3?response-content-disposition=attachment%3B%20filename%3D%22HML.mp3%22&X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=0f7016c9670d5ae3cc836e948de001aab0eff750dba6cd4e4e6ce471141b5ead",
            album: {
              id: 1236,
              name: "LOV3BOMB",
              slug: "lov3bomb",
              cover: {
                url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                large: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/large_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
                thumb: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/thumb_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
              },
              album_type: "album",
            },
            position: 1,
          },
          {
            id: 9676,
            slug: "03-jack-ya-body-dirty",
            name: "JACK YA BODY",
            audio: {
              url: "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9676/af403f93-5b64-475b-bd97-746775bb258f.mp3?X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=345846094de2789a28f82ecddaccffcf7d69531d23cfa6a37e3fda846f055250",
            },
            status: "active",
            downloaded: 0,
            played: 5,
            audio_download_url:
              "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9676/af403f93-5b64-475b-bd97-746775bb258f.mp3?response-content-disposition=attachment%3B%20filename%3D%22JACK%20YA%20BODY.mp3%22&X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=03c41aeac252d7444be515ad883936c8d8c7cb9129c544aec8fa4a668526ae22",
            album: {
              id: 1236,
              name: "LOV3BOMB",
              slug: "lov3bomb",
              cover: {
                url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                large: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/large_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
                thumb: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/thumb_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
              },
              album_type: "album",
            },
            position: 2,
          },
          {
            id: 9674,
            slug: "04-moment-dirty-correct",
            name: "MOMENT",
            audio: {
              url: "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9674/fda6d1a8-8890-46d7-9ee6-74400f1cd8c1.mp3?X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=76410f1b5d09f6574059f2b1638788e5a7b890d4a3dcd963cf2340bf6b84e890",
            },
            status: "active",
            downloaded: 0,
            played: 4,
            audio_download_url:
              "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9674/fda6d1a8-8890-46d7-9ee6-74400f1cd8c1.mp3?response-content-disposition=attachment%3B%20filename%3D%22MOMENT.mp3%22&X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=1ae402547fae9ea2662fb46e413c08ac88391d29ec78749da97ef42957b0ff06",
            album: {
              id: 1236,
              name: "LOV3BOMB",
              slug: "lov3bomb",
              cover: {
                url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                large: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/large_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
                thumb: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/thumb_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
              },
              album_type: "album",
            },
            position: 3,
          },
          {
            id: 9672,
            slug: "05-love-crime-dirty",
            name: "LOVE CRIME",
            audio: {
              url: "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9672/c4c09096-682b-4ab3-9214-ef4b4c4df98a.mp3?X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=4b11f97df12cd202772132471a9c827450bdc77479d29355499f61f1da0f07c7",
            },
            status: "active",
            downloaded: 0,
            played: 4,
            audio_download_url:
              "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9672/c4c09096-682b-4ab3-9214-ef4b4c4df98a.mp3?response-content-disposition=attachment%3B%20filename%3D%22LOVE%20CRIME.mp3%22&X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=286285dacd327da6f6cb1e81d809fcad8ea889a8787b74ae1dab1265024930b7",
            album: {
              id: 1236,
              name: "LOV3BOMB",
              slug: "lov3bomb",
              cover: {
                url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                large: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/large_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
                thumb: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/thumb_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
              },
              album_type: "album",
            },
            position: 4,
          },
          {
            id: 9671,
            slug: "06-got-it-back-dirty",
            name: "GOT IT BACK",
            audio: {
              url: "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9671/d4dfcf16-c6bd-4397-80f7-0c649f07cb39.mp3?X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=17d5817eb6cca994ef3b1aa966461658e65396414d8b56266c5f6abff8502873",
            },
            status: "active",
            downloaded: 0,
            played: 4,
            audio_download_url:
              "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9671/d4dfcf16-c6bd-4397-80f7-0c649f07cb39.mp3?response-content-disposition=attachment%3B%20filename%3D%22GOT%20IT%20BACK.mp3%22&X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=887fa46b1f6d602aa7135910369c43f6d9aac61afcef82c3d82a17361281234e",
            album: {
              id: 1236,
              name: "LOV3BOMB",
              slug: "lov3bomb",
              cover: {
                url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                large: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/large_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
                thumb: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/thumb_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
              },
              album_type: "album",
            },
            position: 5,
          },
          {
            id: 9670,
            slug: "07-lie-to-me-dirty",
            name: "LIE TO ME",
            audio: {
              url: "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9670/8107729d-3481-462b-8d16-63db321c6a6a.mp3?X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=8234c71c9a7f43486e5922fa825501cb1ccbd82e0c049fae900568d9f5cc8a15",
            },
            status: "active",
            downloaded: 0,
            played: 4,
            audio_download_url:
              "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9670/8107729d-3481-462b-8d16-63db321c6a6a.mp3?response-content-disposition=attachment%3B%20filename%3D%22LIE%20TO%20ME.mp3%22&X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=4c99a549f4f5691dcf2c26e069eb00df1ae7e05d83dfb34d18118b59b4d785c0",
            album: {
              id: 1236,
              name: "LOV3BOMB",
              slug: "lov3bomb",
              cover: {
                url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                large: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/large_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
                thumb: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/thumb_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
              },
              album_type: "album",
            },
            position: 6,
          },
          {
            id: 9669,
            slug: "08-hellraiser-dirty",
            name: "HELLRAISER",
            audio: {
              url: "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9669/fbfa78f2-170a-4187-951f-207911634e65.mp3?X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=0479630e7fc63bd8123ea5f0a3085699cd47ae50740d8453252b2cd5782c9e99",
            },
            status: "active",
            downloaded: 0,
            played: 2,
            audio_download_url:
              "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9669/fbfa78f2-170a-4187-951f-207911634e65.mp3?response-content-disposition=attachment%3B%20filename%3D%22HELLRAISER.mp3%22&X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=d450274f128a8da9829ce280b1bb10a89cd4b05a9fdd73b02ace3fdbd323796a",
            album: {
              id: 1236,
              name: "LOV3BOMB",
              slug: "lov3bomb",
              cover: {
                url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                large: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/large_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
                thumb: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/thumb_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
              },
              album_type: "album",
            },
            position: 7,
          },
          {
            id: 9673,
            slug: "09-love-is-cruel-dirty",
            name: "LOVE IS CRUEL",
            audio: {
              url: "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9673/7771a8d5-c4b5-495b-bff7-8f99d3a4f501.mp3?X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=9fb0eb248a30b614304aef407143b1cd45750b54a94eb9318bf97ce5ffeb29eb",
            },
            status: "active",
            downloaded: 0,
            played: 2,
            audio_download_url:
              "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9673/7771a8d5-c4b5-495b-bff7-8f99d3a4f501.mp3?response-content-disposition=attachment%3B%20filename%3D%22LOVE%20IS%20CRUEL.mp3%22&X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=861794752b4d1200513f6560cb630d216ec8ec8c505c5963d84b659656d886de",
            album: {
              id: 1236,
              name: "LOV3BOMB",
              slug: "lov3bomb",
              cover: {
                url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                large: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/large_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
                thumb: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/thumb_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
              },
              album_type: "album",
            },
            position: 8,
          },
          {
            id: 9675,
            slug: "10-deep-end-dirty",
            name: "DEEP END",
            audio: {
              url: "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9675/80a7c983-f5b3-42c3-bbe6-5a5d9e9d6a1a.mp3?X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=80016a73e6b532c3a3e24f1f74a1604340edbc946ee155f4d0fbfeba2e01f7e6",
            },
            status: "active",
            downloaded: 0,
            played: 2,
            audio_download_url:
              "https://ys-prod.s3.amazonaws.com/uploads/track/audio/9675/80a7c983-f5b3-42c3-bbe6-5a5d9e9d6a1a.mp3?response-content-disposition=attachment%3B%20filename%3D%22DEEP%20END.mp3%22&X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=ba780a9b1cd6113a00a5489982a518d7ad5c6627773635970b8494dcba49399f",
            album: {
              id: 1236,
              name: "LOV3BOMB",
              slug: "lov3bomb",
              cover: {
                url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                large: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/large_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
                thumb: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1236/thumb_c40b1a8a-892a-43f4-8a4d-75cf74375dea.jpeg",
                },
              },
              album_type: "album",
            },
            position: 9,
          },
        ],
        products: [],
        collaborators: [
          {
            id: 1846,
            user_id: 4509,
            album_id: 1236,
            user_type: "collaborator",
            user_role: "Producer",
            status: "accepted",
            user: {
              id: 4509,
              slug: "miclee",
              username: "miclee",
              display_name: "miclee",
              user_type: "listener",
              avatar: {
                url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/user/avatar/4509/606dbda2-4b08-45ab-9424-037822b27239.png",
                thumb: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/user/avatar/4509/thumb_606dbda2-4b08-45ab-9424-037822b27239.png",
                },
              },
              status: "active",
              stripe_connected: false,
              is_following: true,
            },
          },
          {
            id: 1845,
            user_id: 46,
            album_id: 1236,
            user_type: "collaborator",
            user_role: "Producer",
            status: "accepted",
            user: {
              id: 46,
              slug: "ruckazoid",
              username: "ruckazoid",
              display_name: "RUCKAZOID",
              user_type: "artist",
              avatar: {
                url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/user/avatar/46/2c6737ff-37a1-4f37-b982-c5c082484baa.gif",
                thumb: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/user/avatar/46/thumb_2c6737ff-37a1-4f37-b982-c5c082484baa.gif",
                },
              },
              status: "active",
              stripe_connected: true,
              is_following: false,
            },
          },
        ],
        can_edit_collaborators: false,
        contributors: [],
        labels: [],
        samplings: [],
        user: {
          id: 4464,
          slug: "trinohbi",
          username: "trinohbi",
          display_name: "Tri Nohbi",
          first_name: null,
          last_name: null,
          contact_url: null,
          user_type: "artist",
          avatar: {
            url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/user/avatar/4464/7f3b6684-1033-43b3-afd8-7bff48ac6f1f.jpeg",
            thumb: {
              url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/user/avatar/4464/thumb_7f3b6684-1033-43b3-afd8-7bff48ac6f1f.jpeg",
            },
          },
          repost_price: 100,
          repost_price_end_at: null,
          max_repost_price: 100,
          status: "active",
          size_chart: "",
          shipping_policy: "",
          return_policy: "",
          privacy_policy: "",
          followers: 22,
          followings: 11,
          stripe_connected: false,
          is_following: true,
          invited_at: null,
          request_role: "artist",
          request_status: "accepted",
          recent_items: [
            {
              id: 656698,
              feed_type: "repost",
              assoc_id: 1135,
              assoc_type: "Album",
              consumer_id: 2593,
              publisher_id: 4464,
              status: null,
              created_at: "2022-02-02T21:57:53.976Z",
              updated_at: "2022-02-02T21:57:53.976Z",
              publisher: {
                id: 4464,
                slug: "trinohbi",
                username: "trinohbi",
                display_name: "Tri Nohbi",
                first_name: null,
                last_name: null,
                contact_url: null,
                user_type: "artist",
                avatar: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/user/avatar/4464/7f3b6684-1033-43b3-afd8-7bff48ac6f1f.jpeg",
                  thumb: {
                    url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/user/avatar/4464/thumb_7f3b6684-1033-43b3-afd8-7bff48ac6f1f.jpeg",
                  },
                },
                repost_price: 100,
                repost_price_end_at: null,
                max_repost_price: 100,
                status: "active",
                size_chart: "",
                shipping_policy: "",
                return_policy: "",
                privacy_policy: "",
                followers: 22,
                followings: 11,
                stripe_connected: false,
                is_following: true,
                invited_at: null,
                request_role: "artist",
                request_status: "accepted",
                inviter: null,
              },
              assoc: {
                id: 1135,
                slug: "warm-up-22",
                name: "Warm Up 22'",
                description: "This that 22.",
                cover: {
                  url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1135/62873919-cdf0-4733-9e9d-a96d4bd27357.png",
                  large: {
                    url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1135/large_62873919-cdf0-4733-9e9d-a96d4bd27357.png",
                  },
                  thumb: {
                    url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1135/thumb_62873919-cdf0-4733-9e9d-a96d4bd27357.png",
                  },
                },
                album_type: "album",
                collaborators_count: 0,
                status: "published",
                genres: [
                  {
                    id: 147,
                    slug: "beats-beat-tapes",
                    name: "Beats / Beat Tapes",
                    region: "HIP HOP / RAP",
                    color: "",
                    sequence: 0,
                    users_size: 0,
                  },
                ],
                is_only_for_live_stream: false,
                is_content_acapella: false,
                is_content_instrumental: true,
                is_content_stems: false,
                is_content_remix: true,
                is_content_dj_mix: false,
                recommended: false,
                played: 0,
                downloaded: 0,
                reposted: 0,
                commented: 7,
                enabled_sample: false,
                created_at: "2022-01-23T22:42:04.636Z",
                released_at: "2022-01-23T00:00:00.000Z",
                recommended_at: null,
                location: "",
                tracks: [
                  {
                    id: 8945,
                    slug: "warm-up-22",
                    name: "Warm Up 22'",
                    audio: {
                      url: "https://ys-prod.s3.amazonaws.com/uploads/track/audio/8945/fc9aebc8-56d3-4950-8fe6-8166e1d53194.mp3?X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=57968df604f73a8953eb4087e9404a378d10ac364fe6caca472e5a02a56176a8",
                    },
                    status: "active",
                    downloaded: 2,
                    played: 26,
                    audio_download_url:
                      "https://ys-prod.s3.amazonaws.com/uploads/track/audio/8945/fc9aebc8-56d3-4950-8fe6-8166e1d53194.mp3?response-content-disposition=attachment%3B%20filename%3D%22Warm%20Up%2022%27.mp3%22&X-Amz-Expires=86400&X-Amz-Date=20220811T133056Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIRERRWL7LUOSDJBA/20220811/us-east-1/s3/aws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=50fa8c4e824299cf26fe5e9d52515d360a0517270f9a9ec16b0d94f4f39c0cd8",
                    album: {
                      id: 1135,
                      name: "Warm Up 22'",
                      slug: "warm-up-22",
                      cover: {
                        url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1135/62873919-cdf0-4733-9e9d-a96d4bd27357.png",
                        large: {
                          url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1135/large_62873919-cdf0-4733-9e9d-a96d4bd27357.png",
                        },
                        thumb: {
                          url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/album/cover/1135/thumb_62873919-cdf0-4733-9e9d-a96d4bd27357.png",
                        },
                      },
                      album_type: "album",
                    },
                    position: 0,
                  },
                ],
                collaborators: [],
                can_edit_collaborators: false,
                user: {
                  id: 46,
                  slug: "ruckazoid",
                  username: "ruckazoid",
                  display_name: "RUCKAZOID",
                  first_name: null,
                  last_name: null,
                  contact_url: "",
                  user_type: "artist",
                  avatar: {
                    url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/user/avatar/46/2c6737ff-37a1-4f37-b982-c5c082484baa.gif",
                    thumb: {
                      url: "https://d26c3hjihgh1hc.cloudfront.net/uploads/user/avatar/46/thumb_2c6737ff-37a1-4f37-b982-c5c082484baa.gif",
                    },
                  },
                  repost_price: 100,
                  repost_price_end_at: "2020-12-19T08:45:18.139Z",
                  max_repost_price: 5000,
                  status: "active",
                  size_chart: "Check it",
                  shipping_policy:
                    "All orders shipped VIA USPS same day before 2pm.",
                  return_policy: "No returns dog!",
                  privacy_policy: "Everything is between us",
                  followers: 464,
                  followings: 298,
                  enable_alert: true,
                  balance_amount: 0,
                  available_amount: 0,
                  stripe_connected: true,
                  sign_in_count: 2791,
                  stream_rolled_time: 0,
                  stream_rolled_cost: 337,
                  data: {
                    discover_page_visited: 1,
                    video_page_visited: 1,
                    message_page_visited: 1,
                    sell_page_visited: 1,
                    stream_page_visited: 1,
                    label_page_visited: 1,
                  },
                  is_following: false,
                  invited_at: null,
                  request_role: "artist",
                  request_status: "accepted",
                  inviter: null,
                },
              },
            },
          ],
          inviter: null,
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.playlist {
    .breadcrumb {
        font-size: 18px;
        font-weight: bold;
        line-height: 1.5;
    }

    .meta-summary {
        color: #1C1C1C;
        margin: 15px 0;
    }

    .listings {
        .listing {
            &:hover {
                .listing-action {
                    display: flex;
                }
            }
        }
    }
}
</style>