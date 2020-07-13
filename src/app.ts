// This exports the server, so we can use it anywhere we want
// Like in swagger, our app or in tests

import * as cors from 'cors';
import * as express from 'express';

import {
  requestLoggerMiddleware,
} from './middlewares/request.logger.middleware';
import { RegisterRoutes } from './routes';

const app = express();
app.use(cors());

// you can use express.json instead of bodyparser
app.use(express.json());
app.use(requestLoggerMiddleware);

RegisterRoutes(app);

// here we don't spurn any server or do anything, just export server...because many people need it
export default app;