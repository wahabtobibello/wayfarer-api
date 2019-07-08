import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { asyncHelper, required } from '../helpers';

const router = Router();

router.route('/auth/signup')
  .post(required(['first_name', 'last_name', 'password', 'email']),
    asyncHelper(AuthController.signUp));

export default router;
