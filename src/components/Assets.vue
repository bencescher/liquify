<template>
  <section class="container-fluid">
    <div class="ribbon">
      <div class="dash-item">
        <h2>Total Assets</h2>
        <h3><i class="fas fa-coins"></i> {{ total | currency-format }} {{ currency }}</h3>
        <h4>
          <i v-if="changeStatus === 'loss'" class="fas fa-caret-down"></i>
          <i v-if="changeStatus === 'gain'" class="fas fa-caret-up"></i>
           {{ totalChange }}
        </h4>
      </div>
    </div>
    <div class="row">
      <router-link to="/new">
        <button class="btn btn--green btn--inline">
          Add new
        </button>
      </router-link>
      <button class="btn btn--blue btn--inline" @click="refreshData()">
        Refresh
      </button>
    </div>
    <div class="row">
      <app-asset v-for="(asset, index) in assets" :key="index" :asset="asset"></app-asset>
    </div>
  </section>
</template>

<script>
  import Asset from './Asset.vue'

  export default {
    components: {
      'app-asset': Asset
    },
    computed: {
      assets() {
        return this.$store.getters.assets
      },
      changeStatus() {
        if (this.$store.getters.total > this.$store.getters.totalOriginal) {
          return 'gain'
        } else if (this.$store.getters.total < this.$store.getters.totalOriginal) {
          return 'loss'
        } else {
          return ''
        }
      },
      currency() {
        return this.$store.getters.currency
      },
      total() {
        return this.$store.getters.total
      },
      totalChange() {
        // calculate the ratio of portfolio's current and original value
        const totalCurrent = this.$store.getters.total
        const totalOriginal = this.$store.getters.totalOriginal

        if (this.changeStatus === 'gain') {
          return '+ ' + ((totalCurrent / totalOriginal -1) * 100).toFixed(2) + ' %'
        } else if (this.changeStatus === 'loss') {
          return '- ' + ((1 - (totalCurrent / totalOriginal)) * 100).toFixed(2) + ' %'
        } else {
          return '-'
        }
      }
    },
    methods: {
      refreshData(){
        this.$store.dispatch('initAssets')
      }
    }
  }
</script>