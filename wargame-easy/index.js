const { Account } = require("@tonclient/appkit");
const { TonClient, signerKeys } = require("@tonclient/core");
const { libNode } = require("@tonclient/lib-node");

const { WarriorContract } = require("./contracts/WarriorContract.js");
const { ArcherContract } = require("./contracts/ArcherContract.js");

TonClient.useBinaryLibrary(libNode);
(async () => {
    const client = new TonClient({
        network: {
            // Local TON OS SE instance URL here
            endpoints: ["http://localhost"]
        }
    });
    try {
        console.log("Hello localhost TON!");
        await main(client);
        process.exit(0);
    } catch (error) {
        if (error.code === 504) {
            console.error(`Network is inaccessible. You have to start TON OS SE using \`tondev se start\`.\n If you run SE on another port or ip, replace http://localhost endpoint with http://localhost:port or http://ip:port in index.js file.`);
        } else {
            console.error(error);
        }
    }
    client.close();
})();

async function main(client) {
    const keys1 = await TonClient.default.crypto.generate_random_sign_keys();
    const keys2 = await TonClient.default.crypto.generate_random_sign_keys();
    const keys3 = await TonClient.default.crypto.generate_random_sign_keys();
    const keys4 = await TonClient.default.crypto.generate_random_sign_keys();




    const warrior_player1 = new Account(WarriorContract, {
        signer: signerKeys(keys1),
        client,
    });

    const archer_player1 = new Account(ArcherContract, {
        signer: signerKeys(keys2),
        client,
    });





    const warrior_player1_address = await warrior_player1.getAddress();
    console.log(`Адрес воина игрока 1: ${warrior_player1_address}`);

    const archer_player1_address = await archer_player1.getAddress();
    console.log(`Адрес лучника игрока 1: ${archer_player1_address}`);





    await warrior_player1.deploy({ useGiver: true });
    console.log(`Воин игрока 1 был задеплоен на адрес: ${warrior_player1_address}`);

    await archer_player1.deploy({ useGiver: true });
    console.log(`Лучник игрока 1 был задеплоен на адрес: ${archer_player1_address}`);





    const warrior_player2 = new Account(WarriorContract, {
        signer: signerKeys(keys3),
        client,
    });

    const archer_player2 = new Account(ArcherContract, {
        signer: signerKeys(keys4),
        client,
    });





    const warrior_player2_address = await warrior_player2.getAddress();
    console.log(`Адрес воина игрока 2: ${warrior_player2_address}`);

    const archer_player2_address = await archer_player2.getAddress();
    console.log(`Адрес лучника игрока 2: ${archer_player2_address}`);





    await warrior_player2.deploy({ useGiver: true });
    console.log(`Воин игрока 2 был задеплоен на адрес: ${warrior_player2_address}`);

    await archer_player2.deploy({ useGiver: true });
    console.log(`Лучник игрока 2 был задеплоен на адрес: ${archer_player2_address}`);






    // Call `getAttackPower` function
    let warrior_player1_attackpower = 3;
    await warrior_player1.run("getAttackPower", {val:warrior_player1_attackpower});
    console.log(`Сила атаки воина игрока 1: ${warrior_player1_attackpower}`);

    let warrior_player2_attackpower = 3;
    await warrior_player2.run("getAttackPower", {val:warrior_player2_attackpower});
    console.log(`Сила атаки воина игрока 2: ${warrior_player2_attackpower}`);

    let archer_player1_attackpower = 2;
    await archer_player1.run("getAttackPower", {val:archer_player1_attackpower});
    console.log(`Сила атаки лучника игрока 1: ${archer_player1_attackpower}`);

    let archer_player2_attackpower = 2;
    await archer_player2.run("getAttackPower", {val:archer_player2_attackpower});
    console.log(`Сила атаки лучника игрока 2: ${archer_player2_attackpower}`);






    let warrior_player1_protectpower = 4;
    await warrior_player1.run("getProtectionPower", {val:warrior_player1_protectpower});
    console.log(`Сила защиты воина игрока 1: ${warrior_player1_protectpower}`);


    let warrior_player2_protectpower = 4;
    await warrior_player2.run("getProtectionPower", {val:warrior_player2_protectpower});
    console.log(`Сила защиты воина игрока 2: ${warrior_player2_protectpower}`);

    let archer_player1_protectpower = 3;
    await archer_player1.run("getProtectionPower", {val:archer_player1_protectpower});
    console.log(`Сила защиты лучника игрока 1: ${archer_player1_protectpower}`);

    let archer_player2_protectpower = 3;
    await archer_player2.run("getProtectionPower", {val:archer_player2_protectpower});
    console.log(`Сила защиты лучника игрока 2: ${archer_player2_protectpower}`);
}
