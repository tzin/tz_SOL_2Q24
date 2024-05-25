import wallet from "../class-wallet.json"
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
        const file = await readFile('/Users/thazin/Desktop/LFG/firstclass/solana-starter/ts/cluster1/generug.png');

        //2. Convert image to generic file.
        const image = await createGenericFile(file,"rug",{contentType: "image/png"});

        //3. Upload image
        const [myUri] = await umi.uploader.upload([image]);

        // const image = ???

        // const [myUri] = ??? 
         console.log("Your image URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
