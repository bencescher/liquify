import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'
import './assets/sass/main.scss'
import './assets/css/all.css'

Vue.config.productionTip = false

// vue filter for currency format
Vue.filter('currency-format', (value)=> {
  return value.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
})

// nav guards
router.beforeEach((to, from, next)=> {
  // check for requiresAuth guards
  if(to.matched.some(record=> record.meta.requiresAuth)) {
    // check if no user is logged in
    if(!firebase.auth().currentUser) {
      // go to Login
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
    else {
      next()
    }
  }
  else if (to.matched.some(record=> record.meta.requiresGuest)) {
    // check if a user is logged in
    if(firebase.auth().currentUser) {
      // go to root
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
    }
    else {
      next()
    }
  }
  else {
    next()
  }
})

firebase.auth().onAuthStateChanged(() => {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
})