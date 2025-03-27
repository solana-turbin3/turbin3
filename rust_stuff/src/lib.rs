#[cfg(test)]
mod tests {
    use ::bs58;
    use solana_client::rpc_client::RpcClient;
    use solana_sdk::signature::{Keypair, Signer, read_keypair_file};
    use std::io::{self, BufRead};

    #[test]
    fn keygen() {
        let kp = Keypair::new();
        println!(
            "you've generated new solana wallet: {}",
            kp.pubkey().to_string()
        );
        println!("");
        println!("to save your wallet, copy and pase the following into a JSON file: ");
        println!("{:?}", kp.to_bytes());
    }

    #[test]
    fn base58_to_wallet() {
        println!("Input your private key as base58:");
        let stdin = io::stdin();
        let base58 = stdin.lock().lines().next().unwrap().unwrap();
        println!("Your wallet file is:");
        let wallet = bs58::decode(base58).into_vec().unwrap();
        println!("{:?}", wallet);
    }

    #[test]
    fn wallet_to_base58() {
        println!("Input your private key as a wallet file byte array:");
        let stdin = io::stdin();
        let wallet = stdin
            .lock()
            .lines()
            .next()
            .unwrap()
            .unwrap()
            .trim_start_matches('[')
            .trim_end_matches(']')
            .split(',')
            .map(|s| s.trim().parse::<u8>().unwrap())
            .collect::<Vec<u8>>();

        println!("Your private key is:");
        let base58 = bs58::encode(wallet).into_string();
        println!("{:?}", base58);
    }
    #[test]
    fn airdrop() {
        const RPC_URL: &str = "https://api.devnet.solana.com";
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
        let client = RpcClient::new(RPC_URL); 
        match client.request_airdrop(&keypair.pubkey(), 2_000_000_000u64) {Ok(s) => {
            println!("Success! Check out your TX here:");
            println!("https://explorer.solana.com/tx/{}?cluster=devnet", s.to_string());
        }
        Err(e) => println!("Oops, something went wrong: {}", e.to_string()) };
    }

    #[test]
    fn transfer_sol() {
        
    }
}
