import { Router } from "express";

export const router = Router();

const moduleRoutes = [
    // Add your route modules here
    {
        path:"",
        route: router
    }
];

moduleRoutes.forEach((routeModule) => {
    router.use(routeModule.path, routeModule.route);
});