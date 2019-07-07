import bcrypt from 'bcrypt';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHelper, SQLErrorCodes } from '../helpers';

const router = Router();

const validation = fields => (req, res, next) => {
  for (let i = 0; i < fields.length; i += 1) {
    if (!req.body[fields[i]]) {
      return res.status(400)
        .json({
          status: SQLErrorCodes.not_null_violation.name,
          error: `Field "${fields[i]}" is required`,
        });
    }
  }
  next();
};

router.route('/auth/signup')
  .post(validation(['first_name', 'last_name', 'password', 'email']),
    asyncHelper(async (req, res, next) => {
      const {
        first_name, last_name, password, email,
      } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      let record;
      try {
        ({ rows: [record] } = await db.query(
          'INSERT INTO "user"(first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *;',
          [first_name, last_name, email, hashedPassword],
        ));
      } catch (err) {
        // Check if error is due to integrity constraint violation
        if (err.code.substring(0, 2) === '23') {
          const resErr = {};
          switch (err.code) {
            case SQLErrorCodes.not_null_violation.code:
              resErr.status = SQLErrorCodes.unique_violation.name;
              resErr.error = err.detail;
              break;
            case SQLErrorCodes.unique_violation.code:
              resErr.status = SQLErrorCodes.unique_violation.name;
              resErr.error = err.detail;
              break;
            default:
              return next(err);
          }
          return res.status(400)
            .json(resErr);
        }
        return next(err);
      }
      const { id, is_admin: isAdmin } = record;
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
