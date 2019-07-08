export const asyncHelper = fn => (req, res, next) => Promise.resolve(fn(req, res, next))
  .catch(next);
export const SQLErrorCodes = {
  integrity_constraint_violation: {
    name: 'integrity_constraint_violation',
    code: '23000',
  },
  restrict_violation: {
    name: 'restrict_violation',
    code: '23001',
  },
  not_null_violation: {
    name: 'not_null_violation',
    code: '23502',
  },
  foreign_key_violation: {
    name: 'foreign_key_violation',
    code: '23503',
  },
  unique_violation: {
    name: 'unique_violation',
    code: '23505',
  },
  check_violation: {
    name: 'check_violation',
    code: '23514',
  },
  exclusion_violation: {
    name: 'exclusion_violation',
    code: '23P01',
  },
};

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
