import chai from 'chai';
import chaiHttp from 'chai-http';
import Chance from 'chance';
import app from '../src/server';
import { mochaAsyncHelper } from './helpers';
import { adminLogin, login, signUp } from './helpers/commands';

chai.use(chaiHttp);
chai.should();
const chance = Chance();

describe('Bookings', function () {
  describe('POST /bookings', function () {
    const fields = {
      first_name: chance.first(),
      last_name: chance.last(),
      email: chance.email(),
      password: chance.string(),
    };
    const self = this;
    before(mochaAsyncHelper(async function () {
      self.token = await signUp(fields);
    }));
    it('should book a trip successfully', mochaAsyncHelper(async function () {
      const res = await chai.request(app)
        .post('/api/v1/bookings')
        .set('authorization', self.token)
        .send({ trip_id: 1 });
      res.should.have.status(201);
    }));
    it('should not accept booking on a trip that has already been booked');
    it('should not accept booking on a trip that has been cancelled');
    it('should noo accept bookings for a trip that is full');
    it('should not accept booking for trip_id that doesn\'t exist');
  });
  describe('GET /bookings', function () {
    const self = this;
    before(mochaAsyncHelper(async function () {
      self.adminToken = await adminLogin();
      self.token = await login({
        email: 'tobibello001@gmail.com',
        password: '_P@ssw0rd_',
      });
    }));
    it('should get all bookings if user is admin', mochaAsyncHelper(async function () {
      const res = await chai.request(app)
        .get('/api/v1/bookings')
        .set('authorization', self.adminToken);
      res.should.have.status(200);
    }));
    it('should get user bookings only if user is not admin', mochaAsyncHelper(async function () {
      const res = await chai.request(app)
        .get('/api/v1/bookings')
        .set('authorization', self.token);
      res.should.have.status(200);
    }));
  });
  describe('DELETE /bookings/:bookingId', function () {
    const self = this;
    before(mochaAsyncHelper(async function () {
      self.token = await login({
        email: 'tobibello001@gmail.com',
        password: '_P@ssw0rd_',
      });
    }));
    it('should delete a booking successfully', mochaAsyncHelper(async function () {
      let res = await chai.request(app)
        .post('/api/v1/bookings')
        .set('authorization', self.token)
        .send({ trip_id: 1 });
      res.should.have.status(201);
      const booking_id = res.body.data.id;
      res = await chai.request(app)
        .delete(`/api/v1/bookings/${booking_id}`)
        .set('authorization', self.token);
      res.should.have.status(200);
      res.body.should.have.property('id', booking_id);
    }));
    it('should not accept delete operations on booking that do not exist');
  });
});
