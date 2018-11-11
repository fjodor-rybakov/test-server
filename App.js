import * as restify from "restify";
import config from "./config";
import {SignIn} from "./server-middleware/SignIn";
import {SignUp} from "./server-middleware/SignUp";
import {ProjectList} from "./server-middleware/ProjectList";
import {Project} from "./server-middleware/Project";
import {Profile} from "./server-middleware/Profile";
import {Authorization} from "./utils/Authorization";

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
        this.app.use(restify.plugins.acceptParser(this.app.acceptable));
        this.app.use(restify.plugins.queryParser());
        this.app.use(restify.plugins.bodyParser());
        this.app.use(restify.plugins.authorizationParser());
        this.app.use(restify.plugins.multipartBodyParser());
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "http://localhost:3000");
            next();
        });
    }

    initRoutes() {
        this.app.post("/api/checkAuthorization", Authorization);
        this.app.post("/api/signIn", SignIn.postSignIn.bind(this, this.database));
        this.app.post("/api/signUp", SignUp.postSignUp.bind(this, this.database));

        this.app.get("/api/getProjects", ProjectList.getProjectList.bind(this, this.database));

        this.app.post("/api/updateProfile", Profile.postUpdateProfile.bind(this, this.database));
        this.app.post("/api/profileData", Profile.postProfileData.bind(this, this.database));

        this.app.post("/api/getProject", Project.postProject.bind(this, this.database));
        this.app.post("/api/getUserListByRole", Project.postUserListByRole.bind(this, this.database));
        this.app.post("/api/createTask", Project.createTask.bind(this, this.database));
    }
}

export default new App().app;