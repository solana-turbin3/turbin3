import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("EaDWfj82CqKtTBZgJ2MkuzTy9vHVCzWj8TCb7tAxg1XQ");

// Recipient address
const to = new PublicKey("Asjd2KVipwa7PUgwP4AhyGk5pkoXvWX2rTFS88wzTrgW");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromWallet = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey)

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toWallet = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint, to
        );

        const tokens_to_transfer:number = 1200000;

        // Transfer the new token to the "toTokenAccount" we just created
        const transfer_txid = await transfer(connection, keypair, fromWallet.address, toWallet.address, keypair, tokens_to_transfer )

        console.log(`successfully transfered ${tokens_to_transfer/1000000} tokens from ${fromWallet.address} to ${toWallet.address}`)
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();