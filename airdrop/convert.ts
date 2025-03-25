import  bs58  from "bs58";


const SECRET_KEY_ARRAY = [0]
const base58PrivateKey = bs58.encode(SECRET_KEY_ARRAY)

console.log("PRIVATE KEY IN BASE58 FORMAT: ", base58PrivateKey)

