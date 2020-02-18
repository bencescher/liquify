<template>
  <div v-if="!markedForDeletion"  class="col4-1">
    <div :id="asset.id.substring(1, 8)" class="card" @click="flipCard()">
      <div class="card__side card__side--front">
        <div class="card__image" :style ="{ backgroundImage: cardImage }">&nbsp;</div>
        <h3 class="card__heading">
          <span class="card__heading--span" :style ="{ backgroundImage: cardColor }">
            {{ typeHeading }}
          </span>
        </h3>
        <div class="card__details">
          <h3>
            Value <br> 
            <span class="card__value">
              {{ asset.price | currency-format }} {{ currency }}
            </span>
          </h3>
          <p class="card__change" :class="changeClass">
            <i v-if="asset.lastprice < asset.originalprice" class="fas fa-caret-down"></i>
            <i v-if="asset.lastprice > asset.originalprice" class="fas fa-caret-up"></i>
             {{ changeToDate }}%
          </p>
        </div>
      </div>
      <div class="card__side card__side--back" :style ="{ backgroundImage: cardColor }">
        <h3>{{ asset.account }}</h3>
        <p>Quantity: {{ asset.quantity }}</p>
        <p>Base currency: {{ asset.base }}</p>
        <router-link class="btn btn--white" tag="button" :to="{ name: 'editAsset', params: {assetId: asset.id} }"><i class="fas fa-edit"></i> Edit</router-link>
        <button @click="deleteAsset()" class="btn btn--white"><i class="fas fa-trash-alt"></i> Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
  import db from '../firebase/init.js'

  export default {
    props: ['asset'],
    data() {
      return {
        markedForDeletion: false,
      }
    },
    methods: {
      deleteAsset() {
        db.collection('assets').doc(this.asset.id).delete()
          .then(() => {
            this.markedForDeletion = true
            this.$store.dispatch('initAssets')
          })
      },
      flipCard() {
        // enable flipping card by touch on mobile devices
        let assetCard = document.getElementById(this.asset.id.substring(1, 8))
        let assetCardFront = assetCard.getElementsByClassName('card__side--front')[0]
        let assetCardBack = assetCard.getElementsByClassName('card__side--back')[0]

        if (assetCardFront.style.transform == 'rotateY(-180deg)') {
          assetCardFront.style.transform = 'rotateY(0)'
          assetCardBack.style.transform = 'rotateY(180deg)'
        } else {
          assetCardFront.style.transform = 'rotateY(-180deg)'
          assetCardBack.style.transform = 'rotateY(0)'
        }
      }
    },
    computed: {
      currency() {
        return this.$store.getters.currency
      },
      typeHeading() {
        if (this.asset.type === 'Cryptocurrency') {
          return 'Crypto'
        } else {
          return this.asset.type
        }
      },
      changeToDate() {
        // calculate ratio of latest and original price for each asset
        if (this.asset.lastprice > this.asset.originalprice) {
          return ((this.asset.lastprice / this.asset.originalprice - 1) * 100).toFixed(2)
        }
        else if (this.asset.lastprice < this.asset.originalprice) {
          return ((1 - this.asset.lastprice / this.asset.originalprice) * 100).toFixed(2) * -1
        } else {
          return '-'
        }
        
      },
      changeClass() {
        // utilize class depending on asset value gain or loss
        if (this.changeToDate < 0) {
          return 'card__change--negative'
        } else if(this.changeToDate > 0) {
          return 'card__change--positive'
        } else {
          return ''
        }
      },
      cardColor() {
        // define coloring of asset card depending on asset type
        let gradientColor = 'linear-gradient(to bottom right,'

        switch (this.asset.type) {

          case 'Stock':
            gradientColor += 'rgba(245, 223, 95, .85), rgba(183, 121, 31, .85))'
            break;
          
          case 'Currency':
            gradientColor += 'rgba(104, 211, 145, .85), rgba(47, 133, 90, .85))'
            break;
          
          case 'Bond':
            gradientColor += 'rgba(245, 175, 25, .85), rgba(241, 39, 17, .85))'
            break;

          case 'ETF':
            gradientColor += 'rgba(76, 162, 205, .85), rgba(40, 60, 134, .85))'
            break;
          
          case 'Cryptocurrency':
            gradientColor += 'rgba(0, 205, 172, .85), rgba(2, 170, 176, .85))'
            break;

          default:
            gradientColor = '#777'
            break;
        }
        return gradientColor
      },
      cardImage() {
        return this.cardColor + ',url(' + require('../assets/images/cash3.png') + ')'
      }
    }
  }
</script>
