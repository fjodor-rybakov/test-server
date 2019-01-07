import * as restify from "restify";
import config from "./config";
import {ProjectList} from "./Сontrollers/ProjectList";
import {Project} from "./Сontrollers/Project";
import {Permission} from "./Сontrollers/Permission";
import {Tasks} from "./Сontrollers/Tasks";
import {AuthorizationController, ProfileController} from "./Сontrollers";
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
            origins: config.originUrls,
            allowHeaders: config.allowHeaders
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
        // Авторизация и регистрация
        this.app.post("/api/signIn", AuthorizationController.signIn.bind(this, this.database));
        this.app.post("/api/signUp", AuthorizationController.singUp.bind(this, this.database));

        // Профиль
        this.app.put("/api/profile", ProfileController.updateProfile.bind(this, this.database));
        this.app.get("/api/profile", ProfileController.getProfileData.bind(this, this.database));
        this.app.get("/api/getInfo", ProfileController.getInfo.bind(this, this.database));
        this.app.get("/api/getRoles", ProfileController.getRoles.bind(this, this.database));

        this.app.get("/api/projectList", ProjectList.getProjectList.bind(this, this.database));
        this.app.get("/api/tasksList/:projectId", Tasks.tasksList.bind(this, this.database));

        this.app.get("/api/tracks/:taskId", Tasks.getTracks.bind(this, this.database));
        this.app.post("/api/track", Tasks.addTrack.bind(this, this.database));

        // Проекты
        this.app.get("/api/project/:userId", Project.project.bind(this, this.database));
        this.app.post("/api/createProject", Project.createProject.bind(this, this.database));
        this.app.put("/api/project/:projectId", Project.updateProject.bind(this, this.database));
        this.app.del("/api/project/:projectId", Project.deleteProject.bind(this, this.database));
        this.app.get("/api/project/getMostPopular", Project.getPopular.bind(this, this.database));

        // Таски
        this.app.get("/api/task/:taskId", Project.getTask.bind(this, this.database));
        this.app.post("/api/createTask", Project.createTask.bind(this, this.database));
        this.app.put("/api/task/:taskId", Project.updateTask.bind(this, this.database));
        this.app.del("/api/task/:taskId", Project.deleteTask.bind(this, this.database));

        this.app.get("/api/getProjectTypes", Project.getProjectTypes.bind(this, this.database));

        this.app.post("/api/getUserListByRole", Project.postUserListByRole.bind(this, this.database));

        //get permissions
        this.app.get("/api/createProject/getPermission", Permission.CreateProjectPermission.bind(this, this.database));
        this.app.get("/api/createTrack/getPermission/:taskId", Permission.CreateTrackPermission.bind(this, this.database));
        this.app.get("/api/createTask/getPermission/:projectId", Permission.CreateTaskPermission.bind(this, this.database));
    }
}

export default new App().app;