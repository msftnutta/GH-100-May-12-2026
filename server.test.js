const request = require('supertest');
const app = require('./server');

describe('GET /api/datetime', () => {
  it('should return date, time, and iso fields', async () => {
    const res = await request(app).get('/api/datetime');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('date');
    expect(res.body).toHaveProperty('time');
    expect(res.body).toHaveProperty('iso');
  });

  it('should return a valid ISO 8601 string', async () => {
    const res = await request(app).get('/api/datetime');
    const parsed = new Date(res.body.iso);
    expect(parsed.toISOString()).toBe(res.body.iso);
  });
});

describe('GET /api/client-info', () => {
  it('should return an ip field', async () => {
    const res = await request(app).get('/api/client-info');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ip');
  });

  it('should use x-forwarded-for header when present', async () => {
    const res = await request(app)
      .get('/api/client-info')
      .set('x-forwarded-for', '1.2.3.4, 5.6.7.8');
    expect(res.body.ip).toBe('1.2.3.4');
  });
});

describe('Static files', () => {
  it('should serve index.html at root', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('World Clock');
  });
});
