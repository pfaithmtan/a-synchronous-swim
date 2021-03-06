const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messagesQueue = require('./messageQueue');

// Path for the background image ///////////////////////
var backgroundImageFile = path.join('.', 'background.jpg');
// module.exports.backgroundImageFile = path.join('.', 'background.jpg');
module.exports.backgroundImageFile = backgroundImageFile;
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

// var generateRandomCommand =  function() {
//   var commands = ["left", "right", "up", "down"];
//   var randomIndex = Math.floor(Math.random() * commands.length);
//   return commands[randomIndex];
// }

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  if (req.url === '/') {
    res.writeHead(200, headers);
    if (req.method === 'GET') {
      var cmd = messagesQueue.dequeue();
      if (cmd) {
        console.log(`Responding to GET request with cmd: ${cmd}`);
        res.write(cmd);
      }
    }
    res.end();
    next();
  } else if (req.url === '/' + backgroundImageFile) {
    fs.readFile(`../server/js/${backgroundImageFile}`, 'base64', function(err, data) {
      if (err) {
        res.writeHead(404, headers);
        res.end();
        next();
      } else {
        res.writeHead(200, headers);
        res.write(new Buffer(data, 'base64'));
        res.end();
        next();
      }
    });
  }
  else {
    res.writeHead(404, headers);
    res.end();
    next();
  }
  // res.end();
  // next(); // invoke next() at the end of a request to help with testing!
};
