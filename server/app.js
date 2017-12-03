import express from 'express';
import path from 'path';
import http from 'http';
// import socketIO from 'socket.io';
import router from './router';
//Select the port from an environment variable or default to 8000
//This is needed for Heroku
const port = (process.env.PORT || 5000)

//Express app
let app = express();
//HTTP servver
let server = http.Server(app);
//Socket server
// let io = socketIO.listen(server);

//Hook in the app router
app.use(router);

//Start the server listening on this port
server.listen(port, () => {
    console.log("Server listening on " + server.address().port);
});
