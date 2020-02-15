/* global describe, it */
const assert = require('assert');
const request = require('supertest');
const api = require('.');
const app = api.app;

describe('The /presidents API', function () {
  it('returns all presidents', async function () {
    const resp = await request(app)
      .get('/api/presidents')
      .set('Accept', 'application/json')
      .expect(200);

  });

  it('returns one presidents', async function () {
    const pres = { id: '43', from: '2001', to: '2009', name: 'George W. Bush' };
    const resp = await request(app)
      .get('/api/presidents/43')
      .set('Accept', 'application/json')
      .expect(200);

    assert.deepEqual(resp.body, pres);

  });

  it('create new president', async () => {

    const pres = {
      from: '2009',
      to: '2017',
      name: 'Barack Obama'
    }

    const r1 = await request(app)
      .post(`/api/presidents`)
      .set('Content-Type', 'application/json')
      .send(pres)
      .expect(204);

      console.log(r1.text);
      

    const r2 = await request(server)
      .get(`//api/presidents`)
      .expect(200);

    console.log(r2.text);

  });
});
