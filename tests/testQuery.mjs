import dotenv from "dotenv";
dotenv.config();

const API_BASE_URL = "https://nebula-api.thirdweb.com";
const SECRET_KEY = process.env.NEBULA_API_KEY;


let sessionId = null;

async function apiRequest(endpoint, method, body = {}) {
    console.log(`Calling API: ${API_BASE_URL}${endpoint}`); // Debugging
    console.log("Request Body:", body); // Debugging

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            "x-secret-key": SECRET_KEY,
        },
        body: Object.keys(body).length ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const errorText = await response.text(); // Get full error details
        console.error("API Response Error:", errorText); // Debugging
        throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
}

async function createSession(title = "Smart Contract Explorer") {
    const response = await apiRequest("/session", "POST", { title });
    sessionId = response.result.id;
    console.log(`Session created: ${sessionId}`); // Debugging
}


async function queryContract(contractAddress, chainId) {
    if (!sessionId) {
        await createSession(); // Ensure session exists
    }

    const message = `Fetch details for contract ${contractAddress} on chain ${chainId}`;
    const requestBody = {
        message,
        session_id: sessionId,
        context_filter: {
            chain_ids: [chainId.toString()], // Convert chainId to a string
            contract_addresses: [contractAddress],
        },
    };

    console.log("Request Body:", requestBody); // Debugging
    const response = await apiRequest("/chat", "POST", requestBody);

    return response.message; // Contract details as a response
}

async function executeCommand(message, signerWalletAddress, userId = "default-user", stream = false) {
    const requestBody = {
        message,
        user_id: userId,
        stream,
        execute_config: {
            mode: "client",
            signer_wallet_address: signerWalletAddress,
        },
    };

    console.log("execute command request body", requestBody);

    const response = await apiRequest("/execute", "POST", requestBody);
    console.log("execute command response", response);
    return response;
}

// Run test
(async () => {
    try {
        const contractAddress = "0xce928b38672Fb7B88CBF49E2CfB3Ab166a8614A5"; // Replace with a real contract address
        const chainId = 11155111; // Replace with the chain ID you want to test (e.g., 1 for Ethereum Mainnet)

        const result = await queryContract(contractAddress, chainId);
        console.log("Query Result:", result);
    } catch (error) {
        console.error("Error:", error);
    }
})();
