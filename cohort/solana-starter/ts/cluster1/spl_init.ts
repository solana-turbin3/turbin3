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