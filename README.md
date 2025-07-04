# Pump.fun Monitor using Yellowstone gRPC

A real-time Solana blockchain monitor that tracks new token mints on the Pump.fun platform using Yellowstone gRPC for efficient transaction streaming. This monitor captures comprehensive token creation data including metadata, accounts, and instruction arguments.

## Overview

This application monitors the Solana blockchain in real-time to detect new token creations on the Pump.fun platform. It uses Triton One's Yellowstone gRPC client to establish a high-performance connection to Solana's transaction stream and filters for specific program interactions, extracting detailed token information from each mint transaction.

## Features

- **Real-time Monitoring**: Streams transactions directly from Solana blockchain
- **Pump.fun Integration**: Specifically monitors the Pump.fun program (`6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P`)
- **Create Instruction Detection**: Filters for token creation transactions using instruction discriminators
- **Complete Data Extraction**: Captures both account addresses and instruction arguments
- **Token Metadata Parsing**: Extracts name, symbol, URI, and creator from instruction data
- **Account Information**: Provides mint, bonding curve, and user addresses
- **Formatted Output**: Clean, structured JSON output for each new mint detection

## Sample Output

```javascript
===============================================new mint detected !===============================================
{
  signature: 'Keju34ZKVvEHX5BDVDxvigEnXZ8QaEXAW48E5BWzmvyH41Ti6iZATnXQ8CwwrVSQDYC9qFXegvb1pxpdhuC2xJU',
  slot: '351135728',
  mint: '8Bdt4ViKGfj67NZZ5VfVgbhnjVySusXHxTZW5jMHpump',
  bonding_curve: 'gM75mej5DAL6RFeas1v6jRUbJ7e7uo9Er1VJEWuftdj',
  associated_bonding_curve: '4pcQJXCyYF5jJxLvG7NB5kZABSPwrHsPzcDVPRHAtd3Y',
  user: 'DnV3yLQK8FKDeb5F93nfVewCUVrpUqtianCiUxxhH9Zh',
  name: 'Dicken Strange',
  symbol: 'D.STRANGE',
  uri: 'https://ipfs.io/ipfs/bafkreie5wkau7ytjvnmwtsuvnsmprcw7lexxtzkhptzzho7cqdvibyh3rq',
  creator: 'DnV3yLQK8FKDeb5F93nfVewCUVrpUqtianCiUxxhH9Zh'
}

===============================================new mint detected !===============================================
{
  signature: '2Z6tTQfHsmMUtFxBp1jJALeF3V17kiZdnsXiDzqzy1GGnDPwddHZ5DjjuQwp27fD6amrMdyQzDSooEqi8XSKvGNZ',
  slot: '351135729',
  mint: 'E41HLfWbcrWNWf8idDk4Ac1Jghcf2vKxAnekn2Appump',
  bonding_curve: 'DxHGkWPSDyToX61WawYHqscWYaaur9Ywtdhx7Gt1q7rb',
  associated_bonding_curve: '3QY5FNLFNZUS47KpS8ZctE7X82MS6Bd7HMh6mDg9un2V',
  user: 'A2Xe6cErqHEeW1vZTRxcsFzRhGFoWFnuHqCxoU2H3AhP',
  name: 'Bitcoin Hyper',
  symbol: 'Hyper',
  uri: 'https://ipfs.io/ipfs/QmWxqrfKkAebJmUbvd6kRV8HKfyBCyPGijmR5i3Kx7jC4y',
  creator: 'A2Xe6cErqHEeW1vZTRxcsFzRhGFoWFnuHqCxoU2H3AhP'
}
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Access to a Solana RPC endpoint (public or private)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pump-fun-monitor
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
ENDPOINT=your_yellowstone_grpc_endpoint_here
TOKEN=your_token_here_if_using_private_endpoint
```

## Configuration

### Environment Variables

- `ENDPOINT`: Your Yellowstone gRPC endpoint URL
- `TOKEN`: Authentication token (only required for private endpoints)

### Filter Configuration

The monitor is configured to track:
- **Program ID**: `6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P` (Pump.fun)
- **Instruction Discriminator**: `[24, 30, 200, 40, 5, 28, 7, 119]` (Create instruction)
- **Commitment Level**: `FINALIZED` for reliable data consistency

### Account Extraction

The monitor extracts the following accounts from each create instruction:
- **mint** (index 0): The new token mint address
- **bonding_curve** (index 2): The bonding curve account
- **associated_bonding_curve** (index 3): Associated token account for the bonding curve
- **user** (index 7): The transaction signer/creator

### Instruction Arguments

The monitor also decodes the instruction arguments:
- **name**: Token name (e.g., "Dicken Strange", "Bitcoin Hyper")
- **symbol**: Token symbol (e.g., "D.STRANGE", "Hyper")
- **uri**: Metadata URI (typically IPFS link)
- **creator**: Creator's public key address

## Usage

### Development Mode

Run the monitor in development mode:
```bash
npm run dev
```

### Production Mode

Compile and run:
```bash
npm run build
npm start
```

### Direct Execution

Run directly with ts-node:
```bash
npx ts-node index.ts
```

## How It Works

1. **Connection**: Establishes a gRPC connection to Yellowstone
2. **Subscription**: Subscribes to transaction updates for the Pump.fun program
3. **Filtering**: Filters transactions for create instructions using discriminators
4. **Account Extraction**: Extracts relevant account addresses (mint, bonding curve, user)
5. **Argument Decoding**: Decodes instruction data to extract token metadata (name, symbol, URI, creator)
6. **Output**: Displays comprehensive formatted data for each new token mint

## Data Structure

Each detected mint includes:

### Transaction Information
- `signature`: Transaction signature (base58 encoded)
- `slot`: Blockchain slot number

### Account Addresses
- `mint`: New token mint address
- `bonding_curve`: Bonding curve account address
- `associated_bonding_curve`: Associated bonding curve token account
- `user`: Transaction signer/user address

### Token Metadata
- `name`: Token name (decoded from instruction args)
- `symbol`: Token symbol (decoded from instruction args)
- `uri`: Metadata URI, typically pointing to IPFS (decoded from instruction args)
- `creator`: Token creator's public key (decoded from instruction args)

## Technical Details

### Dependencies

- `@triton-one/yellowstone-grpc`: High-performance gRPC client for Solana
- `@solana/web3.js`: Solana JavaScript SDK
- `bs58`: Base58 encoding/decoding
- `dotenv`: Environment variable management

### Architecture

The application uses a streaming architecture with enhanced data extraction:
1. **Client Setup**: Initializes Yellowstone gRPC client
2. **Stream Management**: Handles bidirectional gRPC streams
3. **Message Processing**: Parses transaction messages and instructions
4. **Instruction Matching**: Identifies relevant Pump.fun create instructions
5. **Account Extraction**: Extracts account addresses from instruction account list
6. **Argument Decoding**: Decodes Borsh-serialized instruction data to extract:
   - Token name (string)
   - Token symbol (string) 
   - Metadata URI (string)
   - Creator public key (32 bytes)
7. **Data Formatting**: Combines accounts and arguments into structured output

### Instruction Data Parsing

The create instruction data is parsed using Borsh serialization format:
- **Bytes 0-7**: Instruction discriminator `[24, 30, 200, 40, 5, 28, 7, 119]`
- **Bytes 8+**: Arguments in order:
  1. Name (4-byte length + UTF-8 string)
  2. Symbol (4-byte length + UTF-8 string)
  3. URI (4-byte length + UTF-8 string)
  4. Creator (32-byte public key)

## Error Handling

The monitor includes comprehensive error handling:
- Connection errors and reconnection logic
- Stream error handling
- Graceful shutdown on stream closure
- Validation of transaction data

## Performance

- Uses `FINALIZED` commitment level for reliable data consistency
- Efficient filtering at the gRPC level reduces network overhead
- Minimal memory footprint with streaming architecture
- Real-time instruction argument decoding for complete token information
- Structured output format suitable for further processing or storage

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Disclaimer

This tool is for educational and monitoring purposes only. Always ensure compliance with relevant regulations when monitoring blockchain data.

## Support

For issues and questions, please open an issue on GitHub or contact the maintainers.
