import chai from 'chai';
import chaiHttp from 'chai-http';
import Chance from 'chance';
import app from '../src/server';
import { mochaAsyncHelper } from './helpers';
import { signUp } from './helpers/commands';

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
    it('should noo accept bookings for a trip that is full');
    it('should not accept booking for trip_id that doesn\'t exist');
  });
  describe('GET /bookings', function () {

  });
  describe('DELETE /bookings/:bookingId', function () {

  });
});
