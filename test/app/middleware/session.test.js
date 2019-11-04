

'use strict';

const sleep = require('mz-modules/sleep');
const request = require('supertest');
const assert = require('assert');
const mm = require('egg-mock');

describe('test/app/middlewares/session.test.js', () => {
  let app;
  let agent;
  afterEach(mm.restore);

  [
    'simple-test',
  ].forEach(name => {
    describe(name, () => {
      let token = ''

      before(() => {
        app = mm.app({
          baseDir: name,
          cache: false,
          plugin: 'egg-jwt',
        });
        return app.ready();
      });
      beforeEach(() => {
        agent = request.agent(app.callback());
      });
      after(() => app.close());

      it('test ctx.jwtSign', function* () {
        let result = yield app.context.jwtSign({value: 1}, {expiresIn: 1})
        assert(result, 'should return something')
        token = result
        result = yield app.context.jwtVerify(result)
        assert(result.value === 1, 'decode should success')
      });

      it('should return 401 on no auth header', function* () {
        yield agent
          .get('/get')
          .expect(401)
      });

      it('invalid token should fail', function* () {
        yield agent
          .get('/get?query=a')
          .set('Authorization', `Bearer xxxxx`)
          .expect(401)
      });

      it('invalid config should return 401', function* () {
        yield agent
          .get('/get?query=b')
          .set('Authorization', `Bearer xxxxx`)
          .expect(401)
      });

      it('should bypass this middleware when authToken is present', function* () {
        yield agent
          .get('/get?authToken=d')
          .set('Authorization', `Bearer xxxxx`)
          .expect(200)
      });

      it('should work properly', function* () {
        yield sleep(200);
        yield agent
          .get('/get?query=c')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect('Authorization', /^Bearer /)
          .then(async (resp)=> {
            await sleep(800)

            let result
            try {
              result = await app.context.jwtVerify(resp.headers.authorization.split(' ')[1]);
            } catch (err){
              assert(err, 'should throw')
            }
            assert.equal(resp.body.value, 1)
          })
      });

    });
  });
});
