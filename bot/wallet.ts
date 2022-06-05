import TonWeb from 'tonweb'
import tonMnemonic from 'tonweb-mnemonic'
import * as dotenv from 'dotenv'

dotenv.config()

const tonweb = new TonWeb(
    new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {
        apiKey: process.env.TESTNET_API_KEY,
    })
)

export const createKeyPair = async () => {
    const words = await tonMnemonic.generateMnemonic()

    console.log('Construyendo wallet')

    const seed = await tonMnemonic.mnemonicToSeed(words)

    const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSeed(seed)

    return { keypair: keyPair }
}

export const createWallet = async (keyPair: any) => {
    //const publicKey = TonWeb.utils.hexToBytes(process.env.PUBLIC_KEY) //IF ITS STORED
    //const secretKey = TonWeb.utils.hexToBytes(process.env.PRIVATE_KEY)

    const wallet = new tonweb.wallet.all.v3R2(tonweb.provider, {
        publicKey: keyPair.publicKey,
    })

    const address = await wallet.getAddress()

    const nonBounceableAddress = address.toString(true, true, false)

    const seqno = await wallet.methods.seqno().call()

    const balance = await tonweb.getBalance(address)

    console.log('retornando wallet para: ' + address.toString(true, true, true))

    const keyHex = tonweb.utils.bytesToHex(keyPair.secretKey)

    return {
        WalletInstance: wallet,
        Address: address,
        NBAdress: nonBounceableAddress,
        Seqno: seqno,
        Balance: balance,
        SecretKey: keyHex,
    }

    //deploy can only happen before it gets initialized sending to the account tokens
    //const deploy = await wallet.deploy(secretKey).send(); // deploy wallet to blockchain
    //console.log(deploy);

    //first time an account its made, the seqno its null, this is BAD, here needs to go 0 if seqno its null

    /*
    const transfer = wallet.methods.transfer({
        secretKey: secretKey,
        toAddress: 'EQC4LeRa48G0Rl7SKcE7C_TTDgst-lrBO_-y7PKdcWfzQia5',
        amount: TonWeb.utils.toNano(0.01), // 0.01 TON
        seqno: seqno ? seqno : 0,
        payload: 'Hello',
        sendMode: 3,
    })

    const transferSended = await transfer.send() // send transfer query to blockchain

    console.log(transferSended);
    */
}
