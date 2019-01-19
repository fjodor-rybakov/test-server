import * as restify from "restify";
import config from "./config";
import {
    AuthorizationController,
    ProfileController,
    ProjectController,
    TaskController,
    TrackController,
    PermissionController,
    FeedbackController
} from "./Сontrollers";
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
        this.app.get("/api/role", ProfileController.getRole.bind(this, this.database));
        this.app.get("/api/roles", ProfileController.getRoles.bind(this, this.database));
        this.app.post("/api/usersByRole", ProfileController.getUsersByRole.bind(this, this.database));

        // Проекты
        this.app.get("/api/project/:projectId", ProjectController.getProject.bind(this, this.database));
        this.app.get("/api/projects", ProjectController.getProjects.bind(this, this.database));
        this.app.post("/api/project", ProjectController.createProject.bind(this, this.database));
        this.app.put("/api/project/:projectId", ProjectController.updateProject.bind(this, this.database));
        this.app.del("/api/project/:projectId", ProjectController.deleteProject.bind(this, this.database));
        this.app.get("/api/project/popular", ProjectController.getPopularProjects.bind(this, this.database));
        this.app.get("/api/projectTypes", ProjectController.getProjectTypes.bind(this, this.database));

        // Таски
        this.app.get("/api/task/:taskId", TaskController.getTask.bind(this, this.database));
        this.app.get("/api/tasks/:projectId", TaskController.tasks.bind(this, this.database));
        this.app.post("/api/task", TaskController.createTask.bind(this, this.database));
        this.app.put("/api/task/:taskId", TaskController.updateTask.bind(this, this.database));
        this.app.del("/api/task/:taskId", TaskController.deleteTask.bind(this, this.database));

        // Треки
        this.app.get("/api/track/:taskId", TrackController.getTracks.bind(this, this.database));
        this.app.post("/api/track", TrackController.addTrack.bind(this, this.database));
        this.app.put("/api/track/:taskId", TrackController.updateTrack.bind(this, this.database));
        this.app.del("/api/track/:taskId", TrackController.deleteTrack.bind(this, this.database));

        // Пермишены
        this.app.get("/api/project/permission", PermissionController.CreateProjectPermission.bind(this, this.database));
        this.app.get("/api/track/permission/:taskId", PermissionController.CreateTrackPermission.bind(this, this.database));
        this.app.get("/api/task/permission/:projectId", PermissionController.CreateTaskPermission.bind(this, this.database));

        // Комментарии к задачам
        this.app.post("/api/feedback/:taskId", FeedbackController.createFeedback.bind(this, this.database));
        this.app.get("/api/feedback/list/:taskId", FeedbackController.getAllFeedback.bind(this, this.database));
        this.app.put("/api/feedback/:feedbackId", FeedbackController.updateFeedback.bind(this, this.database));
        this.app.del("/api/feedback/:feedbackId", FeedbackController.deleteFeedback.bind(this, this.database));
    }
}

export default new App().app;