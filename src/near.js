import * as UI from './docui'
// redirects user to wallet to authorize your dApp
// this creates an access key that will be stored in the browser's local storage
// access key can then be used to connect to NEAR and sign transactions via keyStore

let contract
let account
let wallet

export const signIn = () => {
  wallet.requestSignIn(
    'need-find-tribbles-js13k.testnet', // contract requesting access
    'Need to Find the Tribbles!', // optional
    // 'http://localhost:8080/', // optional
    // 'http://localhost:8080/', // optional
  )
}

export const signOut = () => {
  wallet.signOut()

  window.location.reload()
}

export async function claimNFT() {
  const id = UI.$i('tid').innerHTML

  UI.$i('claim').disabled = true

  console.log(id, account, contract)

  const response = await fetch('https://benjaminwfox.com/api/tribble/transfer', {
    method: 'POST',
    body: JSON.stringify({
      token_id: id, // Tribble_Gen1_0-779
      new_token_owner_id: account.accountId, // bwf-js13k-2021.testnet
    }),
    headers: { 'Content-Type': 'application/json' },
  })

  const result = await response.json()

  if (result.status === 'Success' !== -1) {
    UI.$i('ownership').innerHTML = `owned by ${account.accountId}`
  }
  else {
    UI.$i('claim').disabled = false
  }

  /**
   * This can be enabled if tokens show up for a given user.
   */
  // const result = await contract.nft_reassign_ownership({
  //   token_id: id, // Tribble_Gen1_0-779
  //   new_token_owner_id: account.accountId, // bwf-js13k-2021.testnet
  // })

  // if (result.indexOf('Success') !== -1) {
  //   UI.$i('ownership').innerHTML = `owned by ${account.accountId}`
  // }
  // else {
  //   UI.$i('claim').disabled = false
  // }

  console.log('Transfer Result', result)
}

export async function viewNFT(id) {
  const result = await contract.get_token({
    token_id: id,
  })

  return result
}

export async function doNearStuff() {
  const nearAPI = window.nearApi

  /**
   * USER KEYSTORE
   */
  const { keyStores, connect, WalletConnection } = nearAPI
  const keyStore = new keyStores.BrowserLocalStorageKeyStore()
  const config = {
    networkId: 'testnet',
    keyStore, // optional if not signing transactions
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
  }

  const near = await connect(config)

  wallet = new WalletConnection(near)

  if (wallet.isSignedIn()) {
    const acct = wallet.getAccountId()

    console.log('IS SIGNED IN!', acct)

    UI.setSigninData(acct)

    account = await near.account(wallet._authData.accountId)
    const response = await account.state()

    console.log('STATE', response)

    contract = new nearAPI.Contract(
      account, // the account object that is connecting
      'need-find-tribbles-js13k.testnet',
      {
      // name of contract you're connecting to
        viewMethods: ['get_token'], // view methods do not change state but usually return a value
        changeMethods: ['nft_reassign_ownership'], // change methods modify state
        sender: account, // account object to initialize and sign transactions.
      },
    )
  }
  else {
    UI.modClassById(false, 'b', 'authd')
  }
}
