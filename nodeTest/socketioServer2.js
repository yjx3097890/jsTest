var http = require('http');
var sio = require('socket.io');
var fs = require('fs');
var mime = require('mime');



var app = http.createServer(function (req, res) {
  fs.readFile(__dirname + req.url, function (err, data) {
    if (err) {
      res.writeHeader(500);
      return res.end('error : ' + err);
    }
    var type = mime.lookup(__dirname + req.url);
    res.writeHeader(200, {'Content-Type': type});
    res.end(data);
  });
});

var io = sio.listen(app);
app.listen(8124);
io.sockets.on('connection', function (socket) {
  socket.on('addme', function (username) {
    socket.username = username;
    socket.emit('chat', 'SERVER', 'You have connected');
    socket.broadcast.emit('chat', 'SERVER', username + ' is on desk.');
  });

  socket.on('sendchat', function (data) {
    io.sockets.emit('chat', socket.username, data);
  });
  socket.on('disconnect', function () {
    socket.broadcast.emit('chat', 'SERVER', socket.username + ' has left.')
  });
});
