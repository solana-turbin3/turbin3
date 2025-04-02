import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from '@solana/spl-token';
import wallet from "../../wba-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
    try {
        const mint = await createMint(
            connection, keypair, keypair.publicKey, null, 6
        )
        console.log(`successfully created a mint ${mint}`)
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()

//mind address: EaDWfj82CqKtTBZgJ2MkuzTy9vHVCzWj8TCb7tAxg1XQ


//so here we're creating a mint with 6 decimals, for example 1 rupee has 2 decimals, so 1 rupee = 100 paise, so we can create a mint with 6 decimals, so 1 tusharCoin = 1000000 paise
//but we are not minting any tokens here, we're just creating a mint, creating a mint is like creating a currency, so we can create a mint with 6 decimals, so 1 tusharCoin = 1000000 paise 

//to mint or (in layman terms to print money) we need to do some more steps, we need to create an associated token account, and then mint the tokens to that account

// go to ./spl_mint.ts to mint the tokens