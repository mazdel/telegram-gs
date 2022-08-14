  /**
   * initiate the library
   * @param {String} token your telegram bot's token
   * @param {String} updateMethod update method which gonna be used (webhook | trigger)
   * @returns {Void}
   */
  function bot(token,updateMethod='trigger',event={}){
    this.token = token;
    this.updateMethod=updateMethod; // or "webhook"
    this.webHookUpdates = JSON.parse((event.postData?.contents)||'{}');
    
    this.botId = token.split(":")[0];
    this.session = PropertiesService.getUserProperties();
    return this;
  }
  /**
   * experts only,
   * send raw request to telegram api based on https://core.telegram.org/bots/api
   * @param {String} method the method of request is used
   * @param {Object} data data to be sent with the request
   * @returns {Object}
   */
  bot.prototype.request = async function(method,data={}){
    const options = {
      'method' : 'post',
      'contentType': 'application/json',
      'payload' : JSON.stringify(data)
    };
    const response = JSON.parse(UrlFetchApp.fetch(`https://api.telegram.org/bot${this.token}/${method}`,options).getContentText());
    return response.result
  }

  /**
   * send message to chat_id
   * @param {Int} chat_id Chat id of a telegram user
   * @param {String} text Message to be sent
   * @param {String} parse_mode Parse mode of message which will be sent. default is HTML. (see more at https://core.telegram.org/bots/api#formatting-options )
   * @param {Object} params Additional parameters, see https://core.telegram.org/bots/api#sendmessage
   * @returns {Object}
   */
  bot.prototype.sendMessage = async function(chat_id, text, parse_mode = 'HTML',params={} ){
    const data = { chat_id:chat_id, text : text, parse_mode:parse_mode , ...params }
    const response = await this.request('sendMessage',data);
    return response;
  }
  /**
   * send photo to chat_id
   * @param {Int} chat_id Chat id of a telegram user
   * @param {String} photo Photo to send. see explanation at https://core.telegram.org/bots/api#sending-files
   * @param {String} parse_mode Parse mode of message which will be sent. default is HTML. (see more at https://core.telegram.org/bots/api#formatting-options )
   * @param {Object} params Additional parameters, see https://core.telegram.org/bots/api#sendphoto
   * @returns {Object}
   */
  bot.prototype.sendPhoto = async function(chat_id,photo,parse_mode='HTML',params={}){
    const data = { chat_id:chat_id, photo:photo, parse_mode:parse_mode , ...params }
    const response = await this.request('sendPhoto',data);
    return response;
  }
  /**
   * send document to chat_id
   * @param {Int} chat_id Chat id of a telegram user
   * @param {String} document Document to send. see explanation at https://core.telegram.org/bots/api#sending-files
   * @param {String} parse_mode Parse mode of message which will be sent. default is HTML. (see more at https://core.telegram.org/bots/api#formatting-options )
   * @param {Object} params Additional parameters, see https://core.telegram.org/bots/api#senddocument
   * @returns {Object}
   */
  bot.prototype.sendDocument = async function(chat_id,document,parse_mode='HTML',params={}){
    const data = { chat_id:chat_id, document:document, parse_mode:parse_mode , ...params }
    const response = await this.request('sendDocument',data);
    return response;
  }
  /**
   * send video to chat_id
   * @param {Int} chat_id Chat id of a telegram user
   * @param {String} video Video to send. see explanation at https://core.telegram.org/bots/api#sending-files
   * @param {String} parse_mode Parse mode of message which will be sent. default is HTML. (see more at https://core.telegram.org/bots/api#formatting-options )
   * @param {Object} params Additional parameters, see https://core.telegram.org/bots/api#sendvideo
   * @returns {Object}
   */
  bot.prototype.sendVideo = async function(chat_id,video,parse_mode='HTML',params={}){
    const data = { chat_id:chat_id, video:video, parse_mode:parse_mode , ...params }
    const response = await this.request('sendDocument',data);
    return response;
  }
  /**
   * send location to chat_id
   * @param {Int} chat_id Chat id of a telegram user
   * @param {Array} location Array of latitude and longitude of a location to send. 
   * @param {String} parse_mode Parse mode of message which will be sent. default is HTML. (see more at https://core.telegram.org/bots/api#formatting-options )
   * @param {Object} params Additional parameters, see https://core.telegram.org/bots/api#sendlocation
   * @returns {Object}
   */
  bot.prototype.sendLocation = async function(chat_id,location,parse_mode='HTML',params={}){
    const [latitude,longitude,...restArray] = location;
    const data = { 
      chat_id:chat_id, 
      latitude:latitude, 
      longitude:longitude, 
      parse_mode:parse_mode, 
      ...params,
      }
    const response = await this.request('sendLocation',data);
    return response;
  }
  /**
   * send contact to chat_id
   * @param {Int} chat_id Chat id of a telegram user
   * @param {String} phone_number Contact's phone number. 
   * @param {String} first_name Contact's first name. 
   * @param {String} parse_mode Parse mode of message which will be sent. default is HTML. (see more at https://core.telegram.org/bots/api#formatting-options )
   * @param {Object} params Additional parameters, see https://core.telegram.org/bots/api#sendlocation
   * @returns {Object}
   */
  bot.prototype.sendContact = async function(chat_id,phone_number,first_name,parse_mode='HTML',params={}){
    
    const data = { 
      chat_id:chat_id, 
      phone_number:phone_number, 
      first_name:first_name, 
      parse_mode:parse_mode, 
      ...params,
      }
    const response = await this.request('sendContact',data);
    return response;
  }

  /**
   * manually get updates from api. it won't work if you already set the webhook
   * see more at https://core.telegram.org/bots/api#getupdates
   * @param {Object} data data to be sent
   * @returns {Object}
   */
  bot.prototype.getUpdates= async function(data={}){
    if(this.updateMethod=="webhook"){
      return [this.webHookUpdates];
    }else{
    let {offset,allowed_updates,...restData} = data
    offset=offset||1;
    allowed_updates=allowed_updates||['message','callback_query'];
    const payload = {
      offset:offset,
      allowed_updates:allowed_updates,
      ...restData};
    const responses = await this.request('getUpdates',payload);
    
    return responses;
    }
  }
  /**
   * get basic info about a file and prepare it for downloading
   * see more at https://core.telegram.org/bots/api#getfile
   * @param {String} fileId id of a telegram file
   * @returns {Object}
   */
  bot.prototype.getFile = async function(fileId){
    const payload = {file_id:fileId};
    const responses = await this.request('getFile',payload);
    return responses;
  }
  /**
   * get basic info about a file and the download link. link expired in 1 hour
   * @param {String} fileId id of a telegram file
   * @returns {Object}
   */
  bot.prototype.getFileLink = async function(fileId){
    const responses = await this.getFile(fileId);
    const file_link = `https://api.telegram.org/file/bot${this.token}/${responses.file_path}`;
    return {...responses,file_link};
  }
  /**
   * get bot webhook info
   * @param {Array} drop_pending_updates drop pending updates default (false)
   * @param {Object} params Additional parameters. https://core.telegram.org/bots/api#deletewebhook
   * @returns {Object}
   */
  bot.prototype.webhookInfo = async function(){
    const result = await this.request('getWebhookInfo');
    
    return result;
  }

  /**
   * set bot commands description
   * @param {Array} commands Array of commands and it's description
   * @param {Object} params Additional parameters. https://core.telegram.org/bots/api#setmycommands
   * @returns {Object}
   */
  bot.prototype.setCommands = async function(commands,params={}){
    const data = {
      commands:commands,
      ...params,
    }
    const result = await this.request('setMyCommands',data);
    return result;
  }
  /**
   * set bot webhook
   * @param {Array} url Webhook https url
   * @param {Object} params Additional parameters. https://core.telegram.org/bots/api#setwebhook
   * @returns {Object}
   */
  bot.prototype.setWebhook = async function(url,params={}){
    const removeHook = await this.removeWebhook();
    
    let { allowed_updates, ...restParams} = params;

    allowed_updates = allowed_updates||['message','callback_query'];
    
    const payload = {
      url: url,
      allowed_updates: allowed_updates,
      ...restParams,
    }
    const result = await this.request('setWebhook',payload);
    console.log("webhook has been set", result);
    return result;
  }
  
  /**
   * remove bot webhook
   * @param {Array} drop_pending_updates drop pending updates default (false)
   * @param {Object} params Additional parameters. https://core.telegram.org/bots/api#deletewebhook
   * @returns {Object}
   */
  bot.prototype.removeWebhook = async function(drop_pending_updates=false){
  
    const payload = {
      drop_pending_updates:false,
    }

    const result = await this.request('deleteWebhook',payload);
    console.log("webhook removed", result);
    return result;
  }

  /**
   * delete message
   * @param {Object} message message object to be deleted
   * @param {Object} params Additional parameters. https://core.telegram.org/bots/api#deletemessage
   * @returns {Boolean}
   */
  bot.prototype.deleteMessage = async function(message,params={}){
    const payload = {
      chat_id     :message.chat.id,
      message_id  :message.message_id,
      ...params,
    };
    const result = await this.request('deleteMessage',payload);
    return result;
  }
  /**
   * edit message
   * @param {Object} message message object to be edited
   * @param {String} text new text of the message
   * @param {String} parse_mode Parse mode of message which will be sent. default is HTML. (see more at https://core.telegram.org/bots/api#formatting-options )
   * @param {Object} params Additional parameters. https://core.telegram.org/bots/api#editmessagetext
   * @returns {Boolean}
   */
  bot.prototype.editMessage = async function(message,text,parse_mode='HTML',params={}){
    const payload = {
      chat_id     : message.chat.id,
      message_id  : message.message_id,
      text        : text,
      parse_mode  :parse_mode,
      ...params,
    };
    const result = await this.request('editMessageText',payload);
    return result;
  }

  /**
   * do something when an callback_query is received
   * @param {String} data callback data you want to catch.
   * @param {Function} doSomething function you want to run when it catch the data
   * @returns {Object}
   */
  bot.prototype.onCallbackData = async function(data,doSomething){
    const initResponses = await this.getUpdates();
    
    const chatId = (initResponses[0].callback_query?.message.chat.id)?initResponses[0].callback_query.message.chat.id:initResponses[0].message.chat.id;
    const lastUpdateId = this.session.getProperty(`${chatId}--${this.botId}`); 
    // const lastUpdateId = this.session.getProperty(`${chatId}`);
    const responses = await this.getUpdates({offset:lastUpdateId});
    
    return responses.map(response=>{
      if(response.callback_query?.message.chat.id && lastUpdateId < response.update_id ){
        
        const rgx = new RegExp(`${data}`,"ig");
        const responseData = response.callback_query?.data;
        if(rgx.test(responseData)){
          this.session.setProperty([`${response.callback_query.message.chat.id}--${this.botId}`], `${response.update_id}`)
          this.session.setProperty('lastUpdate',`${response.update_id}`)
          return doSomething(response);
        }
      }
    })
  }
  /**
   * do something when a message (or which contains specified text) is received
   * @param {String} text (optional) specified text.
   * @param {Function} doSomething function you want to run when it catch the message
   * @returns {Object}
   */
  bot.prototype.onMessage= async function(doSomething,text=null){
    const initResponses = await this.getUpdates();
    const chatId = (initResponses[0]?.message.chat.id)?initResponses[0]?.message.chat.id:initResponses[0]?.callback_query.message.chat.id;
    const lastUpdateId = this.session.getProperty(`${chatId}--${this.botId}`); 
    // const lastUpdateId = this.session.getProperty(`${chatId}`);
    const responses = await this.getUpdates({offset:lastUpdateId});

    const result = responses.map((response)=>{
      const message = response.message.text
      if(!message) return false;
      if(response.message.chat.id && lastUpdateId < response.update_id ){
        
        if(text){
          const rgx = new RegExp(`.*${text}.*`,"ig")
          if(rgx.test(message)){
            this.session.setProperty([`${chatId}--${this.botId}`], `${response.update_id}`) 
            // this.session.setProperty([response.message.chat.id], `${response.update_id}`)
            this.session.setProperty('lastUpdate',`${response.update_id}`)
            return doSomething(response);
          }
          return false;
        }
        this.session.setProperty([`${chatId}--${this.botId}`], `${response.update_id}`) 
            // this.session.setProperty([response.message.chat.id], `${response.update_id}`)
        this.session.setProperty('lastUpdate',`${response.update_id}`)
        return doSomething(response);
      }
      return false
    })
    // return result;
  }
  /**
   * do something when a message (or which contains specified text) is received
   * @param {String} text (optional) specified text.
   * @param {Function} doSomething function you want to run when it catch the message
   * @returns {Object}
   */
  bot.prototype.onReply= async function(doSomething,text=null){
    const initResponses = await this.getUpdates();
    const chatId = (initResponses[0]?.message.chat.id)?initResponses[0]?.message.chat.id:initResponses[0]?.callback_query.message.chat.id;
    const lastUpdateId = this.session.getProperty(`${chatId}--${this.botId}`); 
    // const lastUpdateId = this.session.getProperty(`${chatId}`);
    const responses = await this.getUpdates({offset:lastUpdateId});

    const result = responses.map((response)=>{
      const message = response.message.reply_to_message;
      if(!message) return false;
      if(response.message.chat.id && lastUpdateId < response.update_id ){
        if(text){
          const rgx = new RegExp(`.*${text}.*`,"ig")
          if(rgx.test(message)){
            this.session.setProperty([`${chatId}--${this.botId}`], `${response.update_id}`) 
            // this.session.setProperty([response.message.chat.id], `${response.update_id}`)
            this.session.setProperty('lastUpdate',`${response.update_id}`)
            return doSomething(response);
          }
          return false;
        }
        this.session.setProperty([`${chatId}--${this.botId}`], `${response.update_id}`) 
            // this.session.setProperty([response.message.chat.id], `${response.update_id}`)
        this.session.setProperty('lastUpdate',`${response.update_id}`)
        return doSomething(response);
      }
      return false
    })
    // return result;
  }
  /**
   * do something when a command is received
   * @param {String} command your bot command.
   * @param {Function} doSomething function you want to run when it catch the command
   * @returns {Object}
   */
  
  bot.prototype.onCommand= async function(command,doSomething){
    
    const initResponses = await this.getUpdates();
    const chatId = (initResponses[0]?.message.chat.id)?initResponses[0]?.message.chat.id:initResponses[0]?.callback_query.message.chat.id;
    const lastUpdateId = this.session.getProperty(`${chatId}--${this.botId}`); // 
    // const lastUpdateId = this.session.getProperty(`${chatId}`);
    const responses = await this.getUpdates({offset:lastUpdateId});
    // https://developers.google.com/apps-script/guides/properties    
    
    const rgx = new RegExp(`^/${command}(\s.*)?`,"ig");

    const result = responses.map((response)=>{
      const message = response.message?.text;
      // console.log(response);
      if(!!(response.message.chat.id) && lastUpdateId < response.update_id ){
        if(rgx.test(message)){
          this.session.setProperty([`${chatId}--${this.botId}`], `${response.update_id}`) 
            // this.session.setProperty([response.message.chat.id], `${response.update_id}`)
          this.session.setProperty('lastUpdate',`${response.update_id}`)
          return doSomething(response);
        }
        return false;
      }
    })
  }
  /**
   * do something when a photo (or which contains specified caption) is received
   * @param {String} text (optional) specified caption.
   * @param {Function} doSomething function you want to run when it catch the photo
   * @returns {Object}
   */
  bot.prototype.onPhoto= async function(doSomething,text=null){
    const initResponses = await this.getUpdates();
    const chatId = (initResponses[0]?.message.chat.id)?initResponses[0]?.message.chat.id:initResponses[0]?.callback_query.message.chat.id;
    const lastUpdateId = this.session.getProperty(`${chatId}--${this.botId}`); 
    // const lastUpdateId = this.session.getProperty(`${chatId}`);
    const responses = await this.getUpdates({offset:lastUpdateId});
    const result = responses.map((response)=>{
      const photo = response.message.photo
      if(!photo) return false;
      const caption = response.message.caption;

      if(response.message.chat.id && lastUpdateId < response.update_id ){
        if(text){
          const rgx = new RegExp(`.*${text}.*`,"ig")
          if(rgx.test(caption)){
            this.session.setProperty([`${chatId}--${this.botId}`], `${response.update_id}`) 
            // this.session.setProperty([response.message.chat.id], `${response.update_id}`)
            this.session.setProperty('lastUpdate',`${response.update_id}`)
            return doSomething(response);
          }
          return false;
        }
        this.session.setProperty([`${chatId}--${this.botId}`], `${response.update_id}`) 
            // this.session.setProperty([response.message.chat.id], `${response.update_id}`)
        this.session.setProperty('lastUpdate',`${response.update_id}`)
        return doSomething(response);
      }
      return false
    })
    
  }
  /**
   * do something when a document (or which contains specified caption) is received
   * @param {String} text (optional) specified caption.
   * @param {Function} doSomething function you want to run when it catch the photo
   * @returns {Object}
   */
  bot.prototype.onDocument= async function(doSomething,text=null){
    const initResponses = await this.getUpdates();
    const chatId = (initResponses[0]?.message.chat.id)?initResponses[0]?.message.chat.id:initResponses[0]?.callback_query.message.chat.id;
    const lastUpdateId = this.session.getProperty(`${chatId}--${this.botId}`); 
    // const lastUpdateId = this.session.getProperty(`${chatId}`);
    const responses = await this.getUpdates({offset:lastUpdateId});
    const result = responses.map((response)=>{
      
      const document = response.message.document
      if(!document) return false;
      const caption = response.message.caption;

      if(response.message.chat.id && lastUpdateId < response.update_id ){
        if(text){
          const rgx = new RegExp(`.*${text}.*`,"ig")
          if(rgx.test(caption)){
            this.session.setProperty([`${chatId}--${this.botId}`], `${response.update_id}`) 
            // this.session.setProperty([response.message.chat.id], `${response.update_id}`)
            this.session.setProperty('lastUpdate',`${response.update_id}`)
            return doSomething(response);
          }
          return false;
        }
        this.session.setProperty([`${chatId}--${this.botId}`], `${response.update_id}`) 
            // this.session.setProperty([response.message.chat.id], `${response.update_id}`)
        this.session.setProperty('lastUpdate',`${response.update_id}`)
        return doSomething(response);
      }
      return false
    })
    
  }

