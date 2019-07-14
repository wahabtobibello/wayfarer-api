import chai from 'chai';
import chaiHttp from 'chai-http';
import Chance from 'chance';
import jwt from 'jsonwebtoken';
import { SQLErrorCodes } from '../../src/helpers';
import User from '../../src/models/User';

import server from '../../src/server';
import { mochaAsyncHelper } from '../helpers';
import { assertPassword } from '../helpers/assertions';

chai.use(chaiHttp);
chai.should();
const chance = Chance();
const signUpRoute = '/api/v1/auth/signup';
const signInRoute = '/api/v1/auth/signin';

describe('POST /api/v1/auth/signin', () => {
  const validFields = {
    first_name: chance.first(),
    last_name: chance.last(),
    email: chance.email(),
    password: chance.string(),
  };
  before(mochaAsyncHelper(async () => {
    const signUpRes = await chai.request(server)
      .post(signUpRoute)
      .send(validFields);
    signUpRes.should.have.status(201);
  }));
  it('should login successfully', mochaAsyncHelper(async () => {
    const loginRes = await chai.request(server)
      .post(signInRoute)
      .send({
        email: validFields.email,
        password: validFields.password,
      });
    loginRes.should.have.status(200);
    loginRes.body.should.have.property('status', 'success');
    loginRes.body.data.should.have.property('user_id');
    loginRes.body.data.should.have.property('token');
    loginRes.body.data.should.have.property('is_admin');
    const record = await User.findOneById(loginRes.body.data.user_id);
    record.should.have.property('id', loginRes.body.data.user_id);
    const payload = jwt.verify(loginRes.body.data.token, process.env.JWT_SECRET);
    record.should.have.property('id', payload.user_id);
    record.should.have.property('email', validFields.email);
    await assertPassword(validFields.password, record.password);
  }));
  const assertMissingField = async (res) => {
    res.should.have.status(400);
    res.body.should.have.property('status', SQLErrorCodes.not_null_violation.name);
    res.body.error.should.be.a('string');
  };
  it('should invalidate missing or empty field', mochaAsyncHelper(async () => {
    let loginRes = await chai.request(server)
      .post(signInRoute)
      .send({
        password: validFields.password,
      });
    await assertMissingField(loginRes);

    loginRes = await chai.request(server)
      .post(signInRoute)
      .send({
        email: '',
        password: validFields.password,
      });
    await assertMissingField(loginRes);
  }));
  it('should invalidate missing or empty password field', mochaAsyncHelper(async () => {
    let loginRes = await chai.request(server)
      .post(signInRoute)
      .send({
        email: validFields.email,
      });
    await assertMissingField(loginRes);

    loginRes = await chai.request(server)
      .post(signInRoute)
      .send({
        email: validFields.email,
        password: '',
      });
    await assertMissingField(loginRes);
  }));
  it('should invalidate unknown email field', mochaAsyncHelper(async () => {
    const loginRes = await chai.request(server)
      .post(signInRoute)
      .send({
        email: chance.email(),
        password: validFields.password,
      });
    loginRes.should.have.status(401);
  }));
  it('should invalidate incorrect password field', mochaAsyncHelper(async () => {
    const loginRes = await chai.request(server)
      .post(signInRoute)
      .send({
        email: validFields.email,
        password: chance.string(),
      });
    loginRes.should.have.status(401);
  }));
});
