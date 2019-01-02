var express = require("express");
var mongoose = require("mongoose");
http = require('http');
var dbUrl = "mongodb://peiguangda:Vanquyen123@ds245234.mlab.com:45234/simple-chat";
var app = express();
var server = http.createServer(app);
var io = require("socket.io").listen(server);

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var Message = mongoose.model("Message", {name: String, message: String});

app.use(express.static(__dirname));

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
});

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if (err) sendStatus(500);
        io.emit('message', message);
        res.sendStatus(200);
    })
});

io.on('connection', function (socket) {
    console.log("a user is connectedddddddddddddddddđddđdddddddddddddd" + socket);
    socket.on("message", function(data)
    {
        console.log("connection");
        //sau khi lắng nghe dữ liệu, server phát lại dữ liệu này đến các client khác
    });
});

mongoose.connect(dbUrl, (err) => {
    console.log("mongodb connected", err);
});

server.listen(3000, () => {
    console.log("server is running on port", server.address().port);
});
