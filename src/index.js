// External imports
const express = require('express');

// Initialize app
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { v4: uuidV4 } = require('uuid');

// Internal imports
const sequelize = require('./service/dbConnection');
const testRoute = require('./routes/sample');
const userRoute = require('./routes/UserRoute');

const PORT = process.env.PORT || 8080;
const rooms = {};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Setting view engine.
 * This will be responsible for injecting the client bundle (React).
 */
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

async function dbConnect() {
  try {
    await sequelize.authenticate();
    console.log('DB connection successful');
    await sequelize.sync();
    console.log('DB synchronization successful');
  } catch (e) {
    console.log('DB connection failed', e);
  }
}

app.use('/123', testRoute);
app.use('/api/v1/user', userRoute);

/**
 * @todo Need this to be removed, once the client codebase is ready
 * @todo Refactor this for better clarity
 */
app.get('/video', (req, res) => {
  res.redirect(`/video/${uuidV4()}`);
});

app.get('/chat', (req, res) => {
  res.redirect(`/chat/${uuidV4()}`);
});

app.get('/video/:roomId', (req, res) => {
  const roomId = req.params.roomId;

  res.render(`${__dirname}/views/videochatroom`, { roomId });
});

app.get('/chat/:roomId', (req, res) => {
  const roomId = req.params.roomId;

  res.render(`${__dirname}/views/chatonlyroom`, { roomId });
});

/**
 * The purpose of socket.io is to serve as an intermediary(middleware)
 * and facilitate the ̀handshake process between two peers. Once the
 * peer-to-peer connection is established between the two clients,
 * this is no longer needed.
 */
io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    if (rooms[roomId]) {
      // If room already exists, then add new socket.id (new user)
      rooms[roomId].push(socket.id);
    } else {
      rooms[roomId] = [socket.id];
    }

    const otherUser = rooms[roomId].find((id) => id !== socket.id);
    if (otherUser) {
      socket.emit('new-user', otherUser);
      socket.to(otherUser).emit('user-joined', otherUser);
    }

    console.log(rooms);
  });

  socket.on('offer', (data) => {
    io.to(data.target).emit('offer', data);
  });

  socket.on('answer', (data) => {
    io.to(data.target).emit('answer', data);
  });

  socket.on('ice-candidate', (data) => {
    io.to(data.target).emit('ice-candidate', data.candidate);
  });

  socket.on('on-type', (data) => {
    const otherUser = rooms[data.room].find((id) => id !== data.id);
    console.log(otherUser);
    io.to(otherUser).emit('on-type', data.id);
  });

  socket.on('on-type-stop', (data) => {
    const otherUser = rooms[data.room].find((id) => id !== data.id);
    io.to(otherUser).emit('on-type-stop', data.id);
  });
});

http.listen(PORT, async () => {
  // await dbConnect();̀
  console.log(`Server started on ${PORT}`);
});

module.exports = app;
