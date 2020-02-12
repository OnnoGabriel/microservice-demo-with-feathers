import assert from 'assert';
import app from '../../src/app';

describe('\'microservice1\' service', () => {
  it('registered the service', () => {
    const service = app.service('microservice-1');

    assert.ok(service, 'Registered the service');
  });
});
