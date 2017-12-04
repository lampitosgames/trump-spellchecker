//Node Modules
import express from 'express';
import path from 'path';

//Import array of middleware functions
import middleware from './middleware';

//Get a router from express
let router = express.Router();

//Hook in middleware
router.use(middleware);

//Serve static files for the client
router.use('/', express.static(path.join(__dirname, '..', 'client', 'build')));

//Return the main HTML file when a request is made to the default path
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

//Export the router
export default router;
