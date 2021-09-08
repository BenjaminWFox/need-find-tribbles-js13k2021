// redirects user to wallet to authorize your dApp
// this creates an access key that will be stored in the browser's local storage
// access key can then be used to connect to NEAR and sign transactions via keyStore

export const signIn = (wallet) => {
  wallet.requestSignIn(
    'need-find-tribbles-js13k.testnet', // contract requesting access
    'Need to Find the Tribbles!', // optional
    // 'http://localhost:8080/', // optional
    // 'http://localhost:8080/', // optional
  )
}

export const signOut = (wallet) => {
  wallet.signOut()
}

export async function claimNFT(id, account, contract, acctOverride = null) {
  console.log(id, account, contract)

  const result = await contract.nft_reassign_ownership(
    {
      token_id: id, // Tribble_Gen1_0-779
      new_token_owner_id: acctOverride ?? account.accountId, // bwf-js13k-2021.testnet
    },
    0, // 300000000000000, // attached GAS (optional)
    1, // attached deposit in yoctoNEAR (optional)
  )

  console.log(result)
  try {
    const res2 = result.json()

    console.log(res2)
  }
  catch {
    console.log('Not like that...')
  }
}

export async function doNearStuff() {
  const nearAPI = window.nearApi
  const { keyStores, connect, WalletConnection, KeyPair } = nearAPI
  // creates keyStore from a private key string
  // you can define your key here or use an environment variable

  const keyStore = new keyStores.InMemoryKeyStore()
  const PRIVATE_KEY = 'ed25519:39WhZFZptLynuEwurYyURcqDjBURK6o12ZBhWW2zhGzuY2JWBYVdYDsa3WoVfjfp1QW6tzzXhczBmqqsu5td9NAB'
  // creates a public / private key pair using the provided private key
  const keyPair = KeyPair.fromString(PRIVATE_KEY)

  // adds the keyPair you created to keyStore
  await keyStore.setKey('testnet', 'need-find-tribbles-js13k.testnet', keyPair)

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
  const wallet = new WalletConnection(near)

  // let account
  // let contract
  // if (wallet.isSignedIn()) {
  //   account = await near.account(wallet._authData.accountId)
  //   contract = new nearAPI.Contract(
  //     account, // the account object that is connecting
  //     'need-find-tribbles-js13k.testnet',
  //     {
  //     // name of contract you're connecting to
  //     // viewMethods: ['getMessages'], // view methods do not change state but usually return a value
  //       changeMethods: ['nft_reassign_ownership'], // change methods modify state
  //       sender: account, // account object to initialize and sign transactions.
  //     },
  //   )
  // }

  const account = await near.account('need-find-tribbles-js13k.testnet')
  const contract = new nearAPI.Contract(
    account, // the account object that is connecting
    'need-find-tribbles-js13k.testnet',
    {
      // name of contract you're connecting to
      // viewMethods: ['getMessages'], // view methods do not change state but usually return a value
      changeMethods: ['nft_reassign_ownership'], // change methods modify state
      sender: account, // account object to initialize and sign transactions.
    },
  )

  return { wallet, contract, account }
}
