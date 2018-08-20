//Request Handlers
const _data = require('./data');
const helpers = require('./helpers');
const config = require('../config');

let handlers = {};

handlers.ping = function(data, callback) {
    callback(200);
};

/**
** HTML HANDLERS
**/

handlers.index = function(data, callback){
    if(data.method !== 'get'){
        return callback(405,undefined,'html');
    }
    
    //Prepare data for interpolation
    let templateData = {
        'head.title': 'Uptime Monitoring',
        'head.description': 'We offer free simple uptime monitoring for HTTP/HTTPS',
        'body.class': 'index'
    }
    
    //read in template as a string
    helpers.getTemplate('index', templateData, function(err, str){
        
      if(err || !str){
          return callback(500,undefined,'html');
      }
      //add universal templateData 
      helpers.addUniversalTemplates(str,templateData, function(err, finalStr){
          if(err || !finalStr){
              return callback(500,undefined,'html');
          }
          callback(200,finalStr,'html');
      });
        
      
    });
};

//Create Account Handler
handlers.accountCreate = function(data, callback){
    if(data.method !== 'get'){
        return callback(405,undefined,'html');
    }
    
    //Prepare data for interpolation
    let templateData = {
        'head.title': 'Create an Account',
        'head.description': 'Signup is easy and only takes a few seconds',
        'body.class': 'accountCreate'
    }
    
    //read in template as a string
    helpers.getTemplate('accountCreate', templateData, function(err, str){
        
      if(err || !str){
          return callback(500,undefined,'html');
      }
      //add universal templateData 
      helpers.addUniversalTemplates(str,templateData, function(err, finalStr){
          if(err || !finalStr){
              return callback(500,undefined,'html');
          }
          callback(200,finalStr,'html');
      });
        
      
    });
};

//Edit account
handlers.accountEdit = function(data, callback){
    if(data.method !== 'get'){
        return callback(405,undefined,'html');
    }
    
    //Prepare data for interpolation
    let templateData = {
        'head.title': 'Account Settings',
        'body.class': 'accountEdit'
    }
    
    //read in template as a string
    helpers.getTemplate('accountEdit', templateData, function(err, str){
        
      if(err || !str){
          return callback(500,undefined,'html');
      }
      //add universal templateData 
      helpers.addUniversalTemplates(str,templateData, function(err, finalStr){
          if(err || !finalStr){
              return callback(500,undefined,'html');
          }
          callback(200,finalStr,'html');
      });
        
      
    });
};


//Create session/Login
handlers.sessionCreate = function(data, callback){
    if(data.method !== 'get'){
        return callback(405,undefined,'html');
    }
    
    //Prepare data for interpolation
    let templateData = {
        'head.title': 'Login to your account',
        'head.description': 'Please enter your phone and password to access your account',
        'body.class': 'sessionCreate'
    }
    
    //read in template as a string
    helpers.getTemplate('sessionCreate', templateData, function(err, str){
        
      if(err || !str){
          return callback(500,undefined,'html');
      }
      //add universal templateData 
      helpers.addUniversalTemplates(str,templateData, function(err, finalStr){
          if(err || !finalStr){
              return callback(500,undefined,'html');
          }
          callback(200,finalStr,'html');
      });
        
      
    });
};

//Session destroy/logout
handlers.sessionDeleted = function(data, callback){
    if(data.method !== 'get'){
        return callback(405,undefined,'html');
    }
    
    //Prepare data for interpolation
    let templateData = {
        'head.title': 'Logged Out',
        'head.description': 'You have been logged out of your account',
        'body.class': 'sessionDeleted'
    }
    
    //read in template as a string
    helpers.getTemplate('sessionDeleted', templateData, function(err, str){
        
      if(err || !str){
          return callback(500,undefined,'html');
      }
      //add universal templateData 
      helpers.addUniversalTemplates(str,templateData, function(err, finalStr){
          if(err || !finalStr){
              return callback(500,undefined,'html');
          }
          callback(200,finalStr,'html');
      });
        
      
    });
};

//Favicon
handlers.favicon = function(data,callback){
    if(data.method !== 'get'){
        return callback(405,undefined,'html');
    }
    
    //read favicon
    helpers.getStaticAsset('favicon.ico',function(err,faviconData){
        if(err || !faviconData){
            return callback(500);
        }
        callback(200,faviconData,'favicon');
    });
};

//Handler for public assets
handlers.public = function(data,callback){
    if(data.method !== 'get'){
        return callback(405,undefined,'html');
    }
    
    //get filename requested
    let trimmedAssetName = data.trimmedPath.replace('public/','').trim();
    if(trimmedAssetName.length <= 0){
        return callback(404);
    }
    
    //read assets data
    helpers.getStaticAsset(trimmedAssetName,function(err,data){
        if(err || !data){
            return callback(404);
        }
        //Determine file type
        let contentType = 'plain';
        
        if(trimmedAssetName.indexOf('.css') > -1){
            contentType = 'css';
        }
        if(trimmedAssetName.indexOf('.png') > -1){
            contentType = 'png';
        }
        if(trimmedAssetName.indexOf('.jpg') > -1){
            contentType = 'jpg';
        }
        if(trimmedAssetName.indexOf('.ico') > -1){
            contentType = 'favicon';
        }
            
        callback(200,data, contentType);
    });
}


/**
** JSON API HANDLERS
**/

handlers.users = function(data, callback) {
    let acceptableMethods = ['post', 'get', 'put', 'delete'];

    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

//Users Handlers
handlers._users = {};

handlers._users.post = function(data, callback) {
    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == config.phonelength ? data.payload.phone.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        _data.read('users', phone, function(err, data) {
            if (err) {
                //Hash the password
                let hashedPassword = helpers.hash(password);

                if (!hashedPassword) {
                    return callback(500, {
                        'Error': 'Error handling the user info'
                    });
                }

                let userObject = {
                    'firstName': firstName,
                    'lastName': lastName,
                    'phone': phone,
                    'hashedPassword': hashedPassword,
                    'tosAgreement': true
                };

                //Store the userObject
                _data.create('users', phone, userObject, function(err) {
                    if (err) {
                        console.log(err);
                        return callback(500, {
                            'Error': 'Could not create the new user'
                        });
                    }

                    callback(200);
                });

            } else {
                //User already exists
                callback(400, {
                    'Error': 'A user with that Phone number already exists'
                });
            }
        });
    } else {
        callback(400, {
            'Error': 'Missing required fields'
        });
    }
};


handlers._users.get = function(data, callback) {
    let phone = typeof(data.queryString.phone) == 'string' && data.queryString.phone.trim().length == config.phonelength ? data.queryString.phone.trim() : false;

    if (!phone) {
        return callback(400, {
            'Error': 'Missing required field'
        });
    }

    //Get the token from the headers
    let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
        if (!tokenIsValid) {
            return callback(403, {
                'Error': 'You are not allowed to do this operation'
            });
        }

        _data.read('users', phone, function(err, data) {
            if (err) {
                return callback(404);
            }

            if (data) {
                //remove password
                delete data.hashedPassword;
                callback(200, data);
            }

        });
    });

};

handlers._users.put = function(data, callback) {
    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == config.phonelength ? data.payload.phone.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (!phone) {
        return callback(400, {
            'Error': 'Missing required field'
        });
    }

    if (firstName || lastName || password) {

        //Get the token from the headers
        let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

        handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
            if (!tokenIsValid) {
                return callback(403, {
                    'Error': 'You are not allowed to do this operation'
                });
            }
            //look up the user
            _data.read('users', phone, function(err, userData) {
                if (err) {
                    return callback(404);
                }

                if (userData) {
                    //Update the user
                    if (firstName) {
                        userData.firstName = firstName;
                    }

                    if (lastName) {
                        userData.lastName = lastName;
                    }

                    if (password) {
                        userData.hashedPassword = helpers.hash(password);
                    }

                    //Store new updates
                    _data.update('users', phone, userData, function(err) {
                        if (err) {
                            return callback(500, {
                                'Error': 'Could not update the user'
                            });
                        }

                        callback(200);
                    });
                }

            });
        });
    } else {
        return callback(400, {
            'Error': 'Missing field to update'
        });
    }
};

handlers._users.delete = function(data, callback) {
    let phone = typeof(data.queryString.phone) == 'string' && data.queryString.phone.trim().length == config.phonelength ? data.queryString.phone.trim() : false;

    if (!phone) {
        return callback(400, {
            'Error': 'Missing required field'
        });
    }
    //Get the token from the headers
    let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
        if (!tokenIsValid) {
            return callback(403, {
                'Error': 'You are not allowed to do this operation'
            });
        }
        _data.read('users', phone, function(err, userData) {
            if (err || !userData) {
                return callback(404);
            }

            _data.delete('users', phone, function(err) {
                if (err) {
                    return callback(500, {
                        'Error': 'Could not delete the specified User'
                    });
                }

                //Delete all associated checks data
                let userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

                let checksToDelete = userChecks.length;


                if (checksToDelete < 0) {
                    return callback(200);
                }

                let checksDeleted = 0;
                let deletionErrors = false;

                //look through
                userChecks.forEach(function(checkId) {
                    _data.delete('checks', checkId, function(err) {
                        if (err) {
                            deletionErrors = true;
                        }
                        checksDeleted++;
                        if (checksDeleted == checksToDelete) {
                            if (deletionErrors) {
                                return callback(500, {
                                    'Error': 'Errors encountered while atempting to delete checks'
                                });
                            }

                            callback(200);
                        }
                    });
                });
            });

        });
    });
};

//TOKENS HANDLERS
handlers.tokens = function(data, callback) {
    let acceptableMethods = ['post', 'get', 'put', 'delete'];

    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._tokens = {};

//token based on phone and password
handlers._tokens.post = function(data, callback) {
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == config.phonelength ? data.payload.phone.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (!phone || !password) {
        return callback(400, {
            'Error': 'Missing parameters'
        });
    }

    //lookup user

    _data.read('users', phone, function(err, userData) {
        if (err) {
            return callback(400, {
                'Error': 'Could not find the user'
            });
        }

        if (userData) {
            //has the sent pass and compare to the pass stored
            let hashedPassword = helpers.hash(password);

            if (!hashedPassword) {
                return callback(500, {
                    'Error': 'Error handling the user info'
                });
            }

            if (hashedPassword !== userData.hashedPassword) {
                return callback(400, {
                    'Error': 'Password did not match user \'s password'
                });
            }

            let tokenId = helpers.createRandomString(config.randomstringlength);

            if (!tokenId) {
                return callback(500, {
                    'Error': 'Error generating token'
                });
            }

            let expires = Date.now() + 1000 * 60 * 60;
            let tokenObject = {
                'phone': phone,
                'id': tokenId,
                'expires': expires
            };

            _data.create('tokens', tokenId, tokenObject, function(err) {
                if (err) {
                    return callback(500, {
                        'Error': 'Could not create token'
                    });
                }

                callback(200, tokenObject);
            });

        }
    });

};

handlers._tokens.get = function(data, callback) {
    let id = typeof(data.queryString.id) == 'string' && data.queryString.id.trim().length == config.randomstringlength ? data.queryString.id.trim() : false;

    if (!id) {
        return callback(404, {
            'Error': 'Missing required field'
        });
    }

    _data.read('tokens', id, function(err, tokenData) {
        if (err) {
            return callback(404);
        }

        if (tokenData) {
            callback(200, tokenData);
        }

    });
};

handlers._tokens.put = function(data, callback) {
    let id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == config.randomstringlength ? data.payload.id.trim() : false;
    let extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;

    if (!id || !extend) {
        return callback(404, {
            'Error': 'Missing required field'
        });
    }

    _data.read('tokens', id, function(err, tokenData) {
        if (err) {
            return callback(400, {
                'Error': 'token does not exists'
            });
        }

        if (tokenData.expires < Date.now()) {
            //is expired
            return callback(400, {
                'Error': 'The token has already expired'
            });
        }

        tokenData.expires = Date.now() + 1000 * 60 * 60;
        _data.update('tokens', id, tokenData, function(err) {
            if (err) {
                return callback(500, {
                    'Error': 'Could not update tokens'
                });
            }

            callback(200);
        });


    });


};

handlers._tokens.delete = function(data, callback) {
    let id = typeof(data.queryString.id) == 'string' && data.queryString.id.trim().length == config.randomstringlength ? data.queryString.id.trim() : false;

    if (!id) {
        return callback(400, {
            'Error': 'Missing required field'
        });
    }

    _data.read('tokens', id, function(err, tokenData) {
        if (err) {
            return callback(404);
        }

        if (data) {
            _data.delete('tokens', id, function(err) {
                if (err) {
                    return callback(500, {
                        'Error': 'Could not delete the specified Token'
                    });
                }
                callback(200);
            });
        }

    });

};

//Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function(id, phone, callback) {
    //Look up the token
    _data.read('tokens', id, function(err, tokenData) {
        if (err || !tokenData) {
            return callback(false);
        }

        if (tokenData.phone !== phone || tokenData.expires < Date.now()) {
            return callback(false);
        }

        callback(true);
    });
};

//CHECKS SERVICE
handlers.checks = function(data, callback) {
    let acceptableMethods = ['post', 'get', 'put', 'delete'];

    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._checks[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._checks = {};

handlers._checks.post = function(data, callback) {
    //Validate inputs
    let protocol = typeof(data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    let url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    let method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    let successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    let timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

  console.log(timeoutSeconds);
    if (!protocol || !url || !method || !successCodes || !timeoutSeconds) {
        return callback(400, {
            'Error': 'Missing Required Inputs'
        });
    }

    //Get the token from the headers
    let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

    _data.read('tokens', token, function(err, tokenData) {
        if (!data) {
            return callback(403, {
                'Error': 'Not allowed'
            });
        }

        let userPhone = tokenData.phone;

        //look up userData
        _data.read('users', userPhone, function(err, userData) {
            if (err || !userData) {
                return callback(403, {
                    'Error': 'Not allowed'
                });
            }

            let userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

            //make sure the user has less than the max checks
            if (userChecks.length >= config.maxChecks) {
                return callback(400, {
                    'Error': `The user already has the max number of checks: ${config.maxChecks}`
                });
            }

            //Create a random id for the check
            let checkId = helpers.createRandomString(config.randomstringlength);

            //Checkobj with user phone
            let checkObj = {
                'id': checkId,
                'userPhone': userPhone,
                'protocol': protocol,
                'url': url,
                'method': method,
                'successCodes': successCodes,
                'timeoutSeconds': timeoutSeconds
            };

            //Save checks
            _data.create('checks', checkId, checkObj, function(err) {
                if (err) {
                    return callback(500, {
                        'Error': 'Could not create the new check'
                    });
                }

                //add the check id to userChecks
                userData.checks = userChecks;
                userData.checks.push(checkId);

                //Save user data

                _data.update('users', userPhone, userData, function(err) {
                    if (err) {
                        return callback(500, {
                            'Error': 'Could not update User checks'
                        });
                    }

                    callback(200, checkObj);
                });

            });
        });
    });
};

handlers._checks.get = function(data, callback) {
    let id = typeof(data.queryString.id) == 'string' && data.queryString.id.trim().length == config.randomstringlength ? data.queryString.id.trim() : false;

    if (!id) {
        return callback(400, {
            'Error': 'Missing required field'
        });
    }

    //lookup check
    _data.read('checks', id, function(err, checkData) {
        if (err || !checkData) {
            return callback(404);
        }

        //Get the token from the headers
        let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

        handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
            if (!tokenIsValid) {
                return callback(403, {
                    'Error': 'You are not allowed to do this operation'
                });
            }


            callback(200, checkData);

        });
    });

};

handlers._checks.put = function(data, callback) {
    let id = typeof(data.queryString.id) == 'string' && data.queryString.id.trim().length == config.randomstringlength ? data.queryString.id.trim() : false;

    let protocol = typeof(data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    let url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    let method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    let successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    let timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds.length >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

    if (!id) {
        return callback(400, {
            'Error': 'Missing required field'
        });
    }

    if (protocol || url || method || successCodes || timeoutSeconds) {

        _data.read('checks', id, function(err, checkData) {
            if (err || !checkData) {
                return callback(404);
            }

            //Get the token from the headers
            let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

            handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
                if (!tokenIsValid) {
                    return callback(403, {
                        'Error': 'You are not allowed to do this operation'
                    });
                }

                if (protocol) {
                    checkData.protocol = protocol;
                }

                if (url) {
                    checkData.url = url;
                }

                if (method) {
                    checkData.method = method;
                }

                if (successCodes) {
                    checkData.successCodes = successCodes;
                }

                if (timeoutSeconds) {
                    checkData.timeoutSeconds = timeoutSeconds;
                }

                //Store new updates
                _data.update('checks', id, checkData, function(err) {
                    if (err) {
                        return callback(500, {
                            'Error': 'Could not update the check'
                        });
                    }

                    callback(200);
                });
            });

        });
    } else {
        return callback(400, {
            'Error': 'Missing field to update'
        });
    }
};

handlers._checks.delete = function(data, callback) {
    let id = typeof(data.queryString.id) == 'string' && data.queryString.id.trim().length == config.randomstringlength ? data.queryString.id.trim() : false;

    if (!id) {
        return callback(400, {
            'Error': 'Missing required field'
        });
    }

    _data.read('checks', id, function(err, checkData) {
        if (err || !checkData) {
            return callback(404);
        }

        //Get the token from the headers
        let token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

        handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
            if (!tokenIsValid) {
                return callback(403, {
                    'Error': 'You are not allowed to do this operation'
                });
            }

            _data.delete('checks', id, function(err) {
                if (err) {
                    return callback(500, {
                        'Error': 'Could not delete the specified Check'
                    });
                }

                _data.read('users', checkData.userPhone, function(err, userData) {
                    if (err || !userData) {
                        return callback(500, {
                            'Error': 'Error reading Data for Check user'
                        });
                    }

                    let userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];

                    let checkPosition = userChecks.indexOf(id);

                    if (checkPosition < 0) {
                        return callback(500, {
                            'Error': 'Error finding check in User'
                        });
                    }

                    userChecks.splice(checkPosition, 1);
                    userData.checks = userChecks;

                    //resave user data
                    _data.update('users', checkData.userPhone, userData, function(err) {
                        if (err) {
                            return callback(500, {
                                'Error': 'Error storing new checks in User'
                            });
                        }

                        callback(200);
                    });
                });
            });
        });
    });
};
//404 Handler
handlers.notFound = function(data, callback) {
    callback(404);
};

module.exports = handlers;