<template>
  <div class="container-fluid">
    <div class="ribbon">
      <div class="dash-item">
        <h2>Preferences</h2>
        <h3>Active &rarr; {{ currency }}</h3>
      </div>
    </div>
    <div class="row">
      <div class="dash-item">
        <h3 class="currency-heading">Change base currency</h3>
        <ul class="currency-list">
          <li>
            <button @click="changeCurrency('HUF')" class="btn btn--blue">
              HUF
            </button>
          </li>
          <li>
            <button @click="changeCurrency('EUR')" class="btn btn--blue">
              EUR
            </button>
          </li>
          <li>
            <button @click="changeCurrency('USD')" class="btn btn--blue">
              USD
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      currency() {
        return this.$store.getters.currency
      }
    },
    watch: {
      currency: function() {
        this.$store.dispatch('initAssets')
      }
    },
    methods: {
       changeCurrency(newValue) {
         this.$store.dispatch('updateCurrency',newValue)
       }
    }
  }

</script>