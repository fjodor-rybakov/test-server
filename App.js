import * as restify from "restify";
import config from "./config";
import {Permission} from "./Сontrollers/Permission";
import {Tasks} from "./Сontrollers/Tasks";
import {AuthorizationController, ProfileController, ProjectController, TaskController} from "./Сontrollers";
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
        this.app.post("/api/getUserListByRole", ProfileController.getUserListByRole.bind(this, this.database));

        // Проекты
        this.app.get("/api/project/:userId", ProjectController.getProject.bind(this, this.database));
        this.app.get("/api/projectList", ProjectController.getProjectList.bind(this, this.database));
        this.app.post("/api/createProject", ProjectController.createProject.bind(this, this.database));
        this.app.put("/api/project/:projectId", ProjectController.updateProject.bind(this, this.database));
        this.app.del("/api/project/:projectId", ProjectController.deleteProject.bind(this, this.database));
        this.app.get("/api/project/getMostPopular", ProjectController.getPopularProjects.bind(this, this.database));
        this.app.get("/api/getProjectTypes", ProjectController.getProjectTypes.bind(this, this.database));

        // Таски
        this.app.get("/api/task/:taskId", TaskController.getTask.bind(this, this.database));
        this.app.get("/api/tasksList/:projectId", TaskController.tasksList.bind(this, this.database));
        this.app.post("/api/createTask", TaskController.createTask.bind(this, this.database));
        this.app.put("/api/task/:taskId", TaskController.updateTask.bind(this, this.database));
        this.app.del("/api/task/:taskId", TaskController.deleteTask.bind(this, this.database));

        this.app.get("/api/tracks/:taskId", Tasks.getTracks.bind(this, this.database));
        this.app.post("/api/track", Tasks.addTrack.bind(this, this.database));

        //get permissions
        this.app.get("/api/createProject/getPermission", Permission.CreateProjectPermission.bind(this, this.database));
        this.app.get("/api/createTrack/getPermission/:taskId", Permission.CreateTrackPermission.bind(this, this.database));
        this.app.get("/api/createTask/getPermission/:projectId", Permission.CreateTaskPermission.bind(this, this.database));
    }
}

export default new App().app;