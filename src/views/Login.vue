<template>
  <section class="container-formbox">
    <div class="ribbon">
      <div class="dash-item">
        <h2>Liquify</h2>
      </div>
    </div>
      <div class="formbox">
        <div class="formbox__form">
          <form class="form">
            <h3 class="form-heading">
              Login to the dashboard
            </h3>
            <div class="form__group">
              <input type="email" class="form__input" id="email" v-model="email" placeholder="Email address" required>
              <label class="form__label" for="email">E-mail adress</label>
            </div>
            <div class="form__group">
              <input type="password" class="form__input" id="password" v-model="password" placeholder="Password" required>
              <label class="form__label" for="password">Password</label>
            </div>
            <button @click.prevent="login()" type="submit" class="btn btn--green">Login</button>
          </form>
        </div>
      </div>
  </section>
</template>

<script>
  import firebase from 'firebase'

  export default {
    data() {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      login() {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
            this.$router.go({ path: this.$router.path })
          },
        err => {
          alert(err.message)
        })
      }
    }
  }
</script>