const request = require('supertest');
const express = require('express');
const sampleRoute = require('../src/routes/sample');

const testApp = express();
testApp.use('/', sampleRoute);

test('default / route works', (done) => {
  request(testApp)
    .get('/')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect({ name: 'hello' })
    .expect(200, done);
});

test('default / route works', (done) => {
  request(testApp)
    .get('/test')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect({ name: 'hello' })
    .expect(200, done);
});
