import Client, {
    CommitmentLevel,
    SubscribeRequest,
    SubscribeUpdate,
    SubscribeUpdateTransaction
} from "@triton-one/yellowstone-grpc";
// import { Message, CompiledInstruction } from "@triton-one/yellowstone-grpc/dist/types/grpc/solana-storage";
import { ClientDuplexStream } from "@grpc/grpc-js"
import { PublicKey } from "@solana/web3.js";
import bs58 from 'bs58';
import dotenv from 'dotenv';
dotenv.config();


// Interfaces
interface CompiledInstruction {
    programIdIndex: number;
    accounts: Uint8Array;
    data: Uint8Array;
}

interface Message {
    header: MessageHeader | undefined;
    accountKeys: Uint8Array[];
    recentBlockhash: Uint8Array;
    instructions: CompiledInstruction[];
    versioned: boolean;
    addressTableLookups: MessageAddressTableLookup[];
}

interface MessageHeader {
    numRequiredSignatures: number;
    numReadonlySignedAccounts: number;
    numReadonlyUnsignedAccounts: number;
}

interface MessageAddressTableLookup {
    accountKey: Uint8Array;
    writableIndexes: Uint8Array;
    readonlyIndexes: Uint8Array;
}

// required constants

const ENDPOINT = process.env.ENDPOINT;
const TOKEN = process.env.TOKEN;

/* 
    address: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
    metadata: {
        name: "pump",
        version: "0.1.0",
        spec: "0.1.0",
        description: "Created with Anchor"
    },..
*/
const PUMP_PROGRAM_ID = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
/* 
    {
    name: "create",
    docs: ["Creates a new coin and bonding curve."],
    discriminator: [24, 30, 200, 40, 5, 28, 7, 119],
    accounts: [{
        name: "mint",
        writable: !0,
        signer: !0
    }...
*/
const PUMP_FUN_CREATE_IX_DISCRIMINATOR = Buffer.from([24, 30, 200, 40, 5, 28, 7, 119]);
const COMMITMENT = CommitmentLevel.PROCESSED;
// All required interfaces


const FILTER_CONFIG = {
    programIds: [PUMP_PROGRAM_ID],
    instructionDiscriminators: [PUMP_FUN_CREATE_IX_DISCRIMINATOR]
}

const ACCOUNTS_TO_INCLUDE = [{
    name: "mint",
    index: 0
}];


interface FormattedTransactionData {
    signature: string;
    slot: string;
    [accountName: string]: string
}

interface ParsedTokenData {
  mint: string;
  name: string;
  symbol: string;
  description: string;
  image_uri: string;
  metadata_uri: string;
  twitter: string;
  telegram: string;
  website: string;
  bonding_curve: string;
  associated_bonding_curve: string;
  creator: string;
  created_timestamp: Number;
  raydium_pool: string;
  complete: true;
  virtual_sol_reserves: Number;
  virtual_token_reserves: Number;
  hidden: true;
  total_supply: Number;
  show_name: true;
  last_trade_timestamp: Number;
  king_of_the_hill_timestamp: Number;
  market_cap: string;
  nsfw: true;
  market_id: string;
  inverted: true;
  real_sol_reserves: Number;
  real_token_reserves: Number;
  livestream_ban_expiry: Number;
  last_reply: Number;
  reply_count: Number;
  is_banned: true;
  is_currently_live: true;
  initialized: true;
  video_uri: string;
  for_you_id: Number;
  for_you_deg: 0;
  usd_market_cap: string;
  hls_link: string;
  channel_name: string;
  stream_title: string;
  stream_description: string;
  price: string;
  last_price_update: Date;
  search_vector: string;
  stream_start_time: Date;
}

async function main(): Promise<void>  {
    console.log("let start");
    if(!ENDPOINT && !TOKEN) {
        console.log(ENDPOINT, TOKEN);
        console.log("Please provide Endpoint URL and TOken in env file");
        return;
    }
    // if you are using private grpc endpoint use token
    // const client = new Client(ENDPOINT, TOKEN, {
    //     "grpc.max_receive_message_length": 64 * 1024 * 1024,
    // });

    // i am using public endpoint so no need of any tokens
    const client = new Client(ENDPOINT, undefined, undefined);
    console.log("client:", client);
    
    const stream = await client.subscribe();
    console.log("stream", stream);

    const version = await client.getVersion();
    console.log("vsersion",version);
    console.log("bhash",await client.getLatestBlockhash());


    //stream.on("data", (data) => {
    //         console.log('inside stream');
    //     const ts = new Date().toUTCString();
    //     if(data.slot) {
    //             console.log(
    //         `${ts}: Received slot update: ${data.slot.slot}, Commitment: ${data.slot.status}`
    //         );
    //     }else if (data.pong) {
    //   console.log(`${ts}: Received pong (ping response id: ${data.pong.id})`);
    // } else {
    //   console.log(`${ts}: Received other data:`, data); // For debugging other message types
    // }
    // })

    const request = createSubscribeRequest();
    console.log("request:", request);

    try {
        await sendSubscribeRequest(stream, request);
        console.log('Geyser connection established - watching new Pump mints. \n');

        await handleStreamEvents(stream);
    } catch (error: any){
        console.error('Error in subscription process:', error);
        stream.end();
    }

}

function createSubscribeRequest(): SubscribeRequest {
    return {
        accounts: {},
        slots: {},
        transactions: {
            pumpFun: {
                accountInclude: FILTER_CONFIG.programIds,
                accountExclude: [],
                accountRequired: [],
            }
        },
        transactionsStatus: {},
        entry: {},
        blocks: {},
        blocksMeta: {},
        commitment: COMMITMENT,
        accountsDataSlice: [],
        ping: undefined,
    };
}

function sendSubscribeRequest(
    stream: ClientDuplexStream<SubscribeRequest, SubscribeUpdate>,
    request: SubscribeRequest
): Promise <void> {
    return new Promise<void> ((resolve, reject) => {
        stream.write(request, (err: Error | null) => {
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function handleStreamEvents(stream: ClientDuplexStream<SubscribeRequest, SubscribeUpdate>): Promise<void> {
    console.log("inside handlestream data");
    return new Promise<void> ((resolve, reject) => {
        stream.on('data', handleData);
        stream.on("error", (error: Error) => {
            console.error('Stream error:', error);
            reject(error);
            stream.end();
        });
        stream.on("end", () => {
            console.log('Stream ended');
            resolve();
        });
        stream.on("close", () => {
            console.log('Stream closed');
            resolve();
        });
    })
}

function handleData(data: SubscribeUpdate): void {

    // if (!isSubscribeUpdateTransaction(data) || !data.filters.includes('pumpFun')) {
    //     return;
    // }
    // console.log("inside handle data & data:", data);

    const transaction = data.transaction?.transaction;
    // console.log("transaction:",transaction);
    const message = transaction?.transaction?.message;
    // console.log("message:",message);

    if (transaction && message) {
    message.instructions.forEach((ix, idx) => {
    //   console.log(`Instruction ${idx} data:`, Buffer.from(ix.data).toString('hex'));
    });
    }

    if(!transaction || !message) {
        return;
    }

    const matchingInstruction = message.instructions.find(matchesInstructionDiscriminator)
    
    if(!matchingInstruction) {
        return;
    }

    const formattedSignature = convertSignature(transaction.signature);
    const formattedData = formatData(message, formattedSignature.base58, data?.transaction?.slot || "");

    if(formattedData) {
        console.log("===============================================new mint detected !===============================================");
        console.log(formattedData);
        console.log("\n");
    }
}

function formatData(message: Message, signature: string, slot: string): FormattedTransactionData | undefined {
    const matchingInstruction = message.instructions.find(matchesInstructionDiscriminator);

    if(!matchingInstruction) {
        return undefined;
    }

    const accountKeys = message.accountKeys;
    const includeAccounts = ACCOUNTS_TO_INCLUDE.reduce<Record<string, string>>((acc, { name, index}) => {
        const accountIndex = matchingInstruction.accounts[index];
        const publicKey = accountKeys[accountIndex];
        acc[name] = new PublicKey(publicKey).toBase58();
        return acc;
    }, {});



    return {
        signature,
        slot,
        ...includeAccounts
    }
}   

function convertSignature(signature: Uint8Array): {base58: string} {
    return { base58: bs58.encode(Buffer.from(signature))};
}

function matchesInstructionDiscriminator(ix: CompiledInstruction): boolean {
//     console.log("inside matching instructon discriminator")
//     console.log("ix data:", ix?.data);
//     console.log("create discriminator :", Buffer.from([24, 30, 200, 40, 5, 28, 7, 119]));
    const matches =  ix?.data && FILTER_CONFIG.instructionDiscriminators.some(discriminator => Buffer.from(discriminator).equals(ix.data.slice(0, 8)));
    // console.log("matches:", matches);
    return matches;
}

main();