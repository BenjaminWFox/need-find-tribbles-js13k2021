const nearAPI = require('near-api-js')
const BN = require('bn.js')
const fs = require('fs').promises
const assert = require('assert').strict

function getConfig(env) {
  switch (env) {
    case 'sandbox':
    case 'local':
      return {
        networkId: 'sandbox',
        nodeUrl: 'http://localhost:3030',
        masterAccount: 'test.near',
        contractAccount: 'status-message.test.near',
        keyPath: '/tmp/near-sandbox/validator_key.json',
      }
  }
}

const contractMethods = {
  viewMethods: ['test_get_account_tokens'],
  changeMethods: ['nft_mint'],
}
let config
let masterAccount
let masterKey
let pubKey
let keyStore
let near

async function initNear() {
  config = getConfig(process.env.NEAR_ENV || 'sandbox')
  const keyFile = require(config.keyPath)

  masterKey = nearAPI.utils.KeyPair.fromString(keyFile.secret_key || keyFile.private_key)
  pubKey = masterKey.getPublicKey()
  keyStore = new nearAPI.keyStores.InMemoryKeyStore()
  keyStore.setKey(config.networkId, config.masterAccount, masterKey)
  near = await nearAPI.connect({
    deps: {
      keyStore,
    },
    networkId: config.networkId,
    nodeUrl: config.nodeUrl,
  })
  masterAccount = new nearAPI.Account(near.connection, config.masterAccount)

  console.log('Finish init NEAR')

  return masterAccount
}

async function createContractUser(
  accountPrefix,
  contractAccountId,
  contractMethods,
) {
  let accountId = `${accountPrefix}.${config.masterAccount}`

  await masterAccount.createAccount(
    accountId,
    pubKey,
    new BN(10).pow(new BN(25)),
  )
  keyStore.setKey(config.networkId, accountId, masterKey)
  const account = new nearAPI.Account(near.connection, accountId)
  const accountUseContract = new nearAPI.Contract(
    account,
    contractAccountId,
    contractMethods,
  )

  return accountUseContract
}

async function initTest() {
  const contract = await fs.readFile('./res/non_fungible_token.wasm')
  const _contractAccount = await masterAccount.createAndDeployContract(
    config.contractAccount,
    pubKey,
    contract,
    new BN(10).pow(new BN(25)),
  )

  return _contractAccount

  // const aliceUseContract = await createContractUser(
  //   'alice',
  //   config.contractAccount,
  //   contractMethods,
  // )

  // const bobUseContract = await createContractUser(
  //   'bob',
  //   config.contractAccount,
  //   contractMethods,
  // )

  // console.log('Finish deploy contracts and create test accounts')

  // return { aliceUseContract, bobUseContract }
}

async function rerunTest() {
  const contract = await fs.readFile('./res/non_fungible_token.wasm')
  const _contractAccount = await masterAccount.deployContract(
    config.contractAccount,
    pubKey,
    contract,
    new BN(10).pow(new BN(25)),
  )

  return _contractAccount
}

async function test() {
  // 1. Creates testing accounts and deploys a contract
  await initNear()
  // const master = await initTest()

  const r1 = await config.contractAccount.nft_mint({
    args: {
      token_id: 'Tribble_Gen1_0-150',
      token_owner_id: 'need-find-tribbles-js13k.testnet',
      token_metadata: {
        title: 'Tribble_Gen1_0-150',
        description: 'Need to Find the Tribbles - NFT Search - js13k 2021 Decentralized Category',
        media: 'https://js13k-2021-tribbles.s3.us-west-2.amazonaws.com/Tribble_Gen1_0-150.png',
        media_hash: '',
        copies: 1,
        issued_at: 'Wed, 08 Sep 2021 02:12:26 GMT',
        expires_at: '',
        starts_at: '',
        updated_at: '',
        extra: '',
        reference: 'ipfs://bafyreie67lmwtpyldnuxbky3zjsb65uqpwactgs3ttugpw5wxidspopggu/metadata.json',
        reference_hash: '',
      },
    },
  })

  console.log(r1)
  const r2 = await config.contractAccount.test_get_account_tokens()

  console.log(r2)
}

test()
