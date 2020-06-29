var redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECONDS = 3600;


module.exports = function(io) {
  // collaboration sessions
  var collaborations = {};

  // map from socket Id to problem Id
  var socketIdToProblemId = {};

  var sessionPath = '/temp_sessions/';

  io.on('connection', socket => {
      // console.log(socket);
      // let message = socket.handshake.query['message'];

      io.to(socket.id).emit('message', 'Hi from server');

      let problemId = socket.handshake.query['problemId'];
      socketIdToProblemId[socket.id] = problemId;

      // add socket.id to corresponding collaboration session participants
      /*
      if (!(problemId in collaborations)) {
          collaborations[problemId] = {
              'participants': []
          };
      }
      collaborations[problemId]['participants'].push(socket.id);
       */

      if (problemId in collaborations) {
          collaborations[problemId]['participants'].push(socket.id);
      } else {
          // not in memory, but check if it's in redis
          // this is for the client who comes late but the data is in the cache
          redisClient.get(sessionPath + problemId, function(data) {
              if (data) {
                  console.log('session terminated previously, pulling back from redis: ' + data);
                  collaborations[problemId] = {
                      'participants': [],
                      'cachedInstructions': JSON.parse(data),
                  }
              } else {
                  console.log('creating new session');
                  collaborations[problemId] = {
                      'participants': [],
                      'cachedInstructions': []
                  }
              }

              // set up a new socket where the client is the first one.
              collaborations[problemId]['participants'].push(socket.id);
          });
      }

      // respond to client change event
      socket.on('change', delta => {
         let problemId = socketIdToProblemId[socket.id];
         console.log('change from problem: ' + problemId + ' ' + delta);

         if (problemId in collaborations) {
             // save instruction to collaborations
             collaborations[problemId]['cachedInstructions'].push(['change', delta, Date.now()]);
             let participants = collaborations[problemId]['participants'];


             for (let i = 0; i < participants.length; i++) {
                 if (socket.id !== participants[i]) {
                     io.to(participants[i]).emit('change', delta);
                 }
             }
         } else {
             console.log('could not find problem Id in collaborations');
         }
      });

      socket.on('restoreBuffer', () => {
          let problemId = socketIdToProblemId[socket.id];
          console.log('restore buffer for problem ' + problemId +
            ', socket id' + socket.id);

          if (problemId in collaborations) {
              let instructions = collaborations[problemId]['cachedInstructions'];

              for (let i = 0; i < instructions.length; i++) {
                                // 'change'         delta
                  socket.emit(instructions[i][0], instructions[i][1]);
              }
          } else {
              console.log('no collaboration found for this socket.');
          }
      });

      socket.on('disconnect', () => {
          let problemId = socketIdToProblemId[socket.id];

          console.log('disconnect problem: ' + problemId);

          let foundAndRemoved = false;

          if (problemId in collaborations) {
              let participants = collaborations[problemId]['participants'];
              let index = participants.indexOf(socket.id);

              if (index >= 0) {
                  participants.splice(index, 1);
                  foundAndRemoved = true;

                  // if everyone left, the data should be saved in redis
                  if (participants.length === 0) {
                      console.log('last participants is leaving, saving to redis');
                      let key = sessionPath + problemId;
                      let value = JSON.stringify(collaborations[problemId]['cachedInstructions']);

                      redisClient.set(key, value, redisClient.redisPrint);
                      redisClient.expire(key, TIMEOUT_IN_SECONDS);

                      delete collaborations[problemId];
                  }
              }
          }

          if (!foundAndRemoved) {
              console.log('warning: could not find id in collaborations');
          }
      });
  });
};