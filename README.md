# telegram-gs
Telegram API for Google App Script

## Installation
There are two options of installation we can use and they are...

1. Add already existing library to your Google Apps Script project, 

`Library ID : 1yjQjHBetnyA5N-6GaSo2paLt68N6-vZ1Bbug5Afnk77nJ32vsVJuGmKQ`

2. Or we can copy scripts on this repository to your existing Google Apps Script project

## Bot Initialization

We also have two methods to initialize the bot as divided by how the bot can read message updates,

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
Different from before, now we will wait telegram to tell us any update they got and we will catch it by using the default `doPost()` function of GAS. fyi, it has a use to get any HTTP POST data to your web app. read it more [here](https://developers.google.com/apps-script/guides/triggers?hl=en#dogete_and_doposte) and [here](https://developers.google.com/apps-script/guides/web?hl=en#requirements_for_web_apps). 

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


