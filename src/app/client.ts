
import { createThirdwebClient } from "thirdweb";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = "662a63dd0ecfac183d250631cc2138f5";

if (!clientId) {
  throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
  clientId: clientId,
  config: {
    rpc: {
      // Add RPC configuration if needed
    },
  },
});
