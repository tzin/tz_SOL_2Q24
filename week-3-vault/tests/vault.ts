import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Vault } from "../target/types/vault";
import { BN } from "@coral-xyz/anchor";

describe("vault", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Vault as Program<Vault>;

  const vaultState = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("state"), provider.publicKey.toBytes()], program.programId)[0];
  const vault = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("vault"), vaultState.toBytes()], program.programId)[0];
  const amountToDeposit = new BN(5 * anchor.web3.LAMPORTS_PER_SOL);
  const amountToWithdraw = new BN(3 * anchor.web3.LAMPORTS_PER_SOL);



  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
    .initialize()
    .accountsPartial({
      user: provider.wallet.publicKey,
      vaultState,
      vault,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
    console.log("your txn sig:",tx);
    
    //let vaultState = await program.account.vaultState.fetch(vault);
    //console.log("\nState bump is:",vaultState.stateBump.toString());
    console.log("Your vault State info", (await provider.connection.getAccountInfo(vaultState)));
    console.log("Your vault info", (await provider.connection.getAccountInfo(vault)));
  });

  it("Deposit 5 SOL", async () => {
    const tx = await program.methods
    .deposit(amountToDeposit)
    .accountsPartial({
      user: provider.wallet.publicKey,
      vaultState,
      vault,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

    console.log("\nYour transaction signature", tx);
    console.log("Your vault info", (await provider.connection.getAccountInfo(vault)));
    console.log("Your vault balance", (await provider.connection.getBalance(vault)).toString());
  });

  it("Withdraw 3 SOL", async () => {
    const tx = await program.methods
    .withdraw(amountToWithdraw)
    .accountsPartial({
      user: provider.wallet.publicKey,
      vaultState,
      vault,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
    console.log("\nYour transaction signature", tx);
    console.log("Your vault balance", (await provider.connection.getBalance(vault)).toString());
  });

  it("Close vault", async () => {
    const tx = await program.methods
    .close()
    .accountsPartial({
      user: provider.wallet.publicKey,
      vaultState,
      vault,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

    console.log("\nYour transaction signature", tx);
    console.log("Your vault info", (await provider.connection.getAccountInfo(vault)));
  });
});
