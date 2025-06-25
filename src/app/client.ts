
import { createThirdwebClient } from "thirdweb";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "demo-client-id";

if (!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID) {
  console.warn("⚠️  NEXT_PUBLIC_THIRDWEB_CLIENT_ID not found. Using demo client ID. Please add your Thirdweb client ID to .env.local");
}

export const client = createThirdwebClient({
  clientId: clientId,
  config: {
    rpc: {
      // Add RPC configuration if needed
    },
  },
});
