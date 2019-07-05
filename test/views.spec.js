import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../src/server';

chai.use(chaiHttp);
chai.should();

describe('Documentation Page', () => {
  it('renders html to client', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.have.property('type', 'text/html');
        done();
      });
  });
});
