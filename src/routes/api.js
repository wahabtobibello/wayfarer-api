import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import BookingController from '../controllers/BookingController';
import TripController from '../controllers/TripController';
import { asyncHelper } from '../helpers';
import { admin, authenticated, required } from '../helpers/middlewares';

const router = Router();

router.route('/auth/signup')
  .post(required(['first_name', 'last_name', 'password', 'email']),
    asyncHelper(AuthController.signUp));

router.route('/auth/signin')
  .post(required(['password', 'email']),
    asyncHelper(AuthController.signIn));

router.route('/trips')
  .post(authenticated, admin, required(['bus_id', 'fare', 'origin', 'destination', 'trip_date']),
    asyncHelper(TripController.create))
  .get(authenticated, asyncHelper(TripController.fetch));

router.route('/trips/:tripId')
  .patch(authenticated, admin, asyncHelper(TripController.cancel));

router.route('/bookings')
  .post(authenticated, required(['trip_id']),
    asyncHelper(BookingController.create))
  .get(authenticated, asyncHelper(BookingController.fetch));

router.route('/bookings/:bookingId')
  .delete(authenticated, asyncHelper(BookingController.delete));

export default router;
