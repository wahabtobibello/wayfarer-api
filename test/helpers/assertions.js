import bcrypt from 'bcrypt';

export const assertPassword = async (password, hashed) => {
  const isSame = await bcrypt.compare(password, hashed);
  isSame.should.eq(true);
};
