/* eslint-disable prefer-arrow-callback,func-names */
import bcrypt from 'bcrypt';
import chai from 'chai';
import chaiHttp from 'chai-http';
import Chance from 'chance';
import jwt from 'jsonwebtoken';

import server from '../../src/server';

chai.use(chaiHttp);
chai.should();

const chance = Chance();

describe('POST /api/v1/auth/signup', function () {
  context('when all fields are provided and valid', function () {
    it('should return valid token payload', function (done) {
      const validFields = {
        firstName: chance.first(),
        lastName: chance.last(),
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
              record.should.have.property('first_name', validFields.firstName);
              record.should.have.property('last_name', validFields.lastName);
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
  });
});
