// External imports
const express = require('express');

// Initialize app
const app = express();

const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(http);
const { v4: uuidV4 } = require('uuid');

// Internal imports
const sequelize = require('./service/dbConnection');
const testRoute = require('./routes/sample');
const userRoute = require('./routes/UserRoute');

const PORT = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

async function dbConnect() {
  try {
    await sequelize.authenticate();
    console.log('DB connection successful');
    await sequelize.sync({ force: true });
    console.log('DB synchronization successful');
  } catch (e) {
    console.log('DB connection failed', e);
  }
}

app.use('/123', testRoute);
app.use('/api/v1/user', userRoute);

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get('/:roomId', (req, res) => {
  const roomId = req.params.roomId;

  res.render(`${__dirname}/views/room`, { roomId });
});

io.on('connection', (socket) => {
  console.log('client connected');
  socket.on('join-room', (data) => {
    console.log(data);
    const { roomId, userId } = data || {};
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);
  });
});

http.listen(8080, async () => {
  await dbConnect();
  console.log(`Server started on ${PORT}`);
});

module.exports = app;
