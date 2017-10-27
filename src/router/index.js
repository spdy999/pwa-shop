import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import store from '@/store'
import Landing from '@/views/Landing'
import Login from '@/views/Login'
import Profile from '@/views/Profile'
import Avatar from '@/views/Avatar'
import CameraAvatar from '@/views/CameraAvatar'
import CameraDetect from '@/views/CameraDetect'
import CameraPos from '@/views/CameraPos'
import Hello from '@/views/Hello'
import Cart from '@/views/Cart'
import Pos from '@/views/Pos'
import Gallery from '@/views/Gallery'
import Error404 from '@/views/Error404'
import Menu from '@/views/Menu'
import ShopFace from '@/views/ShopFace'
import ShopFaceId from '@/views/ShopFaceId'
import ShopFaceList from '@/views/ShopFaceList'
import ShopDashboard from '@/views/ShopDashboard'
import Shop from '@/views/Shop'
import Shop1 from '@/views/Shop1'
import Shop2 from '@/views/Shop2'
import Shop3 from '@/views/Shop3'
import Shop4 from '@/views/Shop4'
import Shop5 from '@/views/Shop5'
import CameraOutside from '@/views/CameraOutside'
import CameraInstore from '@/views/CameraInstore'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  // TODO: should we remember scroll position?
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/', component: Landing },
    {
      path: '/login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (store.state.user) {
          next(from)
        } else {
          next()
        }
      }
    },
    {
      path: '/logout',
      beforeEnter: (to, from, next) => {
        if (store.state.user) {
          firebase.auth().signOut()
          next('/')
        } else {
          next('/login')
        }
      }
    },
    {
      path: '/profile',
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: '/avatar',
      component: Avatar,
      meta: { requiresAuth: true }
    },
    {
      path: '/cameraavatar',
      component: CameraAvatar,
      meta: { requiresAuth: true }
    },
    {
      path: '/camerapos',
      component: CameraPos,
      meta: { requiresAuth: true }
    },
    {
      path: '/gallery',
      component: Gallery,
      meta: { requiresAuth: true }
    },
    {
      path: '/cameradetect',
      component: CameraDetect,
      meta: { requiresAuth: true }
    },
    { path: '/hello', component: Hello },
    { path: '/pos', component: Pos },
    { path: '/cart', component: Cart },
    { path: '/menu', component: Menu },
    { path: '/shopface', component: ShopFace },
    { path: '/shopfaceid/:id', component: ShopFaceId },
    { path: '/shopfacelist', component: ShopFaceList },
    { path: '/shopdashboard', component: ShopDashboard },

    { path: '/shop', component: Shop },
    { path: '/shop1', component: Shop1 },
    { path: '/shop2', component: Shop2 },
    { path: '/shop3', component: Shop3 },
    { path: '/shop4', component: Shop4 },
    { path: '/shop5', component: Shop5 },
    { path: '/cameraoutside', component: CameraOutside },
    { path: '/camerainstore', component: CameraInstore },
    { path: '*', component: Error404 }
  ]
})

/**
 * Check if a route requires authentication.
 * This is a global before hook for all routes,
 * checks if there are `meta: { requiresAuth: true }`
 * in all matched routes and sub routes.
 * If yes, redirect to `/login` and add original path to the query.
 */
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.user) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

export default router
