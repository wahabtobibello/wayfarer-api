import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/server';

chai.use(chaiHttp);
chai.should();

export const adminLogin = async () => {
  const res = await chai.request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'wahaaabello@gmail.com',
      password: '_P@ssw0rd_',
    });
  return res.body.data.token;
};
