import express from 'express';
import path from 'path';
import http from 'http';
import socketIO from 'socket.io';
import router from './router';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

import tweetListen from './twitter';

//Select the port from an environment variable or default to 8000
//This is needed for Heroku
const port = (process.env.PORT || 5000)

//Express app
let app = express();
//HTTP servver
let server = http.Server(app);
//Socket server
let io = socketIO.listen(server);

//Hook in the app router
app.use(router);

//On a new connection
io.on('connection', (socket) => {
    console.dir("connected!");
    // //Bind createNewPlayer for when the client requests a player
    // socket.on('createNewPlayer', () => {
    //     //Add a new player to the game and store the ID on this socket
    //     socket.playerID = game.addNewPlayer(socket);
    //
    //     //Listen to player updates from the client
    //     socket.on('updatePlayer', (data) => {
    //         game.updatePlayerFromClient(socket, data);
    //     });
    //
    //     //Listen for new attackers
    //     socket.on('tagPlayer', (id) => {
    //         game.declareNewAttacker(id);
    //     });
    //
    //     //Only bind disconnect if the player was created in the first place
    //     //Disconnect the player
    //     socket.on('disconnect', () => {
    //         game.disconnectPlayer(socket.playerID);
    //     });
    // });
});

//Start the server listening on this port
server.listen(port, () => {
    console.log("Server listening on " + server.address().port);

    let listenToUser = 'lampitosgames';

    tweetListen(listenToUser).then((tweetStream) => {
        tweetStream.on('data', (event) => {
            if (event.user.screen_name !== listenToUser) {
                return;
            }
            io.emit('newTweet', event);
            console.log(event);
        });

        tweetStream.on('error', (error) => {
            console.log(error);
        });
    }).catch((err) => console.error(err));
});
