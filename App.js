import * as restify from "restify";
import config from "./config";
import {SignIn} from "./server-middleware/SignIn";
import {SignUp} from "./server-middleware/SignUp";
import {ProjectList} from "./server-middleware/ProjectList";
import {Project} from "./server-middleware/Project";
import {Tasks} from "./server-middleware/Tasks";
import {Profile} from "./server-middleware/Profile";
const corsMiddleware = require('restify-cors-middleware');

class App {
    app;
    database;

    constructor() {
        this.app = restify.createServer({
            name: config.name,
            version: config.version
        });
        this.database = config.db.get;
        this.setSettings();
        this.initRoutes();
    }

    setSettings() {
        const cors = corsMiddleware({
            origins: ["http://localhost:3000"],
            allowHeaders: ["x-guide-key"]
        });
        this.app.use(restify.plugins.acceptParser(this.app.acceptable));
        this.app.use(restify.plugins.queryParser());
        this.app.use(restify.plugins.bodyParser());
        this.app.use(restify.plugins.authorizationParser());
        this.app.use(restify.plugins.multipartBodyParser());
        this.app.pre(cors.preflight);
        this.app.use(cors.actual);
    }

    initRoutes() {
        this.app.post("/api/signIn", SignIn.signIn.bind(this, this.database));
        this.app.post("/api/signUp", SignUp.singUp.bind(this, this.database));

        this.app.get("/api/projectList", ProjectList.getProjectList.bind(this, this.database));
        this.app.post("/api/tasksList", Tasks.tasksList.bind(this, this.database));
        this.app.get("/api/tracks/:taskId", Tasks.tracks.bind(this, this.database));
        this.app.post("/api/addTrack", Tasks.addTrack.bind(this, this.database));

        this.app.put("/api/profile", Profile.updateProfile.bind(this, this.database));
        this.app.get("/api/profile", Profile.getProfileData.bind(this, this.database));

        this.app.get("/api/project/:userId", Project.project.bind(this, this.database));
        this.app.post("/api/getUserListByRole", Project.postUserListByRole.bind(this, this.database));
        this.app.post("/api/createTask", Project.createTask.bind(this, this.database));
    }
}

export default new App().app;