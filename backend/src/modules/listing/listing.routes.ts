import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  createListingZodSchema,
  updateListingZodSchema,
} from './listing.validate';
import { listingControllers } from './listing.controller';
import { checkAuth } from '../../middlewares/auth.middleware';
import { Role } from '../users/user.interface';

const router = express.Router();

router.post(
  '/',
  checkAuth(...Object.values(Role)),
  validateRequest(createListingZodSchema),
  listingControllers.createListing
);

router.get('/my-listings', checkAuth(...Object.values(Role)), listingControllers.getMyListings);

router.get('/', listingControllers.getAllListings);

router.get('/:id', listingControllers.getSingleListing);

router.patch(
  '/:id',
  checkAuth(...Object.values(Role)),
  validateRequest(updateListingZodSchema),
  listingControllers.updateListing
);

router.delete(
  '/:id',
  checkAuth(...Object.values(Role)),
  listingControllers.deleteListing
);

export const listingRoutes = router;
