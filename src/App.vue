<template>
  <div id="app">
    <app-menu></app-menu>
    <transition name="slide" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import firebase from 'firebase'
import Menu from './components/Menu'

export default {
  components: {
    'app-menu': Menu
  },
  created() {
    if(firebase.auth().currentUser) {
      // load currency settings and assets
      this.$store.dispatch('initCurrency')
      this.$store.dispatch('initAssets')
    }
  }
}
</script>
