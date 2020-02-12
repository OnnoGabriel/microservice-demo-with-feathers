import assert from 'assert';
import app from '../../src/app';

describe('\'microservice2\' service', () => {
  it('registered the service', () => {
    const service = app.service('microservice-2');

    assert.ok(service, 'Registered the service');
  });
});
