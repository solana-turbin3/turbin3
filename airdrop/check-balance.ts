import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import wallet from "./dev-wallet.json"

async function check_balance(walletAddress: string) {
    try {
        const publicKey = new PublicKey(wallet.public_key);
        const connection = new Connection("https://api.devnet.solana.com");

        const balanceInLamports: number = await connection.getBalance(publicKey);

        const balanceInSOL: number = balanceInLamports / LAMPORTS_PER_SOL;

        console.log(`the balance for the ${wallet.name || ""} account is:`,balanceInSOL);

    }
    catch (error: any) {
        console.error(error.message);
    }
}


async function main() {
    const bal = await check_balance(wallet.public_key);
}

// Ensure that main() runs in an async context
main().catch(console.error);