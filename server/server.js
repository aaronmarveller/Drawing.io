const express = require("express");
const app = express();
const path = require("path");

var http = require("http");
var socketIO = require("socket.io");
var io = socketIO();
var editorSocketService = require('./services/editorSocketService.js');

// connect mongdb
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://peiyuan:lpyyes123@cluster0-22oor.mongodb.net/problems");

const restRouter = require("./routes/rest.js");
app.use('/api/v1', restRouter);

app.use(express.static(path.join(__dirname, '../public')));

// app.listen(8080, () =>{
//   console.log('app is now listen to 8080'); 
// });

const server = http.createServer(app);
io.attach(server);
server.listen(8080);
server.on('listening', ()=>{
    console.log('app is now listen to 8080');
});

app.use((req, res) =>{
    res.sendFile('index.html', {root: path.join(__dirname, '../public')});
}); //if all the router not covered, go to index.html(which is the root)
