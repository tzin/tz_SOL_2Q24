import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../class-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("A8yRwaLK9hChdrfCy4G84qTiDgoaMwSfvBQofozTM6fU");

// Recipient address
const to = new PublicKey("zqYxGErzEzRPJPZSiGjpkKWhNCXxXvTL2GJqwy6Xd9F");

(async () => {
    try {
        //Get token account if it does not exist, create it

        const ataSrc =  await getOrCreateAssociatedTokenAccount(
            connection,
            keypair, 
            mint,
            keypair.publicKey,
        );

        // Get the token account of the toWallet address, and if it does not exist, create it
        const ataTo =  await getOrCreateAssociatedTokenAccount(
            connection,
            keypair, 
            mint,
            to,
        );

        // Transfer the new token to the "toTokenAccount" we just created
        const tx = await transfer(
            connection,
            keypair,
            ataSrc.address,
            ataTo.address,
            keypair,
            10,
        );
        console.group(`tx here: https://explorer.solana.com/tx/${tx}?cluster=devnet`)
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();