import Vue from 'vue'
import Router from 'vue-router'
import vueMethodsPromise from 'vue-methods-promise'

import ProtectPage from '@/views/auth/protect_page'
import Login from '@/views/auth/login'
import ForgotPassword from '@/views/auth/forgot_password'
import ResetPassword from '@/views/auth/reset_password'
import RegisterAs from '@/views/auth/register_as'
import Confirmation from '@/views/auth/confirmation'
import SocialVerification from '@/views/auth/social_verify'
import ListenerRegister from '@/views/auth/register_by_listener'
import ArtistRegister from '@/views/auth/register_by_artist'
import LabelRegister from '@/views/auth/register_by_label'
import BrandRegister from '@/views/auth/register_by_brand'
import TwitterCallbackPage from '@/views/auth/twitter_callback'
import TermsPage from '@/views/auth/terms_of_service'
import AdminPage from '@/views/admin/admin'
import LandingPage from '@/views/admin/landing'
import EmptyPage from '@/views/admin/empty'
import Discover from '@/views/discover/discover'
import SearchPage from '@/views/search/search'
import Stream from '@/views/stream/stream'
import Notifications from '@/views/notifications/notifications'
import Chat from '@/views/chat/chat'
import Messages from '@/views/messages/messages'
import Cart from '@/views/cart/cart'
import Checkout from '@/views/cart/checkout'
import Sell from '@/views/sell/sell'
import OrderDetail from '@/views/sell/orderdetail'
import AddProduct from '@/views/sell/add_product'
import EditProduct from '@/views/sell/edit_product'
import AlbumDetail from '@/views/album/album'
import PlaylistDetail from '@/views/album/playlist'
import AlbumStats from '@/views/album/album_stats'
import AlbumsManage from '@/views/album/manage'
import LabelsManage from '@/views/label/manage'
import UploadAlbum from '@/views/album/upload_album'
import AlbumEdit from '@/views/album/album_edit'
import PaymentIndex from '@/views/payments/index'
import StripeConnectPage from '@/views/user/stripe_connect'
import UserProfile from '@/views/user/profile'
import UserGetVerified from '@/views/user/get_verified'
import UserSettings from '@/views/settings/index'
import VideoIndex from '@/views/video/index'
// import VideoShow from '@/views/video/show'
import VideoCreate from '@/views/video/create'
import VideoDelete from '@/views/video/delete'

Vue.use(vueMethodsPromise)
Vue.use(Router)

export function createRouter (settings) {
  let routes = [
    { path: '/protect', name: 'ProtectPage', component: ProtectPage },
    { path: '/login', name: 'Login', component: Login },
    { path: '/forgot', name: 'ForgotPassword', component: ForgotPassword },
    { path: '/reset_password/:token', name: 'ResetPassword', component: ResetPassword },
    { path: '/terms', name: 'TermsPage', component: TermsPage },
    { path: '/_oauth/verification', name: 'SocialVerification', component: SocialVerification },
    { path: '/_oauth/stripe_connect_callback', name: 'StripeConnectPage', component: StripeConnectPage },
    { path: '/_oauth/twitter_callback', name: 'TwitterCallbackPage', component: TwitterCallbackPage },
    { path: '/confirm/:token', name: 'Confirmation', component: Confirmation }
  ]

  if (!settings.disable_sign_up) {
    routes = routes.concat([
      { path: '/register', name: 'RegisterAs', component: RegisterAs },
      { path: '/register/listener', name: 'ListenerRegister', component: ListenerRegister },
      { path: '/register/artist', name: 'ArtistRegister', component: ArtistRegister },
      { path: '/register/label', name: 'LabelRegister', component: LabelRegister },
      { path: '/register/brand', name: 'BrandRegister', component: BrandRegister }
    ])
  } else {
    routes = routes.concat([
      { path: '/register', name: 'RegisterAs', redirect: '/login' },
      { path: '/register/listener', name: 'ListenerRegister', redirect: '/login' },
      { path: '/register/artist', name: 'ArtistRegister', redirect: '/login' },
      { path: '/register/label', name: 'LabelRegister', redirect: '/login' },
      { path: '/register/brand', name: 'BrandRegister', redirect: '/login' }
    ])
  }

  routes = routes.concat([
    { path: '/home', name: 'LandingPage', component: LandingPage },
    { path: '/empty', name: 'EmptyPage', component: EmptyPage },
    { path: '/admin', name: 'AdminPage', component: AdminPage },
    { path: '/discover', name: 'Discover', component: Discover },
    { path: '/search', name: 'Search', component: SearchPage, props: (route) => ({query: route.query.q}) },
    { path: '/stream', name: 'Stream', component: Stream },
    { path: '/notifications', name: 'Notifications', component: Notifications },
    { path: '/messages', name: 'Messages', component: Messages },
    { path: '/cart', name: 'Cart', component: Cart },
    { path: '/cart/checkout', name: 'Checkout', component: Checkout },
    { path: '/sell', name: 'Sell', component: Sell },
    { path: '/sell/order/:slug', name: 'OrderDetail', component: OrderDetail },
    { path: '/product/add', name: 'AddProduct', component: AddProduct },
    { path: '/product/edit/:id', name: 'EditProduct', component: EditProduct },
    { path: '/album/:slug', name: 'AlbumDetail', component: AlbumDetail },
    { path: '/playlist/:slug', name: 'PlaylistDetail', component: PlaylistDetail },
    { path: '/album/:slug/stats', name: 'AlbumStats', component: AlbumStats },
    { path: '/albums', name: 'AlbumsManage', component: AlbumsManage },
    { path: '/labels', name: 'LabelsManage', component: LabelsManage },
    { path: '/upload/album', name: 'UploadAlbum', component: UploadAlbum },
    { path: '/album/:slug/edit', name: 'AlbumEdit', component: AlbumEdit },
    { path: '/verified', name: 'UserGetVerified', component: UserGetVerified },
    { path: '/payments', name: 'PaymentIndex', component: PaymentIndex },
    { path: '/settings', name: 'UserSettings', component: UserSettings },
    { path: '/:slug', name: 'UserProfile', component: UserProfile },
    { path: '/user/:user/chat', name: 'Chat', component: Chat }
  ])

  if (!settings.disable_live_video) {
    routes = routes.concat([
      { path: '/user/:user/video', name: 'VideoIndex', component: VideoIndex },
      { path: '/user/:user/video/create', name: 'VideoCreate', component: VideoCreate },
      { path: '/user/:user/video/delete', name: 'VideoDelete', component: VideoDelete }
    ])
  } else {
    routes = routes.concat([
      { path: '/user/:user/video', name: 'VideoIndex', redirect: '/' },
      { path: '/user/:user/video/create', name: 'VideoCreate', redirect: '/' },
      { path: '/user/:user/video/delete', name: 'VideoDelete', redirect: '/' }
    ])
  }

  routes = routes.concat([
    { path: '*', redirect: '/login' }
  ])

  return new Router({
    mode: 'history',
    routes: routes
  })
}
