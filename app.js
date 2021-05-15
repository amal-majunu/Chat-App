const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http").createServer(app);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
//app.set("view engine", "ejs");

app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

const users = {};

//Socket
const io = require("socket.io")(http);

io.on('connection', (socket) => {
    console.log('Connected');
    socket.on('new-user', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    });
    socket.on('message', (msg)=>{
        socket.broadcast.emit('message', msg)
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
})


http.listen(3000, function(){
    console.log("Server started at port 3000");
});
