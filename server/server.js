const express = require('express');
const app = express();
const path = require("path");

let http = require('http');
let socketIO = require('socket.io');
let io = socketIO();
let editorSocketService = require('./service/editorSocketService')(io);

/*
   //which equals to below two lines

var editorSocketServiceFunc = require('./service/editorSocketService');
var editorSocketService = editorSocketServiceFunc(io);

*/

// connect to MongoDB Atlas
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://[root]:[password]@cluster0-22oor.mongodb.net/problems");

const restRouter = require("./routes/rest.js");

app.use('/api/v1', restRouter);

app.use(express.static(path.join(__dirname, '../public')));

// app.listen(8080, () => {
//    console.log('App is listing to port 8080');
// });

const server = http.createServer(app);
io.attach(server);
server.listen(8080);
server.on('listening', () => {
   console.log('App is listening to port 8080')
});

app.use((req, res) => {
   res.sendFile('index.html', {root: path.join(__dirname, '../public')});
});

