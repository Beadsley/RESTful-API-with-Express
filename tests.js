/* global describe, it */
const assert = require('assert');
const request = require('supertest');
const api = require('.');
const app = api.app;

describe('The /presidents API', function() {
  it('returns all presidents', async function() {
    const resp = await request(app)
      .get('/api/presidents')
      .set('Accept', 'application/json')
      .expect(200);
      
  });

  it('returns one presidents', async function() {
    const pres = { id: '43', from: '2001', to: '2009', name: 'George W. Bush' };
    const resp = await request(app)
      .get('/api/presidents/43')
      .set('Accept', 'application/json')
      .expect(200);

      assert.deepEqual(resp.body, pres);

  });
});
