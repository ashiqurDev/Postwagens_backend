import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { userRoutes } from "../modules/users/user.routes";

export const router = Router();

const moduleRoutes = [
    // Add your route modules here
    {
        path: "/auth",
        route: authRouter
    },
    {
        path: "/users",
        route: userRoutes
    }
];

moduleRoutes.forEach((routeModule) => {
    router.use(routeModule.path, routeModule.route);
});