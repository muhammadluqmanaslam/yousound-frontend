import Vue from 'vue'
import Router from 'vue-router'
import vueMethodsPromise from 'vue-methods-promise'

import ProtectPage from '@/views/auth/protect_page'
import Login from '@/views/auth/login'
import Auth from '@/views/auth/authTab'
import ForgotPassword from '@/views/auth/forgot_password'
import ResetPassword from '@/views/auth/reset_password'
import Confirmation from '@/views/auth/confirmation'
import SocialVerification from '@/views/auth/social_verify'
// import InvitedRegister from '@/views/auth/register_by_invited'
// import AttendeeRegister from '@/views/auth/register_by_attendee'
// import ListenerRegister from '@/views/auth/register_by_listener'
// import RegisterAs from '@/views/auth/register_as'
// import ArtistRegister from '@/views/auth/register_by_artist'
// import LabelRegister from '@/views/auth/register_by_label'
// import BrandRegister from '@/views/auth/register_by_brand'
import TwitterConfirmPage from '@/views/auth/twitter_confirm'
import TwitterCallbackPage from '@/views/auth/twitter_callback'
import TermsPage from '@/views/terms/index'
import OverviewPage from '@/views/overview/index'
import AdminPage from '@/views/admin/admin'
// import MainLandingPage from '@/views/home/main_landing'
// import Landing1Page from '@/views/home/landing'
import Home from '@/views/landingPages/landing1'
import Creators from '@/views/landingPages/landing2'
import AdFree from '@/views/landingPages/landing3'
// import ArtistLandingPage from '@/views/home/artist_landing'
import AddAttendee from '@/views/home/add_attendee'
import CreateAttendee from '@/views/home/create_attendee'
// import Discover from '@/views/discover/index'
import DiscoverIndex from '@/views/discover/'
import SearchPage from '@/views/search/search'
import Feed from '@/views/feed/index'
import ActivityIndex from '@/views/activity/index'
import NotificationIndex from '@/views/notification/index'
import Chat from '@/views/chat/chat'
import Messages from '@/views/messages/index'
import DirectMessages from '@/views/user/direct_messages'
import Cart from '@/views/cart/cart'
import Checkout from '@/views/cart/checkout'
import Sell from '@/views/sell/sell'
import OrderDetail from '@/views/sell/orderdetail'
import AddProduct from '@/views/sell/add_product'
import EditProduct from '@/views/sell/edit_product'
import SingleProduct from '@/views/sell/single_product'
import ProductIndex from '@/views/product/index'
import AlbumIndex from '@/views/album/index'
import AlbumDetail from '@/views/album/album'
import PlaylistDetail from '@/views/album/playlist'
import ManageIndex from '@/views/manage'
import AlbumStats from '@/views/album/album_stats'
import AlbumsManage from '@/views/album/manage'
import LabelsManage from '@/views/label/manage'
import CreateLive from '@/views/video/live'
import UploadIndex from '@/views/upload'
import UploadAlbum from '@/views/album/upload_album'
import AlbumEdit from '@/views/album/album_edit'
import PaymentIndex from '@/views/payments/index'
import StripeConnectPage from '@/views/user/stripe_connect'
import UserProfile from '@/views/user/profile'
import UserGetVerified from '@/views/user/get_verified'
import UserSettings from '@/views/settings/index'
import VideoIndex from '@/views/video/index'
import VideoManage from '@/views/video/manage'
import VideoInfo from '@/views/video/estimate'
import VideoCreate from '@/views/video/create'
import VideoUpload from '@/views/video/upload'
import VideoEdit from '@/views/video/edit'
import VideoShow from '@/views/video/show'
import VideoDelete from '@/views/video/delete'
import Partners from '@/views/partners/'
import Dashboard from '@/views/dashboard/'

Vue.use(vueMethodsPromise)
Vue.use(Router)

export function createRouter(settings) {
  let routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/creators', name: 'Creators', component: Creators },
    { path: '/adfree', name: 'AdFree', component: AdFree },
    // { path: '/', name: 'MainLandingPage', component: MainLandingPage },
    // { path: '/', name: 'LandingFirstStep', component: LandingFirstStep },
    { path: '/protect', name: 'ProtectPage', component: ProtectPage },
    { path: '/login', name: 'Login', component: Login },
    { path: '/forgot', name: 'ForgotPassword', component: ForgotPassword },
    {
      path: '/reset_password/:token',
      name: 'ResetPassword',
      component: ResetPassword,
    },
    { path: '/terms', name: 'TermsPage', component: TermsPage },
    { path: '/squad', name: 'OverviewPage', component: OverviewPage },
    {
      path: '/_oauth/verification',
      name: 'SocialVerification',
      component: SocialVerification,
    },
    {
      path: '/_oauth/stripe_connect_callback',
      name: 'StripeConnectPage',
      component: StripeConnectPage,
    },
    {
      path: '/_oauth/twitter_confirm',
      name: 'TwitterConfirmPage',
      component: TwitterConfirmPage,
    },
    {
      path: '/_oauth/twitter_callback',
      name: 'TwitterCallbackPage',
      component: TwitterCallbackPage,
    },
    { path: '/confirm/:token', name: 'Confirmation', component: Confirmation },
  ]

  if (!settings.disable_sign_up) {
    routes = routes.concat([
      {
        path: '/register',
        name: 'Register',
        component: Auth,
      },
      {
        path: '/register/invited/:token',
        name: 'InvitedRegister',
        component: Auth,
      },
      // {
      //   path: '/register/attendee/:token',
      //   name: 'AttendeeRegister',
      //   component: AttendeeRegister,
      // },
      // { path: '/register', name: 'RegisterAs', component: RegisterAs },
      // { path: '/register/artist', name: 'ArtistRegister', component: ArtistRegister },
      // { path: '/register/label', name: 'LabelRegister', component: LabelRegister },
      // { path: '/register/brand', name: 'BrandRegister', component: BrandRegister }
    ])
  } else {
    routes = routes.concat([
      { path: '/register', name: 'RegisterAs', redirect: '/login' },
      {
        path: '/register/listener',
        name: 'ListenerRegister',
        redirect: '/login',
      },
      { path: '/register/artist', name: 'ArtistRegister', redirect: '/login' },
      { path: '/register/label', name: 'LabelRegister', redirect: '/login' },
      { path: '/register/brand', name: 'BrandRegister', redirect: '/login' },
    ])
  }

  routes = routes.concat([
    // { path: '/home1', name: 'LandingPage', component: Landing1Page },
    // { path: '/home', name: 'LandingPage', component: LandingPage },
    { path: '/admin', name: 'AdminPage', component: AdminPage },
    { path: '/video', name: 'VideoIndex', component: VideoIndex },
    // { path: '/discover', name: 'Discover', component: Discover },
    { path: '/discover', name: 'DiscoverIndex', component: DiscoverIndex },
    { path: '/music/discover', name: 'AlbumIndex', component: AlbumIndex },
    { path: '/product', name: 'ProductIndex', component: ProductIndex },
    {
      path: '/search',
      name: 'Search',
      component: SearchPage,
      props: (route) => ({ query: route.query.q }),
    },
    { path: '/feed', name: 'Feed', component: Feed },
    { path: '/activity', name: 'ActivityIndex', component: ActivityIndex },
    { path: '/notifications', name: 'NotificationIndex', component: NotificationIndex },
    { path: '/messages', name: 'Messages', component: Messages },
    { path: '/cart', name: 'Cart', component: Cart },
    { path: '/cart/checkout', name: 'Checkout', component: Checkout },
    { path: '/sell#orders', name: 'Sell', component: Sell },
    { path: '/sell/order/:slug', name: 'OrderDetail', component: OrderDetail },
    { path: '/upload/product/add', name: 'AddProduct', component: AddProduct },
    { path: '/product/edit/:id', name: 'EditProduct', component: EditProduct },
    { path: '/product/:id', name: 'SingleProduct', component: SingleProduct },
    { path: '/album/:slug', name: 'AlbumDetail', component: AlbumDetail },
    { path: '/x', name: 'AddAttendee', component: AddAttendee },
    { path: '/playlist', name: 'Playlist', component: CreateAttendee },
    {
      path: '/playlist/:slug',
      name: 'PlaylistDetail',
      component: PlaylistDetail,
    },
    { path: '/manage', name: 'ManageIndex', component: ManageIndex },
    { path: '/album/:slug/stats', name: 'AlbumStats', component: AlbumStats },
    { path: '/albums', name: 'AlbumsManage', component: AlbumsManage },
    { path: '/labels', name: 'LabelsManage', component: LabelsManage },
    { path: '/live/', name: 'CreateLive', component: CreateLive },
    { path: '/upload/', name: 'UploadIndex', component: UploadIndex },
    { path: '/upload/album', name: 'UploadAlbum', component: UploadAlbum },
    { path: '/album/:slug/edit', name: 'AlbumEdit', component: AlbumEdit },
    { path: '/verified', name: 'UserGetVerified', component: UserGetVerified },
    { path: '/payments', name: 'PaymentIndex', component: PaymentIndex },
    { path: '/settings', name: 'UserSettings', component: UserSettings },
    { path: '/partners', name: 'Partners', component: Partners },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/:slug', name: 'UserProfile', component: UserProfile },
    { path: '/user/:user/chat', name: 'Chat', component: Chat },
    {
      path: '/user/:user/messages',
      name: 'DirectMessages',
      component: DirectMessages,
    },
  ])

  if (!settings.disable_live_video) {
    routes = routes.concat([
      {
        path: '/user/:user/video',
        name: 'VideoManage',
        component: VideoManage,
      },
      {
        path: '/user/:user/video/info',
        name: 'VideoInfo',
        component: VideoInfo,
      },
      {
        // path: '/user/:user/video/create',
        path: '/upload/create',
        name: 'VideoCreate',
        component: VideoCreate,
      },
      {
        // path: '/user/:user/video/upload',
        path: '/upload/video',
        name: 'VideoUpload',
        component: VideoUpload,
      },
      {
        path: '/user/:user/video/edit',
        name: 'VideoEdit',
        component: VideoEdit,
      },
      {
        path: '/user/:user/video/delete',
        name: 'VideoDelete',
        component: VideoDelete,
      },
      {
        path: '/video/:videoId/show',
        name: 'VideoShow',
        component: VideoShow,
      },
    ])
  } else {
    routes = routes.concat([
      { path: '/user/:user/video', name: 'VideoManage', redirect: '/' },
      { path: '/user/:user/video/create', name: 'VideoCreate', redirect: '/' },
      { path: '/user/:user/video/delete', name: 'VideoDelete', redirect: '/' },
    ])
  }

  routes = routes.concat([{ path: '*', redirect: '/' }])

  return new Router({
    mode: 'history',
    routes: routes,
  })
}
