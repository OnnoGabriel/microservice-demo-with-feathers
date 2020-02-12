import assert from 'assert';
import app from '../../src/app';

describe('\'with-auth\' service', () => {
  it('registered the service', () => {
    const service = app.service('with-auth');

    assert.ok(service, 'Registered the service');
  });
});
