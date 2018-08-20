/** Primary Entry Point**/

const server = require('./lib/server');

const workers = require('./lib/workers');

//Declare app

let app = {};

//Init 
app.init = function(){
  //Start the server
  server.init();
  //Start the workers
  workers.init();
};

//Start Init

app.init();

module.exports = app;