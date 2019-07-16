import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/server';

chai.use(chaiHttp);
chai.should();

export const login = async ({ email, password }) => {
  const res = await chai.request(app)
    .post('/api/v1/auth/signin')
    .send({
      email,
      password,
    });
  return res.body.data.token;
};

export const adminLogin = async () => login({
  email: 'wahaaabello@gmail.com',
  password: '_P@ssw0rd_',
});

export const signUp = async ({
  email, password, first_name, last_name,
}) => {
  const res = await chai.request(app)
    .post('/api/v1/auth/signup')
    .send({
      first_name,
      last_name,
      email,
      password,
    });
  return res.body.data.token;
};
