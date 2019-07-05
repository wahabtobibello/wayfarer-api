import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../src/server';

chai.use(chaiHttp);
const should = chai.should();

describe('Server', () => {
  it('is running', (done) => {
    chai.request(server)
      .get('/api/v1')
      .end((err, res) => {
        should.not.exist(err);
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.should.have.property('status', 'success');
        done();
      });
  });
});
