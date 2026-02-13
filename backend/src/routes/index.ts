import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes';
import { userRoutes } from '../modules/users/user.routes';
import { listingRoutes } from '../modules/listing/listing.routes';
import { postRoutes } from '../modules/post/post.routes';
import { CommentRoutes } from '../modules/comments/comment.routes';
import { BookmarkRoutes } from '../modules/bookmarks/bookmark.routes';
import { BoostRoutes } from '../modules/boosts/boost.routes';
import { ConversationRoutes } from '../modules/conversations/conversation.routes';
import { VerifiedBadgePriceRoutes } from '../modules/verified_badge_prices/verified_badge_prices.routes';

export const router = Router();

const moduleRoutes = [
  // Add your route modules here
  {
    path: '/auth',
    route: authRouter,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/listings',
    route: listingRoutes,
  },
  {
    path: '/posts',
    route: postRoutes,
  },
  {
    path: '/comments',
    route: CommentRoutes,
  },
  {
    path: '/bookmarks',
    route: BookmarkRoutes,
  },
  {
    path: '/boosts',
    route: BoostRoutes,
  },
  {
    path: '/conversations',
    route: ConversationRoutes,
  },
  {
    path: '/verified-badge-prices',
    route: VerifiedBadgePriceRoutes,
  },
];

moduleRoutes.forEach(routeModule => {
  router.use(routeModule.path, routeModule.route);
});