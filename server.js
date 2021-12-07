const express = require('express');

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on Port:', 8000);
});
const io = socket(server);

const tasks = [];

// jako callback nasluchiwacza ustaw funkcje emitujaca tylko do tego nowego uzytkownika zdarzenie updateData + tasks
io.on('connection', (socket) => {
  socket.emit('updateData', tasks);

  socket.on('addTask', (taskName) => {
    tasks.push(taskName);
    socket.broadcast.emit('addTask', taskName);
  });

  socket.on('removeTask', (taskId) => {
    tasks.splice(taskId, 1);
    socket.broadcast.emit('removeTask', taskId);
  });
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});