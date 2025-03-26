import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import { secret_key_arr } from "./dev-wallet.json";

const kp = Keypair.fromSecretKey(new Uint8Array(secret_key_arr))

const conn = new Connection("https://api.devnet.solana.com");

const github = Buffer.from("irohfanrajput", "utf8")


const provider = new AnchorProvider(conn, new Wallet(kp), { commitment: "confirmed" })

const program: Program<Turbin3Prereq> = new Program(IDL, provider);

const enrollment_seeds = [Buffer.from("pre"), kp.publicKey.toBuffer()]

const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(enrollment_seeds, program.programId);


(async () => {
    try {
        const txhash = await program.methods
            .submit(github)
            .accounts({
                signer: kp.publicKey,
            })
            .signers([
                kp
            ]).rpc();
        console.log(`Success! Check out your TX here:
            https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();