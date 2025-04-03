import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../wba-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    try {
        // URI from your metadata upload
        const metadataUri = "https://devnet.irys.xyz/CV67dXshQqi1upQsWCpbndnpmv3o9DE3pTWazizfVAbY";

        // Create the NFT
        let tx = createNft(umi, {
            mint: mint,
            uri: metadataUri,
            name: "sky coin", // Required parameter even if in metadata
            symbol: "JEFFKYY", // Required parameter even if in metadata
            sellerFeeBasisPoints: percentAmount(0),
            creators: [
                {
                    address: myKeypairSigner.publicKey,
                    verified: true,
                    share: 100
                }
            ],
            isMutable: true
        });

        let result = await tx.sendAndConfirm(umi);
        const signature = base58.encode(result.signature);

        console.log(`Successfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
        console.log("Mint Address: ", mint.publicKey);
    } catch (error) {
        console.error("Error minting NFT:", error);
    }
})();


//  Successfully Minted! Check out your TX here:
// https://explorer.solana.com/tx/3YqMP9Wo3VBAiQCry1CfiYAkuN1YuaBT7r1HowvX7jLxbUFm2EobgJESWAACbchVT5fDbmAkpxr3vgZKocsaLA4K?cluster=devnet
//  Mint Address:  2JTemzaddFPkgSFuQyYp7M6XDySsNEgE7Kt7Gg5NfFKG