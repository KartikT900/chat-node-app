const socket = io('/');
const data = {
  roomId,
  userId: 10
};

socket.emit('join-room', data);

socket.on('user-connected', (userId) => {
  console.log('user connected', userId);
});
