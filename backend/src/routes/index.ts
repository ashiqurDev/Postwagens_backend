import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { userRoutes } from "../modules/users/user.routes";
import { listingRoutes } from "../modules/listing/listing.routes";
import { postRoutes } from "../modules/post/post.routes";

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
    },
    {
        path: "/listings",
        route: listingRoutes
    },
    {
        path: "/posts",
        route: postRoutes
    }
];

moduleRoutes.forEach((routeModule) => {
    router.use(routeModule.path, routeModule.route);
});