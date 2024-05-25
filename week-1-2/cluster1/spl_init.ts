import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from '@solana/spl-token';
import wallet from "../class-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);



(async () => {
    try {
        // Create Mint
        const mint = await createMint (connection, keypair, keypair.publicKey,null,6);
        console.log(`Mint address: ${mint.toBase58()}`);
    } 
    catch(error) {
    console.log(`Oops, something went wrong: ${error}`)
    }
})();
    

//const token_decimals = 1_000_000n;


    
/*
const keypair = Keypair.generate();
console.log(keypair.secretKey.toString());
console.log(keypair.publicKey.toString());
*/

// Mint address

// new PublicKey("eG3YQS2GNn8q36UxQViuGA4kcsyBX6ZNJUqw3xdinvZ");


    /*//Create ATA
         const ata= await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey );

        console.log('Your ata is: ${ata.address.toBase58()}');

        //Mint to ATA
        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            ata.address,
            keypair,
            100000n * token_decimals);
    
})() 
*/