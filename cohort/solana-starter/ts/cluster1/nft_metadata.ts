import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://devnet.irys.xyz/J9oxycXZFR543sD59QGHE6RpvH6WK8cEB43cysWd8o3K"
        const metadata = {
            name: "sky coin",
            symbol: "JEFFKYY",
            description: "jeff eats burgers",
            image: image,
            attributes: [
                {trait_type: 'Age', value: '50'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: []
        };
        const myUri = await umi.uploader.upload([
            createGenericFile(
                JSON.stringify(metadata),
                "metadata.json",
                { contentType: "application/json" }
            )
        ]);
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();

// https://devnet.irys.xyz/CV67dXshQqi1upQsWCpbndnpmv3o9DE3pTWazizfVAbY