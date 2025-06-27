
# C-TRACE - AI-Powered Chiliz Blockchain Explorer

**C-TRACE** is an advanced AI-powered blockchain explorer and assistant specifically designed for the Chiliz ecosystem. It enables users to explore smart contracts, analyze the Chiliz chain, and interact with fan tokens through natural language queries and intelligent blockchain analysis.

![image](https://github.com/user-attachments/assets/75cc95e6-415e-4a80-882e-ab69017ab48e)

## Live Demo 🌟

Experience C-TRACE live: **[c-trace.replit.app](https://c-trace.replit.app)**

Share your feedback: **[Telegram @ch04niverse](https://t.me/ch04niverse)**

## 🎯 What Problem Does It Solve?

C-TRACE bridges the gap between complex blockchain data and user-friendly insights on the Chiliz network. It solves several key challenges:

- **Accessibility**: Makes blockchain exploration accessible to non-technical users through natural language
- **Fan Token Intelligence**: Provides deep insights into sports fan tokens and their ecosystems
- **Smart Contract Analysis**: AI-powered contract analysis without requiring technical expertise
- **Real-time Data**: Live blockchain data with intelligent interpretation and context
- **Wallet Integration**: Seamless wallet connectivity with transaction execution capabilities
- **Cross-platform Integration**: Multi-device support and comprehensive blockchain integration

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

### 🏟️ **Fan Token Intelligence**
- Comprehensive fan token database (PSG, BAR, JUV, ACM, ASR, CHZ)
- Token comparison tools ("compare PSG and BAR")
- Real-time balance checking for any address
- Market sentiment analysis for fan tokens
- Token holder distribution insights

### 🤖 **AI Assistant (Nebula)**
- Natural language queries for blockchain exploration
- Context-aware responses with session continuity
- Interactive chat interface for complex blockchain questions
- Execute commands for wallet transactions
- Multi-session conversation memory

### 💳 **Wallet Integration**
- Native Chiliz Chain (Chain ID: 88888) support
- Multiple wallet support: MetaMask, Coinbase, Rainbow, Trust Wallet, Phantom
- In-app wallets: Email, Google, Apple, Facebook authentication
- Execute transfer commands directly from chat
- Real-time transaction confirmation

### 📱 **Modern UI/UX**
- Fully responsive design optimized for all devices
- 3D interactive backgrounds with Spline integration
- Terminal-style loading screens for enhanced developer experience
- Gradient-based modern design system with Chiliz branding
- Dark mode interface with accessibility features

### 🔗 **Blockchain Integration**
- Comprehensive blockchain data via ChilizScan API
- Transaction analysis and detailed insights
- Address verification and balance checking
- Contract source code and ABI access
- Real-time network data

### 🔧 **Developer Tools**
- ChilizScan API integration for comprehensive data access
- Smart contract ABI and source code analysis
- Transaction hash lookup and detailed analysis
- Address balance checking and token holdings
- Extensible token database for emerging projects

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.3.4 with React 18
- **Styling**: Tailwind CSS with custom Chiliz branding
- **UI Components**: Radix UI primitives for accessibility
- **3D Graphics**: Spline 3D scenes and Three.js integration
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Lucide React icon library
- **State Management**: React hooks and context

### Backend & APIs
- **Blockchain SDK**: Thirdweb v5 for wallet connections and blockchain interactions
- **AI Integration**: Custom Nebula API for intelligent blockchain insights
- **Data Source**: ChilizScan API for comprehensive blockchain data
- **Networking**: Native fetch API with custom error handling and retry logic

### Blockchain & Web3
- **Primary Network**: Chiliz Mainnet (Chain ID: 88888)
- **Wallet Support**: MetaMask, Coinbase Wallet, Rainbow, Rabby, Trust Wallet, Phantom
- **In-App Wallets**: Email, Google, Apple, Facebook, Phone authentication
- **Token Standards**: ERC-20, ERC-721, ERC-1155 support

## 🚀 Live Demo

Experience C-TRACE live: **[c-trace.replit.app](https://c-trace.replit.app)**

We'd love your feedback! [Share your thoughts directly](https://t.me/ch04niverse)

## Built for Vibe Coding Hackathon 🏆 

C-TRACE was crafted as part of the Vibe Coding Hackathon to showcase the powerful synergy of AI and blockchain technology within the Chiliz ecosystem. Our mission: **democratize access to fan token data and contract exploration for everyone—not just developers.**

## 🔧 How to Run the Project

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
   # Thirdweb Configuration (optional)
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id

   # Additional API keys as needed
   NEBULA_API_KEY=your_nebula_api_key
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
│   │   ├── BlockchainExplorer.tsx # Main explorer interface
│   │   ├── Hero.tsx               # Landing page hero section
│   │   ├── Navigation.tsx         # App navigation with wallet integration
│   │   ├── LoadingScreen.tsx      # Terminal-style loading screen
│   │   └── Footer.tsx             # Application footer
│   ├── explorer/                  # Explorer page route
│   ├── docs/                      # Documentation pages
│   ├── lib/                       # Utilities and configurations
│   │   ├── features.ts            # Feature flags management
│   │   └── utils.ts               # Utility functions
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

## 🎯 Key Components Deep Dive

### Hero Component
- **Interactive 3D Spline scenes** for immersive user experience
- **Smart search bar** with chain selection and input validation
- **Responsive design** that adapts to all screen sizes
- **Error handling** with fallback backgrounds

### Blockchain Explorer
- **AI-powered chat interface** with session management
- **Smart contract analysis tools** with real-time data
- **Suggested action buttons** for common blockchain tasks
- **Real-time blockchain data integration** via multiple APIs
- **Markdown rendering** for beautiful response formatting

### Navigation System
- **Responsive design** with mobile-first approach
- **Wallet connection integration** (feature-flagged)
- **Modern gradient styling** consistent with Chiliz branding
- **Accessibility features** for inclusive design

## 🌟 Notable Features

### AI-Powered Analysis
- **Natural language processing** for blockchain queries
- **Context-aware responses** with session continuity
- **Smart contract security analysis**
- **Token discovery and comparison tools**

### ChilizScan Integration
- **Comprehensive token database** with popular fan tokens
- **Real-time balance checking** for any address
- **Transaction analysis** with detailed breakdowns
- **Contract verification** and source code access

### User Experience
- **Terminal-style loading** for developer appeal
- **3D interactive backgrounds** for visual engagement
- **Responsive design** for all devices
- **Accessibility compliance** with WCAG standards

## Example Usage 🌟

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
- **Port Configuration**: Runs on port 5000 with 0.0.0.0 binding for public access
- **Automatic Dependencies**: Yarn automatically installs packages from package.json
- **Production Ready**: Optimized build configuration for production deployment
- **Environment Variables**: Secure handling of API keys and configurations

### Deployment Steps on Replit:
1. Fork or import the repository to Replit
2. Configure environment variables in the Secrets tab
3. Run the project using the Run button
4. Access your live application via the generated URL

## 🤝 Contributing

We welcome contributions from the community! Here's how to get involved:

1. **Fork the repository** on GitHub
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Submit a pull request** with a detailed description

### Contribution Guidelines
- Follow the existing code style and patterns
- Add tests for new functionality
- Update documentation as needed
- Ensure responsive design compliance
- Test on multiple devices and browsers

## 🐛 Bug Reports & Feature Requests

- **Issues**: Report bugs via GitHub Issues
- **Features**: Suggest new features through GitHub Discussions
- **Security**: Report security issues privately via email
- **Feedback**: Share general feedback on [Telegram](https://t.me/ch04niverse)

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

Feel free to use this project as a foundation for your own blockchain exploration tools and sports-related DApps.

## 🙏 Acknowledgments

- **Chiliz Chain** for providing an innovative sports blockchain platform
- **Thirdweb** for excellent Web3 development tools
- **Replit** for hosting and development environment
- **Vibe Coding Hackathon** for the inspiration and platform
- **Open Source Community** for the amazing tools and libraries

## 📞 Support & Contact

- **Developer**: ch04niverse
- **Telegram**: [@ch04niverse](https://t.me/ch04niverse)
- **GitHub**: [Project Repository](https://github.com/your-username/c-trace)
- **Live Demo**: [c-trace.replit.app](https://c-trace.replit.app)

---

**C-TRACE** - *Where AI meets Chiliz: Exploring the future of sports blockchain technology.*

*Crafted with ❤️ by ch04niverse*

### 🔥 Join the Revolution

Ready to explore the future of sports blockchain? **[Launch C-TRACE](https://c-trace.replit.app)** and discover the power of AI-driven blockchain analysis!
