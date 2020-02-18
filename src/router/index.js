import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/dashboard'
  },
  {
    path: '/register',
    name: 'register',
    meta: { requiresGuest: true },
    component: () => import('../views/Register.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: { requiresGuest: true },
    component: () => import('../views/Login.vue')
  },
  {
    path: '/quotes',
    name: 'quotes',
    component: () => import('../views/Quotes.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { requiresAuth: true },
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/assets',
    name: 'assets',
    meta: { requiresAuth: true },
    component: () => import('../components/Assets.vue')
  },
  {
    path: '/new',
    name: 'newAsset',
    meta: { requiresAuth: true },
    component: () => import('../views/NewAsset.vue')
  },
  {
    path: '/edit/:assetId',
    name: 'editAsset',
    meta: { requiresAuth: true },
    component: () => import('../views/EditAsset.vue')
  },
  {
    path: '/preferences',
    name: 'preferences',
    meta: { requiresAuth: true },
    component: () => import('../views/Preferences.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
