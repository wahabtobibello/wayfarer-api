import bcrypt from 'bcrypt';

export default class User {
  static async create({
                        first_name, last_name, email, password,
                      } = {}) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const {
      rows: [record],
    } = await db.query(
      'INSERT INTO "user"(first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *;',
      [first_name, last_name, email, hashedPassword],
    );
    return record;
  }

  static async findOneById(id) {
    const { rows: [record] } = await db.query('SELECT * from "user" WHERE id=$1',
      [id]);
    return record;
  }
}
