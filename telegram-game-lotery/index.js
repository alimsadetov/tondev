const { Account } = require("@tonclient/appkit");
const { TonClient, signerKeys } = require("@tonclient/core");
const { libNode } = require("@tonclient/lib-node");
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app     = express();

const { GamecontractContract } = require("./GamecontractContract.js")
const { GiverContract } = require("./GiverContract.js")

const giver_keys ={
    "public": "40c86bb01cd22ce5cc7561db755bea59c61164d1b77f2e5aaaf280b9eb89aa72",
    "secret": "99775e98fc37af1b8c7d8196778365b31808e383f4a5a55943af9cc52a5c8738"
}

const TOKEN = '2130514852:AAGkhVr-2NT2eeyozSnGT1d69bXpXoqQ9Tw';

const bot = new TelegramBot(TOKEN, {
    polling: true
  })
  
  
app.set('port', (process.env.PORT || 5000));
  
  //For avoidong Heroku $PORT error
app.get('/', function(request, response) {
      var result = 'App is running'
      response.send(result);
  }).listen(app.get('port'), function() {
      console.log('App is running, server is listening on port ', app.get('port'));
});


  


bot.on('text', (msg) =>{
    console.log(msg.text);
    if ((msg.text == 'привет') || (msg.text == 'Привет')){
      bot.sendMessage(msg.chat.id, `Привет, ${msg.chat.first_name}`)
    }
    if (msg.text == 'начать'){
        game_create(msg);
    }
    if (msg.text == 'правила'){
        bot.sendMessage(msg.chat.id, `Вам будет предложено написать любое количество чисел от 1 до 20. Ограничение на количество чисел - 20. В зависимости от количества введённых вами чисел будет вычислен коэффициент выигрыша ( минимальный коэффициент - 16, порядок ввода не важен )`)
        bot.sendMessage(msg.chat.id, `Далее бот рандомно выберет такое же количество чисел, что ввели вы, в том же диапазоне, и сравнит с числами, которые ввели вы. Если совпадают все числа, то вы победили в игре, и на ваш счёт придёт сумма равная произведению вашей ставки на коэффициент. В случае, если даже одно число не совпадает, вы проигрываете игру и ваша ставка идёт на счёт гивера.`)
        bot.sendMessage(msg.chat.id, `Внимание! Бот находится в разработке, поэтому всё работает в тестовой сети EVERSCALE, не перечисляйте EVER с main сети! А также, будьте внимательны с вводом данных, так как бот ещё не умеет обрабатывать все ошибки, и вы можете не получить выигрыш!!!`);
    }

    if (msg.text == '/start') {
        bot.sendMessage(msg.chat.id, `Доступные команды:
        начать - начать игру
        привет - поприветствовать бота
        правила - правила игры
        команды - выводит список команд
        остальные команды станут доступны после начала игры`)
    }

    if (msg.text == 'команды') {
        bot.sendMessage(msg.chat.id, `Доступные команды:
        начать - начать игру
        привет - поприветствовать бота
        правила - правила игры
        команды - выводит список команд
        остальные команды станут доступны после начала игры`)
    }
    
  });





TonClient.useBinaryLibrary(libNode);
async function main_create(client,msg) {
    await bot.sendMessage(msg.chat.id, `Пожалуйста, подождите, создаём смарт-контракт новой игры...`);
    // Generate an ed25519 key pair for new account
    const keys = await TonClient.default.crypto.generate_random_sign_keys();
    console.log(keys);

    const gameAcc = new Account(GamecontractContract, {
        signer: signerKeys(keys),
        client,
    });

    const giver = new Account(GiverContract,{
        address: "0:afde690d7e09f49ea2b971a0819c7b74e1c5f22c57f23e69c457f94e1f3d797d",
        signer: signerKeys(giver_keys),
        client
    });
    console.log(`адрес контракта: ${await gameAcc.getAddress()}`)
    console.log(`адрес гивера: ${await giver.getAddress()}`)
    console.log(`баланс гивера: ${await giver.getBalance()}`)

    //setGiverForClient(client, giver);

    const address = await gameAcc.getAddress();
    console.log(`Future address of the contract will be: ${address}`);

    // const givero = {
    //     address:"0:69622eb950a7b651b2da6133ce7e5eaee272dd57d609dac110152623cd7bff4e",

    // }

    let response = await giver.run("sendValue", {dest:address.toString(),value:300000000});
    console.log('succssessful')

    let giver_balance = await giver.getBalance();
    console.log(`баланс гивера: ${giver_balance}`)

    


    // Request contract deployment funds form a local TON OS SE giver
    // not suitable for other networks.
    // Deploy `hello` contract.
    await gameAcc.deploy();
    console.log(`Your gamecontract was deployed at address: ${address}`);
    console.log(`баланс контракта: ${await gameAcc.getBalance()}`)











    await bot.sendMessage(msg.chat.id, `Пожалуйста, переведите на адрес в следующем сообщении любое количество EVER меньше 5 EVER (это ограничение связано тем, что пока что мы не сможем оплатить выигрыш при ставке больше 5 EVER)`);
    await bot.sendMessage(msg.chat.id, `${address}`);
    await bot.sendMessage(msg.chat.id, `Внимание! Вы можете отправить любую сумму денег, но в случае если она превышает 5 EVER, в ставке будет участвовать 5 EVER. Если вы проиграете, внесённые деньги обратно вы не получите. В случае выигрыша сумма свыше 5 EVER не будет перемножаться на коэффициент.`);
    await bot.sendMessage(msg.chat.id, `После оплаты введите в чат ключевое слово "готово" для продолжения игры`);









    bot.on('text', (msg) =>{
            //console.log(`баланс контракта: ${gameAcc.getBalance()}`)
            if (msg.text == "готово"){
                let flag = !gaming(msg, gameAcc, giver);
                while (flag){
                    flag = !gaming(msg, gameAcc, giver);
                }
                return
            }

            if (msg.text == "выйти"){
                bot.sendMessage(msg.chat.id, `Ок, игра закончена, хорошего дня!`);
                return
            }

            if (msg.text == "вернуть деньги"){
                bot.sendMessage(msg.chat.id, `Ок, введите адрес на который будут возвращены деньги (постарайтесь ввести верный адрес, иначе деньги придут не туда и возможности их вернуть не будет!)`);
                refundTokens(msg, gameAcc, giver);
                return
            }
            if (msg.text == "команды") {
                bot.sendMessage(msg.chat.id, `Доступные команды:
                готово - вы пополнили смарт-контракт и готовы к игре
                выйти - выход из текущей игры
                вернуть деньги - выход из текущеё игры и возврат денег`)
            }
        })
    
}






async function game_create(msg) {
    const client = new TonClient({
        network: {
            endpoints: ["https://net.ton.dev/"]
        }
    });
    // try {
        console.log("Hello TON! Now we will create your game-contract");
        await main_create(client,msg);
        //process.exit(0);
    // } catch (error) {
    //     if (error.code === 504) {
    //         console.error(`Network is inaccessible`);
    //     } else {
    //         console.error(error);
    //     }
    // }
    client.close();
};



async function refundTokens(msg, gameAcc, giver){
    gameAcc.refresh();
    let gamecontract_balance = await gameAcc.getBalance();
    console.log(`баланс контракта: ${gamecontract_balance}`)
    let response = await gameAcc.run("sendTransactionAndDeleteContract", {dest:"0:afde690d7e09f49ea2b971a0819c7b74e1c5f22c57f23e69c457f94e1f3d797d"});
    console.log("деньги перекинуты с геймконтракта на гивер");

    bot.on('text', (msg) => {
        console.log(`сумма возврата ${parseInt(gamecontract_balance, 16)}`)
        response = giver.run("sendValue", {dest:msg.text, value: parseInt(gamecontract_balance, 16)});
        bot.sendMessage(msg.chat.id, `На адрес ${msg.text} было отправлено ${parseInt(gamecontract_balance, 16) / 1000000000} EVER`)
    })
}

async function gaming(msg, gameAcc, giver){
        await gameAcc.refresh();
        let gamecontract_balance = await gameAcc.getBalance();

    
        if (parseInt(gamecontract_balance, 16) < 300000000){
            bot.sendMessage(msg.chat.id, `Пополните, пожалуйста, счёт, и введите слово "готово" для продолжения, либо слово "выйти" для выхода из игры`);
            return false
        }

        if (parseInt(gamecontract_balance, 16) < 5300000000){
            let user_input = '';
            await bot.sendMessage(msg.chat.id, `Хорошо, теперь придумайте и напишите числа от 1 до 20 ЧЕРЕЗ ПРОБЕЛ. Количество чисел не превышает 20, но чем меньше чисел, тем больше возможный выигрыш. Порядок чисел не важен! Числа могут повторяться, но желательно чтобы не повторялись.`);
            await bot.sendMessage(msg.chat.id, "Пример ввода:");
            await bot.sendMessage(msg.chat.id, `6 10 15 19 1 8`);
            


            bot.on('text', (msg) => {
                bot.sendMessage(msg.chat.id, `Обрабатываем введённые вами данные...`);
                let user_numbers = msg.text.split(' ');
                
                try{
                    let count = Math.min(user_numbers.length, 20-user_numbers.length);
                    let summ = 0;
                    let addon = 20;
                    let k = 0;

                    for (let i=1; i<=count; i++){
                        summ+=addon;
                        addon-=1;
                    }


                    k = summ / count;

                    bot.sendMessage(msg.chat.id, `Ваш коэффициент - ${k}`);

                    let bot_numbers = [];

                    for (let i=0; i<user_numbers.length; i++){
                        let random_number = Math.floor(Math.random() * (20 - 1 + 1)) + 1;

                        if (bot_numbers.indexOf(random_number)== -1){
                            bot_numbers.push(random_number)
                        }
                        else {
                            while (true){
                                random_number = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
                                if (bot_numbers.indexOf(random_number)== -1){
                                    bot_numbers.push(random_number);
                                    break;
                                }
                                else{
                                    continue;
                                }
                            }
                        }
                    }

                    let user_numbers_changed = [];
                    for (let item of user_numbers){
                        user_numbers_changed.push(+item);
                    }


                    user_numbers_changed.sort(function (a, b) {
                        return a - b;
                    });

                    bot_numbers.sort(function (a, b) {
                        return a - b;
                    });



                    bot.sendMessage(msg.chat.id, `Ваш ввод: ${user_numbers_changed.join(' ')}`);

                    bot.sendMessage(msg.chat.id, `Рандомные числа бота: ${bot_numbers.join(' ')}`);


                    let win = true;

                    for (let i=0; i<user_numbers_changed.length; i++){
                        if (user_numbers_changed[i] !== bot_numbers[i]){
                            win = false
                            break;
                        }
                    }

                    if (win) {
                        bot.sendMessage(msg.chat.id, `Поздравляю, вы победили. Ваш выигрыш - ${(parseInt(gamecontract_balance, 16) / 1000000000) * k}`);

                        response = giver.run("sendValue", {dest:gameAcc.getAddress.toString(), value: (parseInt(gamecontract_balance, 16) * k)});
                        bot.sendMessage(msg.chat.id, `Подождите, скоро вам будут перечислен выигрыш...`);
                        refundTokens(msg,gameAcc,giver);
                        return true
                    }

                    else {
                        bot.sendMessage(msg.chat.id, `К сожалению, вы проиграли, попробуйте ещё раз`);

                        response = gameAcc.run("sendTransactionAndDeleteContract", {dest:"0:afde690d7e09f49ea2b971a0819c7b74e1c5f22c57f23e69c457f94e1f3d797d"});

                        return true
                    }


                }
                catch{
                    bot.sendMessage(msg.chat.id, `Проверьте введённые данные и напишите "готово"`);
                    return false
                }


            })
            
        }


}