
let environments = {};

environments.development = {
  'phonelength': 12,
  'randomstringlength': 20,
  'httpPort': 1337,
  'httpsPort':1338,
  'envName': 'development',
  'hashingSecret': 'thisisthedevsecret',
  'maxChecks': 5,
  'twilio' : {
    'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
    'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
    'fromPhone' : '+15005550006'
  },
    'templateGlobals': {
        'appName': 'UptimeChecker',
        'companyName': 'Redrazor Inc',
        'yearCreated': '2018',
        'baseUrl': 'http://localhost:1337'
    }
};

environments.staging = {
  'phonelength': 12,
  'randomstringlength': 20,
  'httpPort': 1337,
  'httpsPort':1338,
  'envName': 'development',
  'hashingSecret': 'thisisthedevsecret',
  'maxChecks': 5,
  'twilio' : {
    'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
    'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
    'fromPhone' : '+15005550006'
  },
    'templateGlobals': {
        'appName': 'UptimeChecker',
        'companyName': 'Redrazor Inc',
        'yearCreated': '2018',
        'baseUrl': 'http://Sky-Labs-redrazordesign470983.codeanyapp.com:1337'
    }
};

environments.production = {
  'phonelength': 12,
  'randomstringlength': 20,
  'httpPort': 3000,
  'httpsPort':3001,
  'envName': 'production',
  'hashingSecret': 'thisistheprodsecret',
  'maxChecks': 5,
  'twilio' : {
    'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
    'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
    'fromPhone' : '+15005550006'
  },
    'templateGlobals': {
        'appName': 'UptimeChecker',
        'CompanyName': 'Redrazor Inc',
        'YearCreated': '2018',
        'baseUrl': 'http://Sky-Labs-redrazordesign470983.codeanyapp.com:3000'
    }
};

let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
    
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.development;
    
module.exports = environmentToExport;