import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";

import wallet from "./dev-wallet.json"

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet.secret_key_arr))

const connection = new Connection("https://api.devnet.solana.com");

(async () => {
    try{
        const txhash = await connection.requestAirdrop(keypair.publicKey, 2*LAMPORTS_PER_SOL);
        console.log(`Success, the tx is: https://explorer.solana.com/tx/${txhash}?cluster=devnet`)
    } catch(e){
        console.error("something wend wrong: ", e)
    }
})();