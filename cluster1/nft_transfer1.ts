import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../class-wallet.json";
import { Connection, PublicKey, Keypair, Transaction } from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  AccountLayout,
} from "@solana/spl-token";

// Initialize connection and Umi
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const umi = createUmi(connection);

// Replace with your wallet's keypair
const senderKeypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// NFT mint address (the rug) and recipient address
const nftMintAddress = new PublicKey("Cmi71CG5FB1NssHdbrKG2mDztfdnTG9S6AQizPWr6HZW");
const recipientAddress = new PublicKey("6eGKgDhFAaLYkxoDMyx2NU4RyrSKfCXdRmqtjT7zodxQ");

async function createAssociatedTokenAccountIfNeeded(
  mint: PublicKey,
  owner: PublicKey,
  payer: Keypair
): Promise<PublicKey> {
  const associatedTokenAddress = await getAssociatedTokenAddress(mint, owner);

  const accountInfo = await connection.getAccountInfo(associatedTokenAddress);
  if (!accountInfo) {
    console.log(`Creating associated token account for owner ${owner.toBase58()} and mint ${mint.toBase58()}`);
    const createAtaInstruction = createAssociatedTokenAccountInstruction(
      payer.publicKey, // payer
      associatedTokenAddress, // ATA address
      owner, // owner of the ATA
      mint, // mint
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const transaction = new Transaction().add(createAtaInstruction);
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer.publicKey;
    transaction.sign(payer);

    const signature = await connection.sendRawTransaction(transaction.serialize());
    await connection.confirmTransaction(signature);
    console.log(`Created ATA: ${associatedTokenAddress.toBase58()} with tx: ${signature}`);
  } else {
    console.log(`Associated token account already exists: ${associatedTokenAddress.toBase58()}`);
  }

  return associatedTokenAddress;
}

async function verifyTokenAccount(tokenAccount: PublicKey) {
  const accountInfo = await connection.getAccountInfo(tokenAccount);
  if (!accountInfo) {
    throw new Error(`Token account ${tokenAccount.toBase58()} does not exist`);
  }
  const accountData = AccountLayout.decode(accountInfo.data);
  if (new PublicKey(accountData.mint).toBase58() !== nftMintAddress.toBase58()) {
    throw new Error(`Token account ${tokenAccount.toBase58()} is not associated with mint ${nftMintAddress.toBase58()}`);
  }
  console.log(`Token account ${tokenAccount.toBase58()} is valid for mint ${nftMintAddress.toBase58()}`);
}

async function sendNft() {
  // Get or create the associated token addresses
  const senderTokenAddress = await createAssociatedTokenAccountIfNeeded(
    nftMintAddress,
    senderKeypair.publicKey,
    senderKeypair
  );
  const recipientTokenAddress = await createAssociatedTokenAccountIfNeeded(
    nftMintAddress,
    recipientAddress,
    senderKeypair
  );

  // Verify token accounts
  await verifyTokenAccount(senderTokenAddress);
  await verifyTokenAccount(recipientTokenAddress);

  // Verify sender's token account balance
  const senderTokenAccount = await connection.getTokenAccountBalance(senderTokenAddress);
  if (!senderTokenAccount || !senderTokenAccount.value || senderTokenAccount.value.uiAmount === null || senderTokenAccount.value.uiAmount < 1) {
    throw new Error("Sender does not have enough NFT tokens to transfer");
  }

  // Create the transfer instruction
  const transferInstruction = createTransferInstruction(
    senderTokenAddress,
    recipientTokenAddress,
    senderKeypair.publicKey,
    1, // Assuming you're sending 1 NFT
    [],
    TOKEN_PROGRAM_ID
  );

  // Build and send the transaction
  const transaction = new Transaction().add(transferInstruction);
  const { blockhash } = await connection.getRecentBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = senderKeypair.publicKey;
  transaction.sign(senderKeypair);

  const signature = await connection.sendRawTransaction(transaction.serialize());
  await connection.confirmTransaction(signature);

  console.log(
    `Transaction confirmed: https://explorer.solana.com/tx/${signature}?cluster=devnet`
  );
}

sendNft().catch(console.error);
