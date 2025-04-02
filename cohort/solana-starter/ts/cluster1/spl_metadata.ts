import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
    createMetadataAccountV3,
    CreateMetadataAccountV3InstructionAccounts,
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
// This is the mint address we created in the previous step, which is the address of the token(unique) we want to mint
const mint = publicKey("EaDWfj82CqKtTBZgJ2MkuzTy9vHVCzWj8TCb7tAxg1XQ")

// Create a UMI connection
// This is the connection to the Solana devnet
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = { mint, mintAuthority: signer }

        let data: DataV2Args = {
            name: "tushrassss",
            symbol: "TSH",
            uri: "https://arweave.net/nFo9Nwcamf4ek0SwtKQchYD47T9dkTpGqL62CgcXSjZE",
            sellerFeeBasisPoints: 10,
            creators: null,
            collection: null,
            uses: null

        }


        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
