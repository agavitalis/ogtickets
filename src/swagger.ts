// This file is just for running swagger docs

import * as swaggerUi from 'swagger-ui-express';

import App from './app';

import './controllers/auth/register.controller';
import './controllers/auth/login.controller';

import './controllers/customer/ticket.controller';
import './controllers/customer/comment.controller';

import './controllers/support/ticket.controller';
import './controllers/support/comment.controller';

import './controllers/admin/user.controller';
import './controllers/admin/ticket.controller';
import './controllers/admin/comment.controller';


try {
    const swaggerDocument = require('../swagger.json');
    App.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (err) {
    console.log('Unable to load swagger.json', err);
}