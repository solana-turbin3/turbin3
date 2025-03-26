import { Keypair, Transaction, Connection, LAMPORTS_PER_SOL, sendAndConfirmTransaction, PublicKey, SystemProgram } from "@solana/web3.js";

import wallet from "./dev-wallet.json"
const sender = Keypair.fromSecretKey(new Uint8Array(wallet.secret_key_arr))

const to = new PublicKey("2omGfyaBcwoJJj1NP4aXE5jkkhit3tcowYpdc92FPjWo")


const conn = new Connection("https://api.devnet.solana.com");


(async () => {
    try {
        const balance = await conn.getBalance(sender.publicKey)



        //creating a test transaction to calculate fees


        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: sender.publicKey,
                toPubkey: to,
                lamports: balance
            })
        )
        transaction.recentBlockhash = (await conn.getLatestBlockhash('confirmed')).blockhash;
        transaction.feePayer = sender.publicKey;


        //calculating exact fee rate to transfer entire sol amount 

        const fee = (await conn.getFeeForMessage(transaction.compileMessage(), 'confirmed')).value || 0;

        //remove our transfer instruction to replace it.

        transaction.instructions.pop()

        //adding transaction back

        transaction.add(SystemProgram.transfer({
            fromPubkey: sender.publicKey,
            toPubkey: to,
            lamports: balance - fee,
        }))


        const signnature = await sendAndConfirmTransaction(conn, transaction, [sender])

        console.log(`check your tx here: https://explorer.solana.com/tx/${signnature}?cluster=devnet`)
    }
    catch (e) {
        console.error("something went wrong: ", e)
    }
})();