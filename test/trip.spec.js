import chai from 'chai';
import chaiHttp from 'chai-http';
import Trip from '../src/models/Trip';
import server from '../src/server';
import { mochaAsyncHelper } from './helpers';

chai.use(chaiHttp);
chai.should();

describe('Trip', () => {
  describe('POST /trips', () => {
    it('should create a trip successfully', mochaAsyncHelper(async () => {
      const input = {
        bus_id: 1,
        origin: 'lagos',
        destination: 'ibadan',
        trip_date: new Date(2019, 11, 21).toISOString(),
        fare: 2000.00,
      };
      const res = await chai.request(server)
        .post('/api/v1/trips')
        .send(input);
      res.should.have.status(201);
      res.body.should.have.property('status', 'success');
      res.body.data.should.have.property('id');
      const record = await Trip.findOneById(res.body.data.id);
      res.body.data.bus_id.should.be.eq(record.bus_id);
      res.body.data.origin.should.be.eq(record.origin);
      res.body.data.destination.should.be.eq(record.destination);
      res.body.data.trip_date.should.be.eq(new Date(record.trip_date).toISOString());
      res.body.data.fare.should.be.eq(record.fare);
    }));
    it('should only accept bus_id that exist in the system');
    it('should not accept origin and destination that are the same');
    it('should not accept trip_date that are in the past');
    it('should only accept fare values greater than 0');
  });
  describe('GET /trips', () => {
    it('should return a list of trips', mochaAsyncHelper(async () => {
      const res = await chai.request(server)
        .get('/api/v1/trips');
      res.should.have.status(200);
      res.body.should.have.property('status', 'success');
      res.body.data.should.be.an('array');
      const records = await Trip.findAll();
      res.body.data.should.be.deep.eq(records.map(record => ({
        ...record,
        trip_date: new Date(record.trip_date).toISOString(),
      })));
    }));
  });
});
