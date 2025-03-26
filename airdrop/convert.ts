import bs58 from "bs58";
import wallet from "./dev-wallet.json"

const toBase58 = (secretKey: Uint8Array): string => {
    return bs58.encode(secretKey);
};

const toUint8Array = (base58Key: string): Uint8Array => {
    return bs58.decode(base58Key);
};




const SECRET_KEY_ARRAY = new Uint8Array(wallet.secret_key_arr);
const base58PrivateKey = toBase58(SECRET_KEY_ARRAY);
console.log("PRIVATE KEY IN BASE58 FORMAT:", base58PrivateKey);


// const base58SecretKey = wallet.secret_key_b58

// const decodedUint8Array = toUint8Array(base58SecretKey);
// console.log("DECODED SECRET KEY ARRAY:", decodedUint8Array);
