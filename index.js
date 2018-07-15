
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs  = require('fs');

//Instantiate HTTP Server
const httpServer = http.createServer(function(req, res) {
    unifiedServer(req,res);
});

//Listen on HTTP Server
httpServer.listen(config.httpPort, function() {
    console.log(`Listening on port ${config.httpPort}`);
});

let httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem'),
};

//Instantiate HTTPS Server
const httpsServer = https.createServer(httpsServerOptions,function(req, res) {
    unifiedServer(req,res);
});

//Listen on HTTPS Server
httpsServer.listen(config.httpsPort, function() {
    console.log(`Listening on port ${config.httpsPort}`);
});

//Internal server logic handling
let unifiedServer = function(req,res){
    let parsedUrl = url.parse(req.url, true);

    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    let method = req.method.toLowerCase();

    let queryString = parsedUrl.query;

    let headers = req.headers;
    
    //Payload parsing
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    
    req.on('data', function(data){
        buffer += decoder.write(data);
    });
    
    req.on('end', function(){
        buffer  += decoder.end();
        
        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        
        let data = {
            'trimmedPath': trimmedPath,
            'queryString': queryString,
            'method': method,
            'headers': headers,
            'payload': buffer
        };
        
        //route the request
        chosenHandler(data, function(statusCode, payload){
            //Default status code
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            
            payload = typeof(payload) == 'object' ? payload : {};
            
            let payloadString = JSON.stringify(payload);
            
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
       
        console.log(`${method} Request received on path: ${trimmedPath} and query string`, queryString);
        console.log(`Request received with headers: `, headers);
        console.log(`Request received with payload: `, buffer);
    });
};

//Handlers
let handlers = {};

handlers.ping = function(data,callback){
    callback(200);
};

handlers.hello = function(data, callback){
    callback(200, { 'message': 'Hello to you too, friend.'});
};

handlers.notFound = function(data, callback){
    callback(404);
};
//Router
let router = {
    'ping': handlers.ping,
    'hello': handlers.hello
}