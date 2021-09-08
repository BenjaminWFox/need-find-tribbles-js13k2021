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

export async function claimNFT(id, acctOverride = null) {
  console.log(id, account, contract)

  const result = await contract.nft_reassign_ownership({
    token_id: id, // Tribble_Gen1_0-779
    new_token_owner_id: acctOverride ?? account.accountId, // bwf-js13k-2021.testnet
  })

  console.log('Transfer Result', result)
}

export async function viewNFT(id) {
  console.log(id, account, contract)

  const result = await contract.get_token({
    token_id: id,
  })

  console.log('Token Result', result)
}

export async function doNearStuff() {
  const nearAPI = window.nearApi

  /**
   * USER KEYSTORE
   */
  const { keyStores, connect, WalletConnection } = nearAPI
  const keyStore = new keyStores.BrowserLocalStorageKeyStore()

  /**
   * ADMIN KEYSTORE
   */
  //  const { keyStores, connect, WalletConnection, KeyPair } = nearAPI
  // const keyStore = new keyStores.InMemoryKeyStore()
  // const PRIVATE_KEY = 'ed25519:39WhZFZptLynuEwurYyURcqDjBURK6o12ZBhWW2zhGzuY2JWBYVdYDsa3WoVfjfp1QW6tzzXhczBmqqsu5td9NAB'
  // // creates a public / private key pair using the provided private key
  // const keyPair = KeyPair.fromString(PRIVATE_KEY)

  // // adds the keyPair you created to keyStore
  // await keyStore.setKey('testnet', 'need-find-tribbles-js13k.testnet', keyPair)

  const config = {
    networkId: 'testnet',
    keyStore, // optional if not signing transactions
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://wallet.testnet.near.org',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
  }

  const near = await connect(config)

  // create wallet connection
  wallet = new WalletConnection(near)

  // let account
  // let contract
  if (wallet.isSignedIn()) {
    console.log('IS SIGNED IN!', wallet.getAccountId())

    account = await near.account(wallet._authData.accountId)
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

  // account = await near.account('need-find-tribbles-js13k.testnet')
  // contract = new nearAPI.Contract(
  //   account, // the account object that is connecting
  //   'need-find-tribbles-js13k.testnet',
  //   {
  //     // name of contract you're connecting to
  //     viewMethods: ['get_token'], // view methods do not change state but usually return a value
  //     changeMethods: ['nft_reassign_ownership'], // change methods modify state
  //     sender: account, // account object to initialize and sign transactions.
  //   },
  // )
}
