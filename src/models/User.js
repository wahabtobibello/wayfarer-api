import bcrypt from 'bcrypt';

export default class User {
  static async create({
                        first_name, last_name, email, password,
                      } = {}) {
    const {
      rows: [record],
    } = await db.query(
      'INSERT INTO "user"(first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *;',
      [first_name, last_name, email, password],
    );
    return record;
  }

  static async findOneById(id) {
    return User.findOne('id', id);
  }

  static async findOne(field, value) {
    const { rows } = await db.query(`SELECT * from "user" WHERE "${field}"=$1`,
      [value]);
    if (rows.length < 1) {
      return null;
    }
    return rows[0];
  }
}
