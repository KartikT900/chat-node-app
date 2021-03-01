const { http } = require('../index');
const io = require('socket.io')(http);

function socketInit() {
  io.on('connection', (socket) => {
    console.log('client connected');
  });
}

module.exports = socketInit;
