const express = require("express");
const bodyParser = require("body-parser");
import connectToDatabase from "./config/dbconnection";
import { AppConfigData } from "./config/appconfig";
import { routings } from "./routes/api-routes";
import {SocketController} from "./controllers/sockect-connection-controller"
const app = express();
const PORT = AppConfigData.serverDetails.port
export class App {
    appRouter: routings;

    constructor() {
        this.appRouter = new routings();
        app.use(bodyParser.json());
        app.use("/demo", this.appRouter.router);
        try {
            connectToDatabase();
        } catch (err) {
            console.error("Database connection failed", err);
        }

        this.initializeTheServer();
    }

    initializeTheServer() {
        console.log("Initializing server...");
        const http = require('http').createServer(app);
    const io = require('socket.io')(http, {
        cors: {
            origin: '*'
        }
    });
    // io.of('/communication');
    http.listen(PORT, () => {
      console.log(`listening on *:${PORT} URL: http://localhost:8080/demo`);
    });
    new SocketController(io);
    }
}


new App();
