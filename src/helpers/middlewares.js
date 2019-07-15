import jwt from 'jsonwebtoken';
import User from '../models/User';
import { SQLErrorCodes } from './index';

export const required = fields => (req, res, next) => {
  for (let i = 0; i < fields.length; i += 1) {
    if (!req.body[fields[i]]) {
      return res.status(400)
        .json({
          status: SQLErrorCodes.not_null_violation.name,
          error: `Field "${fields[i]}" is required`,
        });
    }
  }
  return next();
};

export const authenticated = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Error();
    }
    const token = authorization.replace('Bearer ', '');
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOneById(payload.user_id);
    if (!user) {
      throw new Error();
    }
    req.data = {
      user,
    };
    return next();
  } catch (e) {
    return res.status(401)
      .json({
        status: 'error',
        error: 'Invalid token',
      });
  }
};

export const admin = (req, res, next) => {
  const { user } = req.data || {};
  if (!user) {
    return next();
  }
  const { is_admin } = user;
  if (!is_admin) {
    return res.status(401)
      .json({
        status: 'error',
        error: 'Unauthorized request',
      });
  }
  return next();
};
