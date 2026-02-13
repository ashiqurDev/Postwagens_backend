import express from 'express';
import { BoostController } from './boost.controller';
import { checkAuth } from '../../middlewares/auth.middleware';
import { Role } from '../users/user.interface';

const router = express.Router();

// BoostType routes
router.post(
  '/types',
  checkAuth(Role.ADMIN),
  BoostController.createBoostType,
);
router.get('/types', BoostController.getAllBoostTypes);
router.get(
  '/types/:id',
  BoostController.getBoostTypeById,
);
router.patch(
  '/types/:id',
  checkAuth(Role.ADMIN),
  BoostController.updateBoostType,
);
router.delete(
  '/types/:id',
  checkAuth(Role.ADMIN),
  BoostController.deleteBoostType,
);

// ListingBoost routes
router.post(
  '/',
  checkAuth(...Object.values(Role)),
  BoostController.boostListing,
);
router.get('/active', BoostController.getActiveBoosts);
router.get('/user', checkAuth(...Object.values(Role)), BoostController.getUserBoosts);
router.get('/listing/:listingId', BoostController.getListingBoosts);


export const BoostRoutes = router;
