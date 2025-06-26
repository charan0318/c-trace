
# C-TRACE - AI-Powered Chiliz Blockchain Explorer

**C-TRACE** is an AI-powered blockchain explorer and assistant specifically designed for the Chiliz ecosystem, enabling users to explore smart contracts, analyze chiliz chain, and interact with the Chiliz network through natural language queries.

## What Problem Does It Solve?

C-TRACE bridges the gap between complex blockchain data and user-friendly insights on the Chiliz network. It solves the challenge of navigating and understanding fan token mechanics, smart contract interactions, and blockchain analytics without requiring deep technical knowledge of the Chiliz ecosystem.

## Who Is It For?

- **Sports fans** exploring fan tokens and team-related blockchain activities
- **Developers** building on the Chiliz network who need quick contract analysis
- **Crypto enthusiasts** interested in sports-related blockchain applications
- **Researchers** studying the intersection of sports and blockchain technology

## Key Features

### 🔍 **Smart Contract Explorer**
- Analyze any Chiliz smart contract with AI-powered insights
- Uncover contract methods, data structures, and fan token logic
- Real-time contract interaction capabilities

### 🏟️ **Fan Token Analysis**
- Track fan token performance across the Chiliz ecosystem
- Discover emerging trends in sports blockchain applications
- Research CHZ token utility and sports club integrations

### 🤖 **AI Assistant**
- Natural language queries for blockchain exploration
- Context-aware responses about Chiliz network operations
- Interactive chat interface for complex blockchain questions

### 📱 **Modern UI/UX**
- Fully responsive design optimized for all devices
- 3D interactive backgrounds with Spline integration
- Terminal-style loading screens for developer experience
- Gradient-based modern design system

### 🔗 **Blockchain Integration**
- Native Chiliz Chain (Chain ID: 88888) support
- Real-time blockchain data fetching
- Transaction analysis and insights

## Tech Stack

### Frontend
- **Framework**: Next.js 15.3.4 with React 18
- **Styling**: Tailwind CSS with custom Chiliz branding
- **UI Components**: Radix UI primitives
- **3D Graphics**: Spline 3D scenes and Three.js
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend & APIs
- **Blockchain SDK**: Thirdweb v5 for wallet connections
- **AI Integration**: Custom Nebula API for blockchain insights
- **Networking**: Native fetch API with custom request handling

### Blockchain
- **Primary Network**: Chiliz Mainnet (Chain ID: 88888)
- **Wallet Support**: MetaMask, Coinbase Wallet, Rainbow, Rabby
- **In-App Wallets**: Email, Google, Apple, Facebook, Phone authentication

## How to Run the Project

### Prerequisites
- Node.js 18+ installed
- Yarn package manager

### Installation Steps

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd c-trace
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Environment Configuration**:
   Create a `.env.local` file with:
   ```env
   # Add your environment variables here
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
   # Add other required API keys
   ```

4. **Start development server**:
   ```bash
   yarn run dev
   ```

5. **Access the application**:
   - Local: http://localhost:5000
   - Network: http://0.0.0.0:5000

### Available Scripts
- `yarn dev` - Start development server on port 5000
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── Hero.tsx      # Landing page hero section
│   │   ├── BlockchainExplorer.tsx  # Main explorer interface
│   │   ├── Navigation.tsx # App navigation
│   │   └── LoadingScreen.tsx # Terminal-style loading
│   ├── explorer/         # Explorer page
│   ├── lib/             # Utilities and features
│   └── globals.css      # Global styles
├── scripts/
│   └── Nebula.mjs       # AI API integration
└── tests/               # Test files
```

## Key Components

### Hero Component
- Interactive 3D Spline scenes
- Smart search bar with chain selection
- Call-to-action for AI exploration

### Blockchain Explorer
- AI-powered chat interface
- Smart contract analysis tools
- Suggested action buttons for common tasks
- Real-time blockchain data integration

### Navigation
- Responsive design with mobile optimization
- Wallet connection integration (feature-flagged)
- Modern gradient styling with Chiliz branding

## Feature Flags

The project uses feature flags for controlled rollouts:
```typescript
export const FEATURES = {
  WALLET_CONNECTION: false, // Currently disabled
} as const;
```

## Deployment

This project is optimized for deployment on Replit:
- Runs on port 5000 with 0.0.0.0 binding for public access
- Automatic dependency installation via package.json
- Production-ready build configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - Feel free to use this project as a foundation for your own blockchain exploration tools.

---

**C-TRACE** - Where AI meets Chiliz: Exploring the future of sports blockchain technology.

*Crafted with ❤️ from ch04niverse*
