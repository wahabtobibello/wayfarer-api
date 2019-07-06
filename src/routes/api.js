import bcrypt from 'bcrypt';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHelper } from '../helpers';

const router = Router();

router.route('/auth/signup')
  .post(asyncHelper(async (req, res) => {
    const {
      firstName, lastName, email, password,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows: [{ id, is_admin: isAdmin }] } = await db.query(
      'INSERT INTO "user"(first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, is_admin;',
      [firstName, lastName, email, hashedPassword],
    );
    const token = jwt.sign({ user_id: id }, process.env.JWT_SECRET);
    res.status(201)
      .json({
        status: 'success',
        data: {
          user_id: id,
          token,
          is_admin: isAdmin,
        },
      });
  }));

export default router;
