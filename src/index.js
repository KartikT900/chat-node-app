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

const PORT = 8080;
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
app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get('/:roomId', (req, res) => {
  const roomId = req.params.roomId;

  res.render(`${__dirname}/views/room`, { roomId });
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
      console.log('inside other user', otherUser);
      socket.emit('new-user', otherUser);
      socket.to(otherUser).emit('user-joined', otherUser);
    }

    console.log(rooms);
  });

  socket.on('offer', (data) => {
    console.log('offer:', data);
    io.to(data.target).emit('offer', data);
  });

  socket.on('answer', (data) => {
    console.log('answer:', data);
    io.to(data.target).emit('answer', data);
  });

  socket.on('ice-candidate', (data) => {
    io.to(data.target).emit('ice-candidate', data.candidate);
  });
});

http.listen(8080, async () => {
  // await dbConnect();̀
  console.log(`Server started on ${PORT}`);
});

module.exports = app;
