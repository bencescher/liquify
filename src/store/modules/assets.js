import firebase from 'firebase'
import db from '../../firebase/init.js'

const state = {
  assets: [],
  total: 0,
  totalOriginal: 0
}

const mutations = {
  'GET_ASSETS' (state) {
    // load the assets of the corresponding user from the database
    const user = firebase.auth().currentUser.email
    state.assets = []
    state.total = 0
    state.totalOriginal = 0

    // load the base currency 'baseCurrency' from database
    db.collection('currency').get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const baseCurrency = doc.data().name
          
          // loop through assets loaded from database and add them to 'state.assets'
          db.collection('assets').get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                const assetData = doc.data()
                let rateQuery = ''
                // if current price differs from asset's last price, update 'lastprice' in database
                let updateLastprice = currentAsset => {
                  if (currentAsset.price !== currentAsset.lastprice) {
                    db.collection('assets').doc(currentAsset.id).update({
                      lastprice: currentAsset.price,
                      quotedate: new Date().getTime()
                    })
                  }
                }
                
                // consider only assets owned by the logged in user
                if (assetData.owner === user) {
                  // assign the document id to the asset itself
                  assetData.id = doc.id
                  state.totalOriginal += parseInt(assetData.originalprice)

                  // define current price based on currency settings and quantity
                  if (assetData.base === baseCurrency) {
                    assetData.price = parseInt(assetData.quantity)
                    state.total += assetData.price
                    state.assets.push(assetData)
                  } else {

                    // determine query for exchange rate depending on asset type
                    if (assetData.type !== 'Stock') {
                      rateQuery = assetData.base + baseCurrency
                    } else {
                      rateQuery = assetData.base
                    } 
                    // read the corresponding exchange rate
                    db.collection('rates').doc(rateQuery).get()
                      .then(exchangeRate => {
                        // convert stock quote to display currency in case it is not 'USD'
                        if (assetData.type === 'Stock') {
                          db.collection('rates').doc('USD' + baseCurrency).get()
                            .then(usdRate => {
                              assetData.price = parseInt(assetData.quantity) * exchangeRate.data().rate * usdRate.data().rate
                              state.total += assetData.price
                              updateLastprice(assetData)
                              state.assets.push(assetData)
                            })
                        } else {
                          // if asset type is not 'stock'
                          assetData.price = assetData.quantity * exchangeRate.data().rate
                          state.total += assetData.price
                          updateLastprice(assetData)
                          state.assets.push(assetData)
                        }
                      })
                  }
                }
              })
            })
        })
      })
  },
  'CREATE_ASSET' (state, asset) {
    // load the current display currency from database
    db.collection('currency').doc('base').get()
      .then(baseRate => {
        const baseCurrency = baseRate.data().name
        let rateQuery = ''
        let addToDataBase = asset => {
          // add new asset to database
          db.collection('assets').add({
            owner: asset.owner,
            base: asset.base,
            account: asset.account,
            type: asset.type,
            quantity: asset.quantity,
            originalcurrency: baseCurrency,
            originalprice: asset.originalprice,
            lastprice: asset.lastprice,
            purchasedate: new Date().getTime(),
            quotedate: new Date().getTime()
          })
        }

        if (asset.base === baseCurrency) {
          asset.originalprice = asset.quantity
          asset.lastprice = asset.quantity
          addToDataBase(asset)
        } else {
          // determine database query for exchange rate depending on asset type
          if (asset.type !== 'Stock') {
            rateQuery = asset.base + baseCurrency
          } else {
            rateQuery = asset.base
          }

          db.collection('rates').doc(rateQuery).get()
            .then(exchangeRate => { 
              if (asset.type === 'Stock') {
                db.collection('rates').doc('USD' + baseCurrency).get()
                  .then(usdRate => {
                    asset.originalprice = asset.quantity * exchangeRate.data().rate * usdRate.data().rate
                    asset.lastprice = asset.quantity * exchangeRate.data().rate * usdRate.data().rate
                    addToDataBase(asset)
                  })
              } else {
                asset.originalprice = asset.quantity * exchangeRate.data().rate
                asset.lastprice = asset.quantity * exchangeRate.data().rate
                addToDataBase(asset)
              }
            })
        }
      })
  },
  'UPDATE_ASSETS' (state, asset) {
    // load the current display currency from database
    db.collection('currency').doc('base').get()
      .then(baseRate => {
        const baseCurrency = baseRate.data().name
        let updateDataBase = asset => {
          // update asset in database and local state with the new values
          db.collection('assets').doc(asset.id).update({
            account: asset.account,
            type: asset.type,
            quantity: asset.quantity,
            lastprice: asset.lastprice,
            updatedate: asset.updatedate
          })
          .then(() => {
            state.assets.forEach(item => {
              if (item.id === asset.id) {
                item.account = asset.account
                item.type = asset.type
                item.quantity = asset.quantity
                item.lastprice = asset.lastprice
                item.updatedate = asset.updatedate
              }
            })
          })
        }

        if (asset.base === baseCurrency) {
          asset.lastprice = asset.quantity
          updateDataBase(asset)
        } else {
          const rateQuery = asset.base + baseCurrency

          db.collection('rates').doc(rateQuery).get()
            .then(exchangeRate => {
              asset.lastprice = asset.quantity * exchangeRate.data().rate
              updateDataBase(asset)
            })
        }
      })
  }
}

const actions = {
  createAsset: ({ commit }, asset) => {
    commit('CREATE_ASSET', asset)
  },
  initAssets: ({ commit }) => {
    commit('GET_ASSETS')
  },
  updateAssets: ({ commit }, asset) => {
    commit('UPDATE_ASSETS', asset)
  }
}

const getters = {
  assets: state => {
    return state.assets
  },
  total: state => {
    return state.total
  },
  totalOriginal: state => {
    return state.totalOriginal
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}