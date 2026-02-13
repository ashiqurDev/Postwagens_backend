import { Router } from 'express';
import { VerifiedBadgePriceController } from './verified_badge_prices.controller';
import { checkAuth } from '../../middlewares/auth.middleware';
import { Role } from '../users/user.interface';

const router = Router();

router.get(
  '/',
  checkAuth(...Object.values(Role)),
  VerifiedBadgePriceController.getAllBadgePrices,
);

router.get(
  '/:id',
  checkAuth(...Object.values(Role)),
  VerifiedBadgePriceController.getBadgePriceById,
);

router.post(
  '/',
  checkAuth(Role.ADMIN),
  VerifiedBadgePriceController.createBadgePrice,
);

router.patch(
  '/:id',
  checkAuth(Role.ADMIN),
  VerifiedBadgePriceController.updateBadgePrice,
);

router.delete(
  '/:id',
  checkAuth(Role.ADMIN),
  VerifiedBadgePriceController.deleteBadgePrice,
);

export const VerifiedBadgePriceRoutes = router;
