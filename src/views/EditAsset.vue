<template>
  <div class="container-formbox">
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
            <h3 class="form-heading">Editing &rarr; {{ editedAsset.type }}</h3>
          </div>
          <div class="form__group">
            <select class="form__select" id="account" v-model="editedAsset.account">
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
            <label class="form__label form__label--select" for="account">Account</label>
          </div>
          <div class="form__group">
            <select class="form__select" id="type" v-model="editedAsset.type">
              <option>Currency</option>
              <option>Cryptocurrency</option>
              <option>Stock</option>
              <option>Bond</option>
              <option>ETF</option>
            </select>
            <label class="form__label form__label--select" for="type">Asset type</label>
          </div>
          <div class="form__group">
            <input type="text" class="form__input" id="quantity" placeholder="Enter quantity" v-model="editedAsset.quantity">
            <label class="form__label" for="quantity">Asset quantity</label>
          </div>
          <button type="submit" class="btn btn--green">Update</button>
          <router-link tag="button" to="/assets" class="btn btn--red btn--cancel">Cancel</router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        editedAsset: {
          id: '',
          account: '',
          base: '',
          type: '',
          quantity: 0
        }
      }
    },
    created() {
      // get the asset to be edited from the store using param 'assetId'
      this.assets.forEach(asset => {
          if (asset.id === this.$route.params.assetId) {
            this.editedAsset.id = asset.id
            this.editedAsset.account = asset.account
            this.editedAsset.base = asset.base
            this.editedAsset.type = asset.type
            this.editedAsset.quantity = asset.quantity
          }
        })
    },
    computed: {
      currency() {
        return this.$store.getters.currency
      },
      total() {
        return this.$store.getters.total
      },
      assets() {
        return this.$store.getters.assets
      }
    },
    methods: {
      onSubmit() {
        this.editedAsset.updatedate = new Date().getTime()
        // update the database and store with the new attributes of the asset
        this.$store.dispatch('updateAssets', this.editedAsset)
          .then(() => {
            // reload the assets after the update
            this.$store.dispatch('initAssets')
            // redirect the user to 'My assets' view after reload
            this.$router.push('/assets') 
          })
      }
    }
  }

</script>