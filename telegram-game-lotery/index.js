const { Account } = require("@tonclient/appkit");
const { TonClient, signerKeys } = require("@tonclient/core");
const { libNode } = require("@tonclient/lib-node");
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app     = express();


const { GamecontractContract } = require("./GamecontractContract.js")
const { GiverContract } = require("./GiverContract.js")

const giver_keys ={
    "public": `{your giver public key}`,
    "secret": `{your giver secret key}`
}

const TOKEN = '{your telegram bot token}';

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


  


bot.on('text', async (msg) =>{
    console.log(msg.text);
    if (msg.text.toLowerCase() == 'привет'){
      await bot.sendMessage(msg.chat.id, `Привет, ${msg.chat.first_name}`)
    }
    if (msg.text.toLowerCase() == 'начать'){
        await game_create(msg);
    }
    if (msg.text.toLowerCase() == 'правила'){
        await bot.sendMessage(msg.chat.id, `Вам будет предложено написать любое количество чисел от 1 до 20. Ограничение на количество чисел - 20.`)
        await bot.sendMessage(msg.chat.id, `Далее бот рандомно выберет такое же количество чисел, что ввели вы, в том же диапазоне, и сравнит с числами, которые ввели вы. Если совпадает хотя бы одно число, то вы победили в игре, и на ваш счёт придёт сумма равная произведению вашей ставки на коэффициент. В случае, если даже одно число не совпадает, вы проигрываете игру и ваша ставка идёт на счёт гивера.`)
        await bot.sendMessage(msg.chat.id, `Внимание! Бот находится в разработке, поэтому всё работает в тестовой сети EVERSCALE, не перечисляйте EVER с main сети! А также, будьте внимательны с вводом данных, так как бот ещё не умеет обрабатывать все ошибки, и вы можете не получить выигрыш!!!`);
    }

    if (msg.text.toLowerCase() == '/start') {
        await bot.sendMessage(msg.chat.id, `Доступные команды:
        начать - начать игру
        привет - поприветствовать бота
        правила - правила игры
        команды - выводит список команд
        остальные команды станут доступны после начала игры`)
    }

    if (msg.text.toLowerCase() == 'команды') {
        await bot.sendMessage(msg.chat.id, `Доступные команды:
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
        address: "{your giver address}",
        signer: signerKeys(giver_keys),
        client
    });
    console.log(`адрес контракта: ${await gameAcc.getAddress()}`)
    console.log(`адрес гивера: ${await giver.getAddress()}`)
    console.log(`баланс гивера: ${await giver.getBalance()}`)


    const address = await gameAcc.getAddress();
    console.log(`Future address of the contract will be: ${address}`);



    let response = await giver.run("sendValue", {dest:address.toString(),value:100000000});
    console.log('succssessful')

    let giver_balance = await giver.getBalance();
    console.log(`баланс гивера: ${giver_balance}`)

    
    await gameAcc.deploy();
    console.log(`Your gamecontract was deployed at address: ${address}`);
    console.log(`баланс контракта: ${await gameAcc.getBalance()}`)











    await bot.sendMessage(msg.chat.id, `Пожалуйста, переведите на адрес в следующем сообщении любое количество EVER (очень желательно меньше 5, так как могут возниктнуть ошибки)`);
    await bot.sendMessage(msg.chat.id, `${address}`);
    await bot.sendMessage(msg.chat.id, `После оплаты введите в чат ключевое слово "готово" для продолжения игры`);









    bot.on('text', async (msg) =>{

            if (msg.text.toLowerCase() == "готово"){
                await gameAcc.refresh();
                if (parseInt(await gameAcc.getBalance(), 16) <= 100000000){
                    await bot.sendMessage(msg.chat.id, "На ваш ещё не поступили средства. Подождите немного и напишите \"готово\"");
                }
                else {
                    await gaming(msg, gameAcc, giver);
                }
                

                return
            }

            if (msg.text.toLowerCase() == "выйти"){
                await bot.sendMessage(msg.chat.id, `Ок, игра закончена, хорошего дня!`);
                return
            }

            if (msg.text.toLowerCase() == "вернуть деньги"){
                await refundTokens(msg, gameAcc, giver);
                return
            }
            if (msg.text.toLowerCase() == "команды") {
                await bot.sendMessage(msg.chat.id, `Доступные команды:
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
     try {
        console.log("Hello TON! Now we will create your game-contract");
        await main_create(client,msg);
        //process.exit(0);
     } catch (error) {
         if (error.code === 504) {
             console.error(`Network is inaccessible`);
         } else {
             console.error(error);
         }
     }
    client.close();
};



async function refundTokens(msg, gameAcc, giver){
    
    await bot.sendMessage(msg.chat.id, `Ок, введите адрес на который будут возвращены деньги (постарайтесь ввести верный адрес, иначе деньги придут не туда и возможности их вернуть не будет!)`);
    let flag2 = true
    bot.on('text', async (msg) => {
        if (msg.text.length == 66 && flag2){
            flag2=false;
            await gameAcc.refresh();
            let gamecontract_balance = await gameAcc.getBalance();
            console.log(`сумма возврата ${parseInt(gamecontract_balance, 16)}`)
            response = await gameAcc.run("sendTransactionAndDeleteContract", {dest:msg.text});
            await bot.sendMessage(msg.chat.id, `На адрес ${msg.text} было отправлено ${parseInt(gamecontract_balance, 16) / 1000000000} EVER`);
            return
        }
    })
    
    return
}



async function gaming(msg, gameAcc, giver) {
    await gameAcc.refresh();
    let gamecontract_balance = await gameAcc.getBalance();
    let address = await gameAcc.getAddress();

    await gameAcc.refresh();
    gamecontract_balance = await gameAcc.getBalance();

        if (parseInt(gamecontract_balance, 16) > 300000000){
            let user_input = '';
            await bot.sendMessage(msg.chat.id, `Хорошо, теперь придумайте и напишите числа от 1 до 20 ЧЕРЕЗ ПРОБЕЛ. Количество чисел не превышает 20, но чем меньше чисел, тем больше коэффициент. Порядок чисел не важен! Числа не должны повторяться.`);
            await bot.sendMessage(msg.chat.id, "Пример ввода:");
            await bot.sendMessage(msg.chat.id, `6 10 15 19 1 8`);
            

            let flag=true;
            bot.on('text', async (msg) => {
                
                if (flag){
                    await bot.sendMessage(msg.chat.id, `Обрабатываем введённые вами данные...`);
                    let user_numbers = msg.text.split(' ');
                    flag=false;
                    
                    try{
                        let k = 0;


                        let user_numbers_changed = [];
                        for (let item of user_numbers){
                            await user_numbers_changed.push(+item);
                        }


                        let bot_numbers = [];

                        for (let i=0; i<user_numbers.length; i++){
                            let random_number = Math.floor(Math.random() * (20 - 1 + 1)) + 1;

                            if (bot_numbers.indexOf(random_number)== -1){
                                bot_numbers.push(random_number)
                            }
                            else {
                                while (true){
                                    random_number = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
                                    if (bot_numbers.indexOf(random_number) == -1){
                                        bot_numbers.push(random_number);
                                        break;
                                    }
                                    else{
                                        continue;
                                    }
                                }
                            }
                        }

                        await user_numbers_changed.sort(function (a, b) {
                            return a - b;
                        });

                        await bot_numbers.sort(function (a, b) {
                            return a - b;
                        });


                        await bot.sendMessage(msg.chat.id, `Рандомные числа бота: ${bot_numbers.join(' ')}`);
                        await bot.sendMessage(msg.chat.id, `Ваш ввод: ${user_numbers_changed.join(' ')}`);

                        



                        let guessed = 0;

                        for (let i=0; i<bot_numbers.length; i++){
                            
                            if (user_numbers_changed.includes(bot_numbers[i])){
                                await guessed++;
                            }
                            await console.log(`число бота : ${ bot_numbers[i]}, ваше число ${user_numbers_changed[i]}, ${user_numbers_changed[i] == bot_numbers[i]?"совпадают":"не совпадают"},отгадано ${guessed}`)
                        }



                        await bot.sendMessage(msg.chat.id, `Отгадано - ${guessed} чисел`);




                        k = (1 / (bot_numbers.length * 0.05)) * (guessed / bot_numbers.length);

                        await bot.sendMessage(msg.chat.id, `Ваш коэффициент выигрыша - ${k}`);






                        



                        


                        

                        if (guessed >=1 ) {
                            let spisanie = Math.floor(Math.abs(Math.floor(parseInt(gamecontract_balance, 16) * k) - gamecontract_balance));
                            if (k>=1){
                                gamecontract_balance = await gameAcc.getBalance();
                                await bot.sendMessage(msg.chat.id, `Поздравляю, вы победили. Ваш выигрыш - ${(parseInt(gamecontract_balance, 16) / 1000000000) * k} EVER`);
                                console.log(`dest: ${address.toString()}, value: ${Math.floor(parseInt(gamecontract_balance, 16) * k)}`)
                                console.log(spisanie);
                                if (spisanie <= 80000000){
                                    console.log("деньги на геймконтракте остаются без изменений")
                                    await bot.sendMessage(msg.chat.id, `Подождите, скоро вам будут перечислен выигрыш...`);
                                    await refundTokens(msg,gameAcc,giver);
                                    return true;
                                }
                                else {
                                    console.log(`адрес смарт контракта на который с гивера перечислят сумму ${address}`)
                                    response = await giver.run("sendTransaction", {dest:address.toString(), value: +spisanie});
                                    console.log("деньги перечислены на геймконтракт")
                                    await bot.sendMessage(msg.chat.id, `Подождите, скоро вам будут перечислен выигрыш...`);
                                    await refundTokens(msg,gameAcc,giver);
                                    return true;
                                }
                                
                            }
                            else {
                                gamecontract_balance = await gameAcc.getBalance();
                                await bot.sendMessage(msg.chat.id, `Поздравляю, вы победили. Ваш выигрыш - ${(parseInt(gamecontract_balance, 16) / 1000000000) * k} EVER`);
                                console.log(`dest: ${await giver.getAddress()}, value: ${spisanie}`);
                                if (spisanie <= 80000000){
                                    console.log("деньги на геймконтракте остаются без изменений")
                                    await bot.sendMessage(msg.chat.id, `Подождите, скоро вам будут перечислен выигрыш...`);
                                    await refundTokens(msg,gameAcc,giver);
                                    return true;
                                }
                                else {
                                    await gameAcc.run("sendValue", {dest: "{your giver address}", value: spisanie});
                                    console.log("деньги перечислены с геймконтракта на гивера");
                                    await bot.sendMessage(msg.chat.id, `Подождите, скоро вам будут перечислен выигрыш...`);
                                    await refundTokens(msg,gameAcc,giver);
                                    return true;
                                }
                                
                            }
                            
                        }

                        else {
                            await gameAcc.run("sendTransactionAndDeleteContract", {dest:"{your giver address}"});
                            await bot.sendMessage(msg.chat.id, `К сожалению, вы проиграли, попробуйте ещё раз`);
                            console.log('деньги списаны на гивер');


                            return true
                        }


                    }
                    catch (err){
                        await bot.sendMessage(msg.chat.id, `Возникла ошибка в ходе игры или перечисления средств. Проверьте введённые данные и напишите "готово"`);
                        console.error(err)
                        return false
                    }
                }
            
        })
        
    }

    
    
}
