# telegram-gs
[![License](https://img.shields.io/github/license/mazdel/telegram-gs?style=flat-square)](https://github.com/mazdel/telegram-gs/blob/main/LICENSE)
![Language](https://img.shields.io/github/languages/top/mazdel/telegram-gs?style=flat-square)

Telegram Bot API for Google App Script

## Installation
There are two options of installation we can use and they are...

1. Add already existing library to your Google Apps Script project, 

`Library ID : 1yjQjHBetnyA5N-6GaSo2paLt68N6-vZ1Bbug5Afnk77nJ32vsVJuGmKQ`

2. Or we can copy scripts on this repository to our existing Google Apps Script project

## Bot Initialization

We also have two methods to initialize the bot as divided by how the bot can get message updates,

### Using Google Apps Script (GAS) trigger
At first, we need to create a function which will be triggered by GAS periodically, as simply like this
```
const trigger = () => {
  const botApiKey = '50123123123:AAGxxxxYYYYzzzzzzzWWWW';
  const bot = new TelegramGS.bot(`${botApiKey}`);
  
  bot.onCommand('start',async (data)=>{
    const message = `hello ${data.message.chat.first_name}`;
    await bot.sendMessage(data.message.chat.id,message,'HTML');
  });
}
```
next, we can add the `trigger()` function to GAS trigger service by accessing it at `GAS editor left menu -> Triggers -> Add Trigger`, set the timer to every minutes so we can get the response more soon.
and then, the function will periodically check if there are any updates on telegram's `getUpdates` endpoint.

### Using Webhook
Different from before, on this metod we gonna wait telegram to tell us any update they got and we will catch it by using the default `doPost()` function of GAS. fyi, it has a use to get any HTTP POST data to your web app. read it more [here](https://developers.google.com/apps-script/guides/triggers?hl=en#dogete_and_doposte) and [here](https://developers.google.com/apps-script/guides/web?hl=en#requirements_for_web_apps). 

Simply, we put every functions call the Bot library within `doPost(e)` function and pass the `e` parameter as a variable of bot constructor
```
const doPost = (e) => {
  const botApiKey = '50123123123:AAGxxxxYYYYzzzzzzzWWWW';
  const bot = new TelegramGS.bot(`${botApiKey}`,"webhook",e);
  bot.onCommand('start',async (data)=>{
    const message = `hello ${data.message.chat.first_name}`;
    await bot.sendMessage(data.message.chat.id,message,'HTML');
  });
}
```
and now we have to set our project web app url as webhook to the telegram by using `setWebhook` function. but before going into, we have to get our web app deployment url first and make sure our project can be accessed by everyone, read it at [Deploy a script as a web app](https://developers.google.com/apps-script/guides/web#deploy_a_script_as_a_web_app). 
```
const setWebhook = () => {
  const botApiKey = '50123123123:AAGxxxxYYYYzzzzzzzWWWW';
  const bot = new TelegramGS.bot(`${botApiKey}`);
  const webAppUrl = "https://script.google.com/macros/s/thisIsJustAnExample-useTheRealGeneratedUrlOnDeploymentMenu/exec"; //<-- just an example
  bot.setWebhook(webAppUrl);
  const result = bot.webhookInfo();
  console.log(result)
}
```
and run `setWebhook()` function within our GAS editor, it should return a JSON contain our webhook data

## How-To
These example are assuming we already initialize the `bot` by using one of [above](#bot-initialization) methods

#### Send Message
```
const chatId = 123123 //<--- receiver chat id
const message = `hello folks`;

bot.sendMessage(chatId,message,'HTML');
```
#### Catch a bot `start` command and send a response
```
bot.onCommand('start',async (data)=>{
  const message = `hello ${data.message.chat.first_name},`;
  await bot.sendMessage(data.message.chat.id,message,'HTML');
});
```
#### Send an Inline Keyboard Markup and Catch the data
```
bot.onCommand('start',async (data)=>{
  const message = `hello ${data.message.chat.first_name}, here is inline keyboard example`;
  const additionalParams={
    reply_markup:{
      inline_keyboard:[
        [{text:'inline key test 1',callback_data:'cb_test1'}],
        [{text:'inline key test 2',callback_data:'cb_test2'}],
      ],
    }
  }
  await bot.sendMessage(data.message.chat.id,message,'HTML',additionalParams);
});
bot.onCallbackData("cb_test1",async (data)=>{
  await bot.sendMessage(data.callback_query.message.chat.id, 'you clicked "inline key test 1"', 'HTML');
});
bot.onCallbackData("cb_test2",async (data)=>{
  await bot.sendMessage(data.callback_query.message.chat.id, 'you clicked "inline key test 2"', 'HTML');
});
```
more info about `additionalParams` at [telegram api documentation](https://core.telegram.org/bots/api#sendmessage)

## More Documentation
- [telegram-gs docs](https://mazdel.github.io/telegram-gs/)
