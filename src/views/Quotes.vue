<template>
  <section class="container-fluid quotes">
    <div class="ribbon">
      <div class="dash-item">
        <h2>Quotes</h2>
        <h3>Base currency &rarr; {{ currency }}</h3>
      </div>
    </div>
    <div class="row">
      <div class="col3-2">
        <h3 class="form-heading">Latest price of assets</h3>
        <select v-model="quoteSymbol" name="quote" id="quote" class="quote-select" required>
          <option value="" disabled selected>Select an asset</option>
          <option value="amzn">Amazon</option>
          <option value="aapl">Apple</option>
          <option value="xom">Exxon Mobil</option>
          <option value="fb">Facebook</option>
          <option value="ge">General Electric</option>
          <option value="nflx">Netflix</option>
          <option value="orcl">Oracle</option>
          <option value="tsla">Tesla</option>
          <option value="twtr">Twitter</option>
        </select>
        <button class="btn btn--green" @click="getQuote(quoteSymbol)">Get quote</button>
        <div class="quotes__box">
          <p v-if="quote">{{ quote | currency-format }} {{ currency }}</p>
        </div> 
        <div class="reference">
          <a href="https://iexcloud.io">Data provided by IEX Cloud</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import axios from 'axios'
  import firebase from 'firebase'
  import db from '../firebase/init.js'

  export default {
    data() {
      return {
        quote: 0,
        quoteSymbol: ''
      }
    },
    computed: {
      currency() {
        // load currency setting of user if logged in, default currency is 'HUF'
        if (firebase.auth().currentUser) {
          return this.$store.getters.currency
        } else {
          return 'HUF'
        }
      }
    },
    methods: {
      getQuote(symbol) {
        const stocks = ['aapl', 'amzn', 'fb', 'ge', 'nflx', 'orcl', 'tsla', 'twtr', 'xom']
        let queryString = ''

        this.quote = 0
        // querying stock quotes
        if (stocks.includes(symbol)) {
          queryString = 'https://sandbox.iexapis.com/stable/stock/' + symbol + '/quote/latestPrice?token=' + process.env.VUE_APP_IEX_TOKEN
        }

        if (symbol && queryString) {
          axios.get(queryString)
          .then(stockRate => {
            if (stockRate.status === 200) {
              // always update the rate also in database
              db.collection('rates').doc(symbol).update({
                rate: stockRate.data,
                timestamp: new Date().getTime()
              })
              // stock rate is given in 'USD', must be converted to display currency
              if (this.currency !== 'USD') {
                db.collection('rates').doc('USD' + this.currency).get()
                  .then(usdRate => {  
                    this.quote = stockRate.data * usdRate.data().rate   
                    })
              } else {
                this.quote = stockRate.data
              }
            }
          })
        }
      }
    }
  }
</script>
