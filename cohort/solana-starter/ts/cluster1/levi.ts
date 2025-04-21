import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, publicKey, signerIdentity } from "@metaplex-foundation/umi"
import { readFile } from "fs/promises"
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token"
import { Commitment, Connection, Keypair } from "@solana/web3.js"
import { createMetadataAccountV3, CreateMetadataAccountV3InstructionAccounts, CreateMetadataAccountV3InstructionArgs, DataV2Args } from "@metaplex-foundation/mpl-token-metadata"
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));
umi.use(irysUploader());



const kp = Keypair.fromSecretKey(new Uint8Array(wallet));



const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

umi.use(signerIdentity(signer));

const create_token = async (decimals: number = 6) => {
    try {

        const uploadImage = await readFile("./cluster1/assets/levi.png");
        const genericFile = createGenericFile(uploadImage, "levi.png", { contentType: "image/png" })

        const [imageUri] = await umi.uploader.upload([genericFile])


        // creating the metadata
        const image = imageUri
        const metadata = {
            name: "levi",
            symbol: "LEVI",
            description: "for captain levi",
            image: image,
        };
        const myUri = await umi.uploader.upload([
            createGenericFile(
                JSON.stringify(metadata),
                "metadata.json",
                { contentType: "application/json" }
            )
        ]);

        console.log(myUri[0])



        const mint = await createMint(
            connection, kp, kp.publicKey, null, decimals
        )

        const mintAddressString = mint.toBase58();
        const mintAddress = publicKey(mintAddressString);




        
        let accounts: CreateMetadataAccountV3InstructionAccounts = { mint: mintAddress, mintAuthority: signer }

        let data: DataV2Args = {
            name: "tushrassss",
            symbol: "TSH",
            uri: "https://devnet.irys.xyz/FPvmSDo4QeeatxKv4pDqd2DasoNzUTXiMo9rXo8yPfy7",
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


    }
    catch (error) {
        console.log("Oops.. Something went wrong", error);
    }
};

create_token()

// // https://devnet.irys.xyz/J9oxycXZFR543sD59QGHE6RpvH6WK8cEB43cysWd8o3K


// https://devnet.irys.xyz/FPvmSDo4QeeatxKv4pDqd2DasoNzUTXiMo9rXo8yPfy7