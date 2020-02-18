<template>
  <nav class="nav">
    <input id="nav-toggle" type="checkbox" class="nav__checkbox">
    <label for="nav-toggle" class="nav__btn">
      <span class="nav__icon">&nbsp;</span>
    </label>
    <div class="nav__background">&nbsp;</div>
    <nav class="nav__navbar">
      <ul class="nav__list">
        <router-link v-if="isLoggedIn" tag="li" to="/">
          <a class="nav__link" @click="closeMenu()">Dashboard</a>
        </router-link>
        <router-link v-if="isLoggedIn" tag="li" to="/assets">
          <a class="nav__link" @click="closeMenu()">My assets</a>
        </router-link>
        <router-link tag="li" to="/quotes">
          <a class="nav__link" @click="closeMenu()">Check quotes</a>
        </router-link>
        <router-link v-if="isLoggedIn" tag="li" to="/preferences">
          <a class="nav__link" @click="closeMenu()">Preferences</a>
        </router-link>
        <router-link v-if="!isLoggedIn" tag="li" to="/register">
          <a class="nav__link" @click="closeMenu()">
            Register
          </a>
        </router-link>
        <router-link v-if="!isLoggedIn" tag="li" to="/login">
          <a class="nav__link" @click="closeMenu()">
            Login
          </a>
        </router-link>
        <li v-if="isLoggedIn" class="nav__user">
          {{ currentUser }}
        </li>
        <li v-if="isLoggedIn">
          <a @click="logout" class="nav__link">Logout</a>
        </li>
      </ul>
    </nav>
  </nav>
</template>

<script>
  import firebase from 'firebase'

  export default {
    data() {
      return {
        isLoggedIn: false,
        currentUser: false
      }
    },
    created() {
      if(firebase.auth().currentUser) {
        this.isLoggedIn = true
        this.currentUser = firebase.auth().currentUser.email
      }
    },
    methods: {
      closeMenu() {
        document.getElementById('nav-toggle').checked = false
      },
      logout() {
        firebase.auth().signOut()
          .then(()=> {
            this.$router.go({ path: this.$router.path })
          })
      }
    }
  }
</script>
