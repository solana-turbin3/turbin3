#[cfg(test)]
mod tests {
    use crate::programs::Turbin3_prereq::{Turbin3PrereqProgram, CompleteArgs};
    use solana_client::rpc_client::RpcClient;
    use solana_sdk::{bs58, message::Message, signature::{read_keypair_file, Keypair, Signer}, system_program, transaction::Transaction};
    use std::io::{self, BufRead};
    use solana_program::{pubkey::Pubkey, system_instruction::transfer};
    use std::str::FromStr;
    
    const RPC_URL: &str = "https://api.devnet.solana.com";

    #[test]
    fn keygen() {

        let kp = Keypair::new();
        println!("Generated a new Solana wallet: {}", kp.pubkey().to_string());
        println!();
        println!("Save the following mnemonic phrase to recover the wallet:");
        println!("{:?}", kp.to_bytes());
    }

    #[test]
    fn airdrop() {
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");

        let client = RpcClient::new(RPC_URL);

        match client.request_airdrop(&keypair.pubkey(), 2_000_000_000u64) {
            Ok(s) => {
                println!("Success! Check your TX here:");
                println!("https://explorer.solana.com/tx/{}?cluster=devnet", s.to_string());
            },
            Err(e) => println!("Oops! Something went wrong: {:?}", e.to_string())
        };
    }

    #[test]
    fn transfer_sol() {
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
        let pubkey = keypair.pubkey();
        let message_bytes = b"I verify my solana Keypair!";
        let sig = keypair.sign_message(message_bytes);

        match sig.verify(&pubkey.to_bytes(), message_bytes) {
            true => println!("Signature verified!"),
            false => println!("Signature verification failed!")
        }

        let to_pubkey = Pubkey::from_str("Cif5cxhxXV5wYxc38LT1i7mmECU59XYp6XufQXvmc5jv").unwrap();
        let rpc_client = RpcClient::new(RPC_URL);
        let recent_blockhash = rpc_client.get_latest_blockhash().expect("failed to get recent blockhash");

        let transaction = Transaction::new_signed_with_payer( &[transfer(
            &keypair.pubkey(), &to_pubkey,              1_000_000
            )], Some(&keypair.pubkey()), &vec![&keypair], recent_blockhash
        );
        let signature = rpc_client
        .send_and_confirm_transaction(&transaction)
        .expect("Failed to send transaction");

        println!("Success! Check your TX here:");
        println!("https://explorer.solana.com/tx/{}?cluster=devnet", signature.to_string());

        // empty dev wallet

        let balance = rpc_client.get_balance(&keypair.pubkey()).expect("Failed to get balance");

        let message = Message::new_with_blockhash(
            &[transfer( &keypair.pubkey(), &to_pubkey, balance,
            )], Some(&keypair.pubkey()), &recent_blockhash
        );
        let fee = rpc_client.get_fee_for_message(&message).expect("Failed to get fee calculator");

        let transaction = Transaction::new_signed_with_payer( &[transfer(
            &keypair.pubkey(), &to_pubkey,              
            balance - fee
            )], Some(&keypair.pubkey()), &vec![&keypair], recent_blockhash
        );
        let signature = rpc_client
        .send_and_confirm_transaction(&transaction)
        .expect("Failed to send transaction");

        println!("Success! Emptied the devnet wallet, Check your TX here:");
        println!("https://explorer.solana.com/tx/{}?cluster=devnet", signature.to_string());


    }


    #[test]
    fn base58_to_wallet() {
        println!("Enter a base58 encoded Solana wallet address:");
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
        let wallet = stdin.lock().lines().next().unwrap().unwrap().trim_start_matches('[').trim_end_matches(']').
        split(',') .map(|s| s.trim().parse::<u8>().unwrap()).collect::<Vec<u8>>();

        println!("Your private key is:");
        let base58 = bs58::encode(wallet).into_string();
        println!("{:?}", base58);
    }

    #[test]
    fn enroll() {
        let rpc_client = RpcClient::new(RPC_URL);
        let signer = read_keypair_file("turbin-wallet.json").expect("Couldn't find wallet file");

        let prereq = Turbin3PrereqProgram::derive_program_address(&[b"prereq", signer.pubkey().to_bytes().as_ref()]);

        let args = CompleteArgs {
            github_username: "irohanrajput".as_bytes().to_vec()
        };

        let blockhash = rpc_client .get_latest_blockhash() .expect("Failed to get recent blockhash");

        let transaction = Turbin3PrereqProgram::complete(
            &[&signer.pubkey(), &prereq, &system_program::id()], &args, Some(&signer.pubkey()),
            &[&signer],
            blockhash 
        );

        let signature = rpc_client .send_and_confirm_transaction(&transaction) .expect("Failed to send transaction");

        println!("Success! Check your TX here:");
        println!("https://explorer.solana.com/tx/{}?cluster=devnet", signature.to_string());
    }

}

mod programs;
