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
At first, we need to create a function that will be triggered by GAS trigger, as simply like this
```
const trigger = () => {
  const botApiKey = '50123123123:AAGxxxxYYYYzzzzzzzWWWW';
  const bot = new TelegramGS.bot(`${botApiKey}`);
  
  bot.onCommand('start',async (data)=>{
    const message = `hello ${ctx.message.chat.first_name}`;
    await bot.sendMessage(ctx.message.chat.id,message,'HTML',additionalParams);
  });
}
```
then we can add the `trigger()` function to GAS trigger by accessing it at `GAS editor left menu -> Triggers -> Add Trigger`, and we can set the timer to every minutes so we can get the response more soon

### Using Webhook
Different from before, now we will use the default `doPost()` function of GAS. fyi, it has a use to get any HTTP POST data to your web app. read it more [here](https://developers.google.com/apps-script/guides/triggers?hl=en#dogete_and_doposte) and [here](https://developers.google.com/apps-script/guides/web?hl=en#requirements_for_web_apps). 

Simply, we put call the Bot library within `doPost()` function
```
const doPost = (e) => {
  const botApiKey = '50123123123:AAGxxxxYYYYzzzzzzzWWWW';
  const bot = new TelegramGS.bot(`${botApiKey}`);
}
```


