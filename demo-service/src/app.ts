import path from 'path';
import favicon from 'serve-favicon';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import { default as feathers, HookContext, Id, Params } from '@feathersjs/feathers';
import configuration from '@feathersjs/configuration';
import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';
const distribution = require('@kalisio/feathers-distributed');

import { Application } from './declarations';
import logger from './logger';
import middleware from './middleware';
import appHooks from './app.hooks';
import channels from './channels';
// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up event channels (see channels.js)
app.configure(channels)


function timeout(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface Data {}

// Register service `demo-service` with only a `get` method
app.use('/demo-service', {
  async get (id: Id, params?: Params): Promise<Data> {
    const delay = parseInt(id.toString());
    if (delay < 10000 && delay > 0) {
      await timeout(delay);
    }
    return {
      'id': id,
      'serviceId': app.get('serviceId'),
      'datetime': new Date().toISOString().substr(11,8)
    };
  }
});

// Set up microservice distribution
app.configure(distribution());

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger } as any));

app.hooks(appHooks);

export default app;
