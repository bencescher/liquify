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
      <div class="col2-1">
        <div class="dash-item">
          <h3 class="form-heading">Asset Ratios</h3>
          <div v-if="total" class="mychart">
            <doughnut :chart-data="datacollection"></doughnut>
          </div>
        </div>
      </div>
      <div class="col2-1">
        <div class="dash-item">
          <h3 class="form-heading">Assets by Type</h3>
          <ul v-if="total" class="asset-list">
            <li v-for="(cat, index) in categories" :key="index" :style ="{ backgroundImage: cat.bg }"><p class="left"><strong>{{ cat.name }}</strong> ({{ (cat.amount / total * 100 ).toFixed(2)}}%)</p> <p class="right">{{ cat.amount | currency-format }} {{ currency }}</p><div style="clear: both;"></div></li>
          </ul>
        </div>
      </div>
      <div class="col2-1">
        <div class="dash-item">
          <h3 class="form-heading">Portfolio health</h3>
          <ul v-if="total" class="asset-list">
            <li class="health-danger" id="warnRiskHigh" v-if="warnRiskHigh">
              <p>High ratio of risky assets</p>
            </li>
            <li class="health-danger" id="warnRiskLow" v-if="warnRiskLow">
              <p>High ratio of riskfree assets</p>  
            </li>
            <li class="health-danger" id="warnLiquidityHigh" v-if="warnLiquidityHigh">
              <p>High ratio of liquid assets</p>
            </li>
            <li class="health-danger" id="warnLiquidityLow" v-if="warnLiquidityLow">
              <p>High ratio of illiquid assets</p>
            </li>
            <li class="health-danger" id="warnCurrency" v-if="warnCurrency">
              <p>High ratio of same currency</p>
            </li>
            <li class="health-ok" id="okRisk" v-if="!warnRiskHigh && !warnRiskLow">
              <p>Risks are well balanced</p>
            </li>
            <li class="health-ok" id="okLiquidity" v-if="!warnLiquidityHigh && !warnLiquidityLow">
              <p>Liquidity is well balanced</p>
            </li>
            <li class="health-ok" id="okPortfolio" v-if="!warnRiskHigh && !warnRiskLow && !warnCurrency && !warnLiquidityHigh && !warnLiquidityLow">
              <p>Portfolio is well diversified</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Doughnut from '../components/Doughnut.js'

  export default {
    data() {
      return {
        datacollection: null,
        categories: null,
        warnRiskHigh: false,
        warnRiskLow: false,
        warnLiquidityHigh: false,
        warnLiquidityLow: false,
        warnCurrency: false
      }
    },
    components: {
      Doughnut
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
      totalChange() {
        // calculate the ratio of portfolio's current and original value
        const totalCurrent = this.$store.getters.total
        const totalOriginal = this.$store.getters.totalOriginal
        
        if (totalCurrent > totalOriginal) {
          return '+ ' + ((totalCurrent / totalOriginal -1) * 100).toFixed(2) + ' %'
        } else if (totalCurrent < totalOriginal) {
          return '- ' + ((1 - (totalCurrent / totalOriginal)) * 100).toFixed(2) + ' %'
        } else {
          return '-'
        }
      }
    },
    created() {
      this.fillDasboard()
    },
    watch: {
      total() {
        this.fillDasboard()
      }
    },
    methods: {
      fillDasboard() {

        let cryptoAmount = 0,
            currencyAmount = 0,
            etfAmount = 0,
            stockAmount = 0,
            bondAmount = 0,
            hufAmount = 0,
            eurAmount = 0,
            usdAmount = 0,
            chfAmount = 0,
            gbpAmount = 0

        // get the assets from 'assets' and cumulate the prices grouped by types
        this.assets.forEach(asset => {
          const assetPrice = asset.price
          const assetType = asset.type
          const assetBase = asset.base

          // cumulate assets based by their types
          switch (assetType) {
            case 'Cryptocurrency':
              cryptoAmount += assetPrice
              break;
            case 'Currency':
              currencyAmount += assetPrice
              break;
            case 'ETF':
              etfAmount += assetPrice
              break;
            case 'Stock':
              stockAmount += assetPrice
              break;
            case 'Bond':
              bondAmount += assetPrice
              break;
            default:
              break;
          }

          // cumulate the assets by their base currency
          switch (assetBase) {
            case 'HUF':
              hufAmount += assetPrice
              break;
            case 'EUR':
              eurAmount += assetPrice
              break;
              case 'USD':
              usdAmount += assetPrice
              break;
              case 'CHF':
              chfAmount += assetPrice
              break;
              case 'GBP':
              gbpAmount += assetPrice
              break;
            default:
              break;
          }
        })
        
        // display settings for the 'Assets by type' section
        this.categories = [
          { name: 'Currency', amount: currencyAmount, bg: 'linear-gradient(105deg, rgba(47, 133, 90, .55) 0%,rgba(47, 133, 90, .45) 60%, rgba(47, 133, 90, .85) 30%, rgba(47, 133, 90, .75) 100%)'},
          { name: 'ETF', amount: etfAmount, bg: 'linear-gradient(105deg, rgba(40, 60, 134, .55) 0%,rgba(40, 60, 134, .45) 60%, rgba(40, 60, 134, .85) 30%, rgba(40, 60, 134, .75) 100%)'},
          { name: 'Stock', amount: stockAmount, bg: 'linear-gradient(105deg, rgba(183, 121, 31, .55) 0%,rgba(183, 121, 31, .45) 60%, rgba(183, 121, 31, .85) 30%, rgba(183, 121, 31, .75) 100%)'},
          { name: 'Bond', amount: bondAmount, bg: 'linear-gradient(105deg, rgba(241, 39, 17, .55) 0%,rgba(241, 39, 17, .45) 60%, rgba(241, 39, 17, .85) 30%, rgba(241, 39, 17, .75) 100%)'},
          { name: 'Crypto', amount: cryptoAmount, bg: 'linear-gradient(105deg, rgba(2, 170, 176, .55) 0%,rgba(2, 170, 176, .45) 60%, rgba(2, 170, 176, .85) 30%, rgba(2, 170, 176, .75) 100%)'}
        ]
        // display settings for the 'Asset ratios' section
        this.datacollection = {
          datasets: [{
            data: [currencyAmount.toFixed(2), cryptoAmount.toFixed(2), etfAmount.toFixed(2), stockAmount.toFixed(2), bondAmount.toFixed(2)],
            backgroundColor: ['rgba(104, 211, 145, .75)', 'rgba(0, 205, 172, .75)', 'rgba(76, 162, 205, .85)', 'rgba(245, 223, 95, .75)', 'rgba(245, 175, 25, .75)']
          }],
          labels: [
              'Currency',
              'Cryptocurrency',
              'ETF',
              'Stock',
              'Bond'
          ]
        }
        // display settings for portfolio health
        this.calculateHealth(currencyAmount, cryptoAmount, etfAmount, stockAmount, bondAmount, hufAmount, eurAmount, usdAmount, chfAmount, gbpAmount)

      },
      calculateHealth(currencyTotal, cryptoTotal, etfTotal, stockTotal, bondTotal, hufTotal, eurTotal, usdTotal, chfTotal, gbpTotal) {
        // LIQUIDITY RULES
        // check for too high liquidity
        if ((currencyTotal + cryptoTotal) / this.total > 0.4) {
          this.warnLiquidityHigh = true
        } else {
          this.warnLiquidityHigh = false
        }
        // check for too low liquidity
        if ((currencyTotal + cryptoTotal) / this.total < 0.1) {
          this.warnLiquidityLow = true
        } else {
          this.warnLiquidityLow = false
        }
        // RISK TOLERANCE RULES
        // check for too high portion of low-risk assets
        if ((currencyTotal / this.total > 0.3 && bondTotal / this.total > 0.3) || bondTotal / this.total > 0.5 || currencyTotal / this.total > 0.5 || etfTotal / this.total > 0.5) {
          this.warnRiskLow = true
        } else {
          this.warnRiskLow = false
        }
        // check for too high portion of high-risk assets
        if ((cryptoTotal / this.total >= 0.05) || (stockTotal / this.total >= 0.6)) {
          this.warnRiskHigh = true
        } else {
          this.warnRiskHigh = false
        }
        // CURRENCY RULES
        // check for too high portion of a currency
        if ((hufTotal / this.total >= 0.35) || (eurTotal / this.total >= 0.35) || (usdTotal / this.total >= 0.35) || (chfTotal / this.total >= 0.35) || (gbpTotal / this.total >= 0.35)) {
          this.warnCurrency = true
        } else {
          this.warnCurrency = false
        }
      }
    }
  }
</script>