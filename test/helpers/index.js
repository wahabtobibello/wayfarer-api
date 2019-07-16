/* eslint-disable import/prefer-default-export,func-names */
export const mochaAsyncHelper = fn => function (done) {
  fn()
    .then(() => { done(); })
    .catch(done);
};
