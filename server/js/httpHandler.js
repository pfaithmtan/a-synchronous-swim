const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messagesQueue = require('./messageQueue');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
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
  res.writeHead(200, headers);
  if (req.method === 'GET') {
    // res.write(generateRandomCommand());
    res.write(messagesQueue.dequeue() || ' ');
  }
  res.end();
  next(); // invoke next() at the end of a request to help with testing!
};
