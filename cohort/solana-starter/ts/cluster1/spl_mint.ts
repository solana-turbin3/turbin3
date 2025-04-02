import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../wba-wallet.json"
import { keypairIdentity } from "@metaplex-foundation/umi";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("EaDWfj82CqKtTBZgJ2MkuzTy9vHVCzWj8TCb7tAxg1XQ");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(
            connection, keypair, mint, keypair.publicKey
        )
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        const mintTx = await mintTo(
            connection, keypair, mint, ata.address, keypair.publicKey, 84444449
        )
        console.log(`Your mint txid: ${mintTx}`);
    } catch (error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()


// Your ata is: 4yatni6HqY73vd48sEfLYMXMng3pRiHGdVrRxy7ZaaNK
// Your mint txid: 675gAXxcC1hRQxP7nSFTjtV8pqcj1Qyywg9DdD4546YMvx1j71ygsXBg8drGrLAwj8jgoi1HReyBrPndNXczmoFU
