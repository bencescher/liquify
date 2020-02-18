<template>
  <section class="container-formbox">
    <div class="ribbon">
      <div class="dash-item">
        <h2>Total Assets</h2>
        <h3><i class="fas fa-coins"></i> {{ total | currency-format }} {{ currency }}</h3>
      </div>
    </div>
    <div class="formbox">
      <div class="formbox__form">
        <form @submit.prevent="onSubmit()">
          <div class="form__group">
            <h3 class="form-heading">Adding a new asset</h3>
          </div>
          <div class="form__group">
            <select @click="showLabel($event)" class="form__select" id="account" v-model="newAsset.account" required>
              <option value="" disabled selected>Account</option>
              <option>Home Cash</option>
              <option>Piggy Bank</option>
              <option>OTP</option>
              <option>Erste</option>
              <option>CIB</option>
              <option>GranitBank</option>
              <option>State Treasury</option>
              <option>Stock Plan</option>
              <option>Private Broker</option>
              <option>Revolut</option>
              <option>TransferWise</option>
              <option>Coinbase</option>
              <option>ETFmatic</option>
              <option>Other</option>
            </select>
            <label class="form__label form__label--select" id="label-account" for="account">Account</label>
          </div>
          <div class="form__group">
            <select @click="showLabel($event)" class="form__select" id="type" v-model="newAsset.type" required>
              <option value="" disabled selected>Asset type</option>
              <option>Currency</option>
              <option>Cryptocurrency</option>
              <option>Stock</option>
              <option>Bond</option>
              <option>ETF</option>
            </select>
            <label class="form__label form__label--select" id="label-type" for="type">Asset type</label>
          </div>
          <div class="form__group">
            <select @click="showLabel($event)" class="form__select" id="base" v-model="newAsset.base" required>
              <option value="" disabled selected>Base currency</option>
              <option value="HUF">HUF</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="CHF">CHF</option>
              <option value="GBP">GBP</option>
              <option value="BTC">Crypto - BTC</option>
              <option value="LTC">Crypto - LTC</option>
              <option value="XRP">Crypto - XRP</option>
              <option value="aapl">Stock - Apple</option>
              <option value="amzn">Stock - Amazon</option>
              <option value="fb">Stock - Facebook</option>
              <option value="ge">Stock - General Electric</option>
              <option value="nflx">Stock - Netflisk</option>
              <option value="orcl">Stock - Oracle</option>
              <option value="tsla">Stock - Tesla</option>
              <option value="twtr">Stock - Twitter</option>
              <option value="xom">Stock - Exxon Mobil</option>
            </select>
            <label class="form__label form__label--select" id="label-base" for="base">Base currency</label>
          </div>
          <div class="form__group">
            <input type="number" min="0" class="form__input" id="quantity" placeholder="Asset quantity" v-model="newAsset.quantity" required>
            <label class="form__label" for="quantity">Asset quantity</label>
          </div>
          <button type="submit" class="btn btn--green">Add</button>
          <router-link tag="button" to="/assets" class="btn btn--red btn--cancel">Cancel</router-link>
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
        newAsset: {
          account: '',
          type: '',
          base: '',
          quantity: '',
          owner: ''
        }
      }
    },
    created() {
      this.currentUser = firebase.auth().currentUser.email
    },
    computed: {
      currency() {
        return this.$store.getters.currency
      },
      total() {
        return this.$store.getters.total
      }
    },
    methods: {
      onSubmit() {
        // adding newAsset to the database, reload assets, reroute to 'My assets' view
        this.newAsset.owner = this.currentUser
        this.$store.dispatch('createAsset', this.newAsset)
          .then(() => {
            this.$store.dispatch('initAssets')
              .then(() => {
                this.$router.push('/assets')
              })
          }) 
      },
      showLabel(event) {
        // display label for selection field after clicking on it
        const labelId = "label-" + event.currentTarget.id;
    
        document.getElementById(labelId).style.opacity = 1;
      }
    }
  }

</script>