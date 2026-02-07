import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";

export const router = Router();

const moduleRoutes = [
    // Add your route modules here
    {
        path: "/auth",
        route: authRouter
    }
];

moduleRoutes.forEach((routeModule) => {
    router.use(routeModule.path, routeModule.route);
});