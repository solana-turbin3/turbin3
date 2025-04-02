import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
// This is the mint address we created in the previous step, which is the address of the token(unique) we want to transfer
const mint = new PublicKey("EaDWfj82CqKtTBZgJ2MkuzTy9vHVCzWj8TCb7tAxg1XQ");

// Recipient address
const to = new PublicKey("Asjd2KVipwa7PUgwP4AhyGk5pkoXvWX2rTFS88wzTrgW");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromWallet = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey)


        // Get the token account of the toWallet address, and if it does not exist, create it
        const toWallet = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to)

        // Transfer the new token to the "toTokenAccount" we just created
        const transfer_data = await transfer(connection, keypair, fromWallet.address, toWallet.address, keypair, 12345)
        console.log(transfer_data)
    } catch (e) {



        console.error(`Oops, something went wrong: ${e}`)
    }
})();

//transfer of tokens is done using Associated Token Accounts, which are accounts that hold the tokens for a specific mint
// The transfer function will transfer the specified amount of tokens from the fromWallet to the toWallet
// The fromWallet is the address of the wallet we want to transfer the tokens from
// The toWallet is the address of the wallet we want to transfer the tokens to
