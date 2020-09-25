const request = require('supertest');
const express = require('express');
const sampleRoute = require('../src/routes/sample');

const testApp = express();
testApp.use('/', sampleRoute);

test('/sample route works', (done) => {
  request(testApp)
    .get('/sample')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect({ status: 'working' })
    .expect(200, done);
});
