/* eslint-disable prefer-arrow-callback,func-names */
import bcrypt from 'bcrypt';
import chai from 'chai';
import chaiHttp from 'chai-http';
import Chance from 'chance';
import jwt from 'jsonwebtoken';
import { SQLErrorCodes } from '../../src/helpers';

import server from '../../src/server';

chai.use(chaiHttp);
chai.should();
const chance = Chance();
const signUpRoute = '/api/v1/auth/signup';

const mochaAsync = fn => function (done) {
  fn()
    .then(() => { done(); })
    .catch(done);
};

describe('POST /api/v1/auth/signup', function () {
  it('should return valid token payload when all fields are provided and valid',
    mochaAsync(async function () {
      const validFields = {
        first_name: chance.first(),
        last_name: chance.last(),
        email: chance.email(),
        password: chance.string(),
      };

      const res = await chai.request(server)
        .post(signUpRoute)
        .send(validFields);
      res.should.have.status(201);
      res.body.should.have.property('status', 'success');
      res.body.should.have.property('data');
      res.body.data.should.have.property('user_id');
      res.body.data.should.have.property('token');
      res.body.data.should.have.property('is_admin');
      const { rows: [record] } = await db.query('SELECT * from "user" WHERE id=$1',
        [res.body.data.user_id]);
      record.should.have.property('id', res.body.data.user_id);
      record.should.have.property('is_admin', res.body.data.is_admin);
      const payload = jwt.verify(res.body.data.token, process.env.JWT_SECRET);
      record.should.have.property('id', payload.user_id);
      record.should.have.property('first_name', validFields.first_name);
      record.should.have.property('last_name', validFields.last_name);
      record.should.have.property('email', validFields.email);
      const isSame = await bcrypt.compare(validFields.password, record.password);
      isSame.should.eq(true);
    }));
  it('should return a 400 if user with email already exists',
    mochaAsync(async function () {
      const email = chance.email();
      const fields = {
        first_name: chance.first(),
        last_name: chance.last(),
        password: chance.string(),
      };
      const newFields = {
        first_name: chance.first(),
        last_name: chance.last(),
        password: chance.string(),
      };
      const res = await chai.request(server)
        .post(signUpRoute)
        .send({
          ...fields,
          email,
        });
      res.should.have.status(201);
      const newRes = await chai.request(server)
        .post('/api/v1/auth/signup')
        .send({
          ...newFields,
          email,
        });
      newRes.should.have.status(400);
      newRes.body.should.have.property('status', SQLErrorCodes.unique_violation.name);
      newRes.body.should.have.property('error');
    }));
  it('should return 400 if required fields are blank or undefined');
});
