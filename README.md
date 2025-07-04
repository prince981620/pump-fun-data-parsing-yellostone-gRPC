# Pump.fun Monitor using YelloStone gRPC Endpoints

A real-time Solana blockchain monitor that tracks new token mints on the Pump.fun platform using Yellowstone gRPC for efficient transaction streaming.

## Overview

This application monitors the Solana blockchain in real-time to detect new token creations on the Pump.fun platform. It uses Triton One's Yellowstone gRPC client to establish a high-performance connection to Solana's transaction stream and filters for specific program interactions.

## Features

- **Real-time Monitoring**: Streams transactions directly from Solana blockchain
- **Pump.fun Integration**: Specifically monitors the Pump.fun program (`6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P`)
- **Create Instruction Detection**: Filters for token creation transactions using instruction discriminators
- **Formatted Output**: Provides clean, structured data for each new mint detection

## Sample Output

```
===============================================new mint detected !===============================================
{
  signature: '2yd7DSmhKCF6SWeQuCPhkYb7ehJW6kqndmbt1aKn4ULvtf9QeK4v3QVvWctcZtLVStfHQ47AeWPMw1xHsJu9DdDR',
  slot: '351120745',
  mint: '7EqJJppRzWbznF5qgLHsnPM7EjoPQ3UrnQ6KsD7Dpump'
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
- **Commitment Level**: `PROCESSED` for fastest detection

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
4. **Processing**: Extracts mint address, signature, and slot information
5. **Output**: Displays formatted data for each new token mint

## Data Structure

Each detected mint includes:
- `signature`: Transaction signature (base58 encoded)
- `slot`: Blockchain slot number
- `mint`: New token mint address

## Technical Details

### Dependencies

- `@triton-one/yellowstone-grpc`: High-performance gRPC client for Solana
- `@solana/web3.js`: Solana JavaScript SDK
- `bs58`: Base58 encoding/decoding
- `dotenv`: Environment variable management

### Architecture

The application uses a streaming architecture:
1. **Client Setup**: Initializes Yellowstone gRPC client
2. **Stream Management**: Handles bidirectional gRPC streams
3. **Message Processing**: Parses transaction messages
4. **Instruction Matching**: Identifies relevant Pump.fun instructions
5. **Data Extraction**: Formats and outputs relevant information

## Error Handling

The monitor includes comprehensive error handling:
- Connection errors and reconnection logic
- Stream error handling
- Graceful shutdown on stream closure
- Validation of transaction data

## Performance

- Uses `PROCESSED` commitment level for fastest detection
- Efficient filtering at the gRPC level
- Minimal memory footprint with streaming architecture

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
