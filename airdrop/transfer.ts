import { Keypair, Transaction, Connection, LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey, SystemProgram } from "@solana/web3.js";

import wallet from "./dev-wallet.json"
const sender = Keypair.fromSecretKey(new Uint8Array(wallet.secret_key_arr))

const to = new PublicKey("2omGfyaBcwoJJj1NP4aXE5jkkhit3tcowYpdc92FPjWo")


const conn = new Connection("https://api.devnet.solana.com");


(async () => {
    try {
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: sender.publicKey,
                toPubkey: to,
                lamports: LAMPORTS_PER_SOL / 100
            })
        )
        transaction.recentBlockhash = (await conn.getLatestBlockhash('confirmed')).blockhash;
        transaction.feePayer = sender.publicKey;

        const signnature = await sendAndConfirmTransaction(conn, transaction, [sender])

        console.log(`check your tx here: https://explorer.solana.com/tx/${signnature}?cluster=devnet`)
    }
    catch (e) {
        console.error("something went wrong: ", e)
    }
})();