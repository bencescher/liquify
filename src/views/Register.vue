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
          <h3 class="form-heading form-heading-reg">
            Register an account
          </h3>
          <div class="form__group">
            <input type="email" class="form__input" id="email" placeholder="Email address" v-model="email" required>
            <label class="form__label" for="email">Email address</label>
          </div>
          <div class="form__group">
            <input type="password" class="form__input" id="password" placeholder="Password" v-model="password" required>
            <label class="form__label" for="password">Password</label>
          </div>
          <button @click.prevent="register()" type="submit" class="btn btn--green"><i class="fas fa-user-plus"></i> Register</button>
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
      register() {
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then(user => {
            alert('Account created for ' + user.user.email + '. You will now be redirected to your dashboard.')
            this.$router.go({ path: this.$router.path })
          })
          .catch(() => alert('Could not create user for ' + this.email + '. Please try to use another e-mail address and/or password!'))
      }
    }
  }
</script>