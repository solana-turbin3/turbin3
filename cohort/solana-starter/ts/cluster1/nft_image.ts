import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image 
        //2. Convert image to generic file.
        //3. Upload image

        const image = await readFile("./cluster1/assets/jeff.png");
        const genericFile = createGenericFile(image, "jeff.png", {contentType:"image/png"})

        const [imageUri] = await umi.uploader.upload([genericFile])
        console.log("Your image URI: ", imageUri);
    }
    catch (error) {
        console.log("Oops.. Something went wrong", error);
    }
})();


// // https://devnet.irys.xyz/J9oxycXZFR543sD59QGHE6RpvH6WK8cEB43cysWd8o3K
