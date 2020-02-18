import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'
import './assets/sass/main.scss'
import './assets/css/all.css'

Vue.config.productionTip = false

Vue.filter('currency-format', (value)=> {
  return value.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
})

//Setting up nav guards
router.beforeEach((to, from, next)=> {
  //Check for requiredAuth guards
  if(to.matched.some(record=> record.meta.requiresAuth)) {
    //Check if NOT logged in
    if(!firebase.auth().currentUser) {
      //Go to Login
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
    //Check if logged in
    if(firebase.auth().currentUser) {
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

let app

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})