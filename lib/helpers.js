//Helpers
const crypto = require('crypto');
const config = require('../config');
const https = require('https');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');

let helpers = {};

helpers.hash = function(pass){
  if(typeof(pass) !== 'string' && pass.length  < 1){
    return false;
  }
  
  let hash = crypto.createHmac('sha256',config.hashingSecret).update(pass).digest('hex');
  return hash;
};

//Parse a json string into an object
helpers.parseJsonToObject = function(str){
  try{
    let obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
};

helpers.createRandomString = function(len){
  len = typeof(len) == 'number' && len > 0 ? len : false;
  
  if(!len){
    return false;
  }
  
  let possibleCharacter = 'abcdefghijklmnopqrstuvwxyz0123456789';
  
  let str = '';
  
  for(i = 1; i <= len; i++){
     //get random character
    let randomCharacter = possibleCharacter.charAt(Math.floor(Math.random() * possibleCharacter.length));
    
    //append this character to the final string
    str += randomCharacter;
  }
  
  return str;
};

helpers.sendTwilioSms = function(phone,msg,callback){
  // Validate parameters
  phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
  msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
  if(phone && msg){

    // Configure the request payload
    var payload = {
      'From' : config.twilio.fromPhone,
      'To' : '+1'+phone,
      'Body' : msg
    };
    var stringPayload = querystring.stringify(payload);


    // Configure the request details
    let requestDetails = {
      'protocol' : 'https:',
      'hostname' : 'api.twilio.com',
      'method' : 'POST',
      'path' : '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
      'auth' : config.twilio.accountSid+':'+config.twilio.authToken,
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload)
      }
    };

    // Instantiate the request object
    let req = https.request(requestDetails,function(res){
        // Grab the status of the sent request
        let status =  res.statusCode;
        // Callback successfully if the request went through
        if(status == 200 || status == 201){
          callback(false);
        } else {
          callback('Status code returned was '+status);
        }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error',function(e){
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();

  } else {
    callback('Given parameters were missing or invalid');
  }
};

helpers.getTemplate = function(templateName, data, callback){
    templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
    data = typeof(data) == 'object' && data !== null ? data : {};
    
    if(!templateName){
        return callback('A valid template name is nost specified');    
    }
    
    let templateDir = path.join(__dirname,'/../templates/');
    
    fs.readFile(templateDir+templateName+'.html','utf8',function(err,str){
        if(err || !str || str.length <= 0){
            return callback('No template found');
        }
        //Do interpolation
        let finalStr = helpers.interpolate(str,data);
        callback(false, finalStr);
    });
};

//Add universal header and universal footer
helpers.addUniversalTemplates = function(str,data,callback){
   str = typeof(str) == 'string' && str.length > 0 ? str : '';
   data = typeof(data) == 'object' && data !== null ? data : {};
    
    //get the header
    helpers.getTemplate('_header',data,function(err,headerString){
        if(err || !headerString){
            callback('Could not find header template');
        }
        
        helpers.getTemplate('_footer', data, function(err, footerString){
            if(err || !footerString){
                return callback('Could not find footer template');
            }
            
             let fullStr = headerString + str + footerString;
            callback(false,fullStr);
        });
        
    });
    
};

helpers.interpolate = function(str,data){
    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(data) == 'object' && data !== null ? data : {};
    
    //add template globals to data obejct
    for(let keyName in config.templateGlobals){
        if(config.templateGlobals.hasOwnProperty(keyName)){
            data['global.'+keyName] = config.templateGlobals[keyName];
        }
    }
    
    //for each key in data obj we want to insert its value on the corresponding place
    for(let key in data){
        if(data.hasOwnProperty(key) && typeof(data[key]) == 'string'){
            let replace = data[key];
            let find = `{${key}}`;
            str = str.replace(find,replace);
        }
    }
    
    return str;
};

//Get contents of static asset
helpers.getStaticAsset = function(fileName,callback){
    fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
    
    if(!fileName){
        return callback('A valid filename must be specified');
    }
    
    let publicDir = path.join(__dirname,'/../public/');
    
    fs.readFile(publicDir+fileName,function(err,data){
        if(err || !data){
            return callback('No file could be found');
        }

        callback(false,data);
    });
    
}

module.exports = helpers;