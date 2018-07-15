
let environments = {};

environments.development = {
  'httpPort': 1337,
  'httpsPort':1338,
  'envName': 'development'
};

environments.production = {
  'httpPort': 3000,
  'httpsPort':3001,
  'envName': 'production'
};

let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
    
let environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.development;
    
module.exports = environmentToExport;