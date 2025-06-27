
# C-TRACE - AI-Powered Chiliz Blockchain Explorer

**C-TRACE** is an AI-powered blockchain explorer and assistant specifically designed for the Chiliz ecosystem. It enables users to explore smart contracts, analyze the Chiliz chain, and interact with fan tokens through natural language queries and intelligent blockchain analysis.

![image](https://github.com/user-attachments/assets/75cc95e6-415e-4a80-882e-ab69017ab48e)

## 🌟 Live Demo

Experience C-TRACE live: **[c-trace.replit.app](https://c-trace.replit.app)**

Share your feedback: **[Telegram @ch04niverse](https://t.me/ch04niverse)**

## 🎯 What Problem Does It Solve?

C-TRACE bridges the gap between complex blockchain data and user-friendly insights on the Chiliz network. It solves several key challenges:

- **Accessibility**: Makes blockchain exploration accessible to non-technical users through natural language
- **Fan Token Intelligence**: Provides deep insights into sports fan tokens and their ecosystems
- **Smart Contract Analysis**: AI-powered contract analysis without requiring technical expertise
- **Real-time Data**: Live blockchain data with intelligent interpretation and context
- **Wallet Integration**: Seamless wallet connectivity with transaction execution capabilities

## 👥 Who Is It For?

- **Sports Fans** exploring fan tokens and team-related blockchain activities
- **Developers** building on the Chiliz network who need quick contract analysis
- **Crypto Enthusiasts** interested in sports-related blockchain applications
- **Researchers** studying the intersection of sports and blockchain technology
- **Traders** analyzing fan token performance and market trends
- **Content Creators** seeking blockchain data for sports-related content

## ✨ Key Features

### 🔍 **Smart Contract Explorer**
- AI-powered analysis of any Chiliz smart contract
- Real-time contract interaction capabilities
- Security analysis and vulnerability detection
- Gas optimization suggestions
- ABI and source code analysis

### **Fan Token Intelligence**🏟️
- Comprehensive fan token database (PSG, BAR, JUV, ACM, ASR, CHZ)
- Token comparison tools ("compare PSG and BAR")
- Real-time balance checking for any address
- Market sentiment analysis for fan tokens
- Token holder distribution insights

### **AI Assistant**🤖  
- Natural language queries for blockchain exploration
- Context-aware responses with session continuity
- Interactive chat interface for complex blockchain questions
- Execute commands for wallet transactions
- Multi-session conversation memory

### **Wallet Integration**💳 
- Native Chiliz Chain (Chain ID: 88888) support
- Multiple wallet support: MetaMask, Coinbase, Rainbow, Trust Wallet
- In-app wallets: Email, Google, Apple, Facebook authentication
- Execute transfer commands directly from chat
- Real-time transaction confirmation

### **Modern UI/UX**📱 
- Fully responsive design optimized for all devices
- 3D interactive backgrounds with Spline integration
- Terminal-style loading screens
- Essential tips panels for user guidance
- Dark mode interface with accessibility features

### **ChilizScan Integration**🔗 
- Comprehensive blockchain data via ChilizScan API
- Transaction analysis and detailed insights
- Address verification and balance checking
- Contract source code and ABI access
- Real-time network data

## Tech Stack 🛠️

### Frontend
- **Framework**: Next.js 15.3.4 with React 18
- **Styling**: Tailwind CSS with custom Chiliz branding
- **UI Components**: Radix UI primitives for accessibility
- **3D Graphics**: Spline 3D scenes and Three.js integration
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Lucide React icon library

### Backend & APIs
- **Blockchain SDK**: Thirdweb v5 for wallet connections and blockchain interactions
- **AI Integration**: Custom Nebula API for intelligent blockchain insights
- **Data Source**: ChilizScan API for comprehensive blockchain data
- **Web3**: Native fetch API with custom error handling

### Blockchain & Web3
- **Primary Network**: Chiliz Mainnet (Chain ID: 88888)
- **Wallet Support**: MetaMask, Coinbase, Rainbow, Trust Wallet
- **In-App Wallets**: Email, Google, Apple, Facebook, Phone authentication
- **Token Standards**: ERC-20, ERC-721, ERC-1155 support

## 🚀 Live Demo

Check out the live version here: [c-trace.replit.app](https://c-trace.replit.app)

We'd love your feedback! [Click here to share thoughts directly with me](https://t.me/ch04niverse)

## Built for Vibe Coding Hackathon 🏆 

C-TRACE was built as part of the Vibe Coding Hackathon to showcase the power of AI + blockchain in the Chiliz ecosystem. Our goal: simplify and democratize access to fan token data and contract exploration for everyone — not just devs.

## How to Run the Project

### Prerequisites
- **Node.js** 18+ installed
- **Yarn** package manager
- **Git** for version control

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd c-trace
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Environment Configuration**:
   Create a `.env.local` file in the root directory:
   ```env
   ```

4. **Start development server**:
   ```bash
   yarn run dev
   ```

5. **Access the application**:
   - **Local**: http://localhost:5000
   - **Network**: http://0.0.0.0:5000 (accessible from other devices)

### Available Scripts
- `yarn dev` - Start development server on port 5000
- `yarn build` - Build optimized production bundle
- `yarn start` - Start production server
- `yarn lint` - Run ESLint for code quality

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── BeautifiedResponse.tsx  # Markdown response renderer
│   │   │   ├── SearchBar.tsx      # Enhanced search interface
│   │   │   ├── Silk.tsx           # 3D background component
│   │   │   └── ...
│   │   ├── BlockchainExplorer.tsx # Main explorer interface with AI chat
│   │   ├── Hero.tsx               # Landing page with 3D Spline scenes
│   │   ├── Navigation.tsx         # App navigation with wallet connection
│   │   ├── LoadingScreen.tsx      # Terminal-style loading screen
│   │   └── Footer.tsx             # Application footer
│   ├── explorer/                  # Explorer page route
│   ├── docs/                      # Comprehensive documentation
│   ├── lib/                       # Utilities and configurations
│   ├── client.ts                  # Thirdweb client configuration
│   ├── globals.css                # Global styles and Tailwind imports
│   ├── layout.tsx                 # Root layout component
│   └── page.tsx                   # Homepage component
├── scripts/
│   ├── Nebula.mjs                 # AI API integration layer
│   └── ChilizScan.mjs            # ChilizScan API service
├── public/
│   └── loading-animation.gif      # Loading animations
└── tests/                         # Test files and examples
```

![image](https://github.com/user-attachments/assets/fc8046bf-9514-415b-b874-297978cd9c9b)

## Key Components

### AI-Powered Blockchain Analysis
- **Natural Language Processing**: Ask questions in plain English
- **Context Awareness**: Maintains conversation context across queries
- **Smart Contract Security**: Automated vulnerability detection
- **Token Discovery**: Intelligent search for fan tokens and contracts

### Fan Token Expertise
- **Popular Tokens**: PSG, BAR, JUV, ACM, ASR with complete metadata
- **Token Comparison**: Side-by-side analysis ("compare PSG and BAR")
- **Balance Checking**: Real-time wallet balance and token holdings
- **Contract Analysis**: Deep dive into fan token smart contracts

### Essential User Tips System
- **Fan Token Tips**: Right-side panel with key usage tips
- **Token Comparison**: Left-side panel for comparative analysis
- **Transfer Commands**: Execute wallet transactions via chat
- **Network Guidance**: Chiliz Chain setup and configuration help

### Execute Commands
- **Transfer CHZ**: `execute transfer 10 CHZ to 0x...`
- **Wallet Integration**: Direct wallet connection and confirmation
- **Transaction Execution**: Real-time blockchain transaction processing
- **Error Handling**: Comprehensive error messages and guidance

## 🌟 Example Usage

### Basic Queries
```
"What is CHZ token?"
"Show me PSG fan token details"
"Analyze contract 0x1234...abcd"
"What is my balance?"
```

### Advanced Queries
```
"Compare PSG and BAR fan tokens"
"execute transfer 10 CHZ to 0x67f6d0F49F43a48D5f5A75205AF95c72b5186d9f"
"Security analysis of this smart contract"
"Show me recent transactions for this address"
```

### Fan Token Specific
```
"PSG fan token"
"Barcelona fan token details"
"Juventus token information"
"AC Milan fan token analysis"
```

## 🚀 Deployment

This project is optimized for **Replit deployment**:

### Deployment Features
- **Port Configuration**: Runs on port 5000 with 0.0.0.0 binding for public access
- **Automatic Dependencies**: Yarn automatically installs packages from package.json
- **Production Ready**: Optimized build configuration for production deployment
- **Environment Variables**: Secure handling of API keys via Replit Secrets

### Deploy on Replit
1. Fork or import the repository to Replit
2. Configure environment variables in the Secrets tab
3. Run the project using the Run button
4. Access your live application via the generated URL

## 🎨 User Interface Highlights

### 3D Interactive Experience
- **Spline Integration**: Immersive 3D backgrounds and animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Loading Screens**: Terminal-style animations for developer appeal
- **Smooth Transitions**: Framer Motion animations throughout

### Essential Tips Panels
- **Fan Token Tips**: Key guidance for fan token queries
- **Transfer Commands**: Wallet transaction execution help
- **Network Configuration**: Chiliz Chain setup guidance
- **Best Practices**: User experience optimization tips

### AI Chat Interface
- **Natural Language**: Ask questions in plain English
- **Context Retention**: Maintains conversation history
- **Execute Buttons**: Direct transaction execution from chat
- **Error Prevention**: Smart input validation and guidance

## 🔧 Advanced Features

### ChilizScan Integration
- **Real-time Data**: Live blockchain data via ChilizScan API
- **Contract Verification**: Source code and ABI access
- **Transaction Analysis**: Detailed transaction breakdowns
- **Address Insights**: Comprehensive address analysis

### Security Features
- **Smart Contract Analysis**: Automated security scanning
- **Vulnerability Detection**: Common security issue identification
- **Risk Assessment**: Contract risk scoring and recommendations
- **Best Practices**: Security guidance and tips

### Token Database
- **Verified Tokens**: Complete database of popular Chiliz tokens
- **Extended Support**: Community tokens with verification status
- **Real-time Updates**: Live token data and market information
- **Comparison Tools**: Side-by-side token analysis

## 🤝 Contributing

We welcome contributions from the community!

### How to Contribute
1. **Fork the repository** on GitHub
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Submit a pull request** with detailed description

### Contribution Guidelines
- Follow existing code style and patterns
- Add tests for new functionality
- Update documentation as needed
- Ensure responsive design compliance
- Test on multiple devices and browsers

## 🐛 Issues & Support

- **Bug Reports**: Submit via GitHub Issues
- **Feature Requests**: Suggest via GitHub Discussions
- **Security Issues**: Report privately via email
- **General Support**: Contact on [Telegram](https://t.me/ch04niverse)

## 🏆 Built for Innovation

C-TRACE was crafted to showcase the powerful synergy of AI and blockchain technology within the Chiliz ecosystem. Our mission: **democratize access to fan token data and contract exploration for everyone—not just developers.**

## 🙏 Acknowledgments

- **Chiliz Chain** for the innovative sports blockchain platform
- **Thirdweb** for excellent Web3 development tools
- **Replit** for hosting and development environment
- **Open Source Community** for amazing tools and libraries

## 📞 Contact

- **Developer**: ch04niverse
- **Telegram**: [@ch04niverse](https://t.me/ch04niverse)
- **Live Demo**: [c-trace.replit.app](https://c-trace.replit.app)

---

**C-TRACE** - *Where AI meets Chiliz: Exploring the future of sports blockchain technology.*

*Crafted with ❤️ by ch04niverse for the global Chiliz community*

### 🚀 Ready to Explore?

**[Launch C-TRACE](https://c-trace.replit.app)** and discover the power of AI-driven blockchain analysis on Chiliz Chain!
