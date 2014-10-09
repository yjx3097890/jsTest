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
  socket.counter = 1;
  socket.emit('news', {news: 'hello world'},  function(data) {
                     console.log(data);
                  });
  socket.on('echo', function (data) {
    if (socket.counter <= 50) {
      console.log(socket.counter++);

      data.back+= socket.counter;
      socket.emit('news', {news: data.back},  function(data) {
                         console.log(data);
                      });
    }

  });
});
