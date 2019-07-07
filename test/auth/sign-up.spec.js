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
describe('POST /api/v1/auth/signup', function () {
  it('should return valid token payload when all fields are provided and valid', function (done) {
    const validFields = {
      first_name: chance.first(),
      last_name: chance.last(),
      email: chance.email(),
      password: chance.string(),
    };

    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(validFields)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.have.property('status', 'success');
        res.body.should.have.property('data');
        res.body.data.should.have.property('user_id');
        res.body.data.should.have.property('token');
        res.body.data.should.have.property('is_admin');
        db.query('SELECT * from "user" WHERE id=$1', [res.body.data.user_id])
          .then(({ rows: [record] }) => {
            record.should.have.property('id', res.body.data.user_id);
            record.should.have.property('is_admin', res.body.data.is_admin);
            const payload = jwt.verify(res.body.data.token, process.env.JWT_SECRET);
            record.should.have.property('id', payload.user_id);
            record.should.have.property('first_name', validFields.first_name);
            record.should.have.property('last_name', validFields.last_name);
            record.should.have.property('email', validFields.email);
            bcrypt.compare(validFields.password, record.password)
              .then((isSame) => {
                isSame.should.eq(true);
                done();
              });
          })
          .catch(done);
      })
      .catch(done);
  });
  it('should return a 400 if user with email already exists', (done) => {
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
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send({
        ...fields,
        email,
      })
      .then((res) => {
        res.should.have.status(201);
        chai.request(server)
          .post('/api/v1/auth/signup')
          .send({
            ...newFields,
            email,
          })
          .then((newRes) => {
            newRes.should.have.status(400);
            newRes.body.should.have.property('status', SQLErrorCodes.unique_violation.name);
            newRes.body.should.have.property('error');
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
  it('should return 400 if required fields are blank or undefined');
});
