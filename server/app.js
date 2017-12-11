//Node modules
import express from 'express';
import path from 'path';
import http from 'http';
import socketIO from 'socket.io';
//Custom express router
import router from './router';

//Load environment variables if in production
//Needed for twitter API keys.  We don't want to store sensitive info on a public
//git repo
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

//Import tweet state.  This internally handles all of the networking and tweet streams
import TweetState, {Client, TwitterUser} from './state';

//Select the port from an environment variable or default to 5000
//This is needed for Heroku
const port = (process.env.PORT || 5000);

//Express app
let app = express();
//HTTP servver
let server = http.createServer(app);
//Socket server
let io = socketIO.listen(server);

//Hook in the app router
app.use(router);

//On a new connection
io.on('connection', (socket) => {
    //Log the new connection
    console.log("client connected");
    socket.clientObject = new Client(socket);

    //When the client asks to listen to a user, pass that to the tweet state
    socket.on('listenToUser', (data) => {
        TweetState.ListenToUser(data, socket);
    });
    //When the client wants to disconnect from a tweet stream, disconnect them
    socket.on('ignoreUser', (data) => {
        TweetState.IgnoreUser(data, socket);
    });
});

//Start the server listening on this port
server.listen(port, () => {
    console.log("Server listening on " + server.address().port);

    //Listen to and cache tweets from these users by default
    let donaldTrump = new TwitterUser("realDonaldTrump");
});
