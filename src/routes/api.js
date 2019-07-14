import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import TripController from '../controllers/TripController';
import { asyncHelper, required } from '../helpers';

const router = Router();

router.route('/auth/signup')
  .post(required(['first_name', 'last_name', 'password', 'email']),
    asyncHelper(AuthController.signUp));

router.route('/auth/signin')
  .post(required(['password', 'email']),
    asyncHelper(AuthController.signIn));

router.route('/trips')
  .post(required(['bus_id', 'fare', 'origin', 'destination', 'trip_date']),
    asyncHelper(TripController.create))
  .get(asyncHelper(TripController.fetch));

export default router;
