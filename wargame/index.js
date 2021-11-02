const { Account } = require("@tonclient/appkit");
const { TonClient, signerKeys } = require("@tonclient/core");
const { libNode } = require("@tonclient/lib-node");

TonClient.useBinaryLibrary(libNode);
(async () => {
    const client = new TonClient({
        network: {
            endpoints: ["http://localhost"]
        }
    });
    try {
        await main(client);
    } catch (err) {
        console.error(err);
    }
    client.close();
})();

async function main(client) {
    console.log((await client.client.version()).version);
}

