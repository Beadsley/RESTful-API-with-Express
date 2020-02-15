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

  it('return one president', async function () {
    const pres = { id: '43', from: '2001', to: '2009', name: 'George W. Bush' };
    const resp = await request(app)
      .get('/api/presidents/43')
      .set('Accept', 'application/json')
      .expect(200);

    assert.deepEqual(resp.body, pres);

  });

  it('expect president not found', async function () {
    await request(app)
      .get('/api/presidents/1')
      .set('Accept', 'application/json')
      .expect(404);

      const id = '1'

      const pres = {
        id: id,
        from: '2010',
        to: '3000',
        name: 'Barack Obama'
      }
  
      const r1 = await request(app)
        .put(`/api/presidents/`+id)
        .set('Content-Type', 'application/json')
        .send(pres)
        .expect(204);
  });

  it('create new president', async () => {

    const pres = {
      from: '2008',
      name: 'Charles Darwin',
      to: '2020'

    }

    const r1 = await request(app)
      .post(`/api/presidents`)
      .set('Content-Type', 'application/json')
      .send(pres)
      .expect(201);

    const id = r1.body.id;


    const r2 = await request(app)
      .get(`/api/presidents/` + id)
      .set('Accept', 'application/json')
      .expect(200);

    const expected = Object.assign({ id }, pres);
    console.log(r2.body);
    
    assert.deepEqual(r2.body, expected);

  });
  it('create new president with false data', async () => {

    const pres = {
      from: 'sdffds',
      to: '2019',
      name: 'Charles Darwin'
    }

    const r1 = await request(app)
      .post(`/api/presidents`)
      .set('Content-Type', 'application/json')
      .send(pres)
      .expect(400);

  });

  it('reject POST and PUT due to wrong content type', async () => {

    const pres = {
      from: '2008',
      to: '2020',
      name: 'Charles Darwin'
    }

    await request(app)
      .post(`/api/presidents`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(pres)
      .expect(400);

    await request(app)
      .put(`/api/presidents/43`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(pres)
      .expect(400);

  });

  it('create -> get -> delete -> get', async () => {

    const pres = {
      from: '2008',
      to: '2020',
      name: 'Charles Darwin'
    }

    const r1 = await request(app)
      .post(`/api/presidents`)
      .set('Content-Type', 'application/json')
      .send(pres)
      .expect(201);

    const id = r1.body.id;    

    await request(app).get(`/api/presidents/${id}`).set('Accept', 'application/json').expect(200);
    await request(app).delete(`/api/presidents/${id}`).expect(204);
    await request(app).get(`/api/presidents/${id}`).set('Accept', 'application/json').expect(404);
      
  });

  it('-> delete -> get -> delete', async () => {

    const id = 43;

    await request(app).delete(`/api/presidents/${id}`).expect(204);
    await request(app).get(`/api/presidents/${id}`).set('Accept', 'application/json').expect(404);
    await request(app).delete(`/api/presidents/${id}`).expect(404);
      
  });

  it('should update based on id', async () => {

    const id = '44'

    const pres = {
      id: id,
      from: '2010',
      to: '3000',
      name: 'Barack Obama'
    }

    const r1 = await request(app)
      .put(`/api/presidents/`+id)
      .set('Content-Type', 'application/json')
      .send(pres)
      .expect(200);


    const r2 = await request(app)
      .get(`/api/presidents/` + id)
      .set('Accept', 'application/json')
      .expect(200);

      assert.deepEqual(r2.body, pres);

  });

});
