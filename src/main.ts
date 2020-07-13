import * as dotenv from 'dotenv';
import * as http from 'http';
import App from './app';
import './swagger';
import { DBConnect } from './config/database';

dotenv.config();
const server = http.createServer(App);

server.listen(process.env.PORT);

server.on('error', (err) => {
    console.error(err);
});

server.on('listening', async () => {

    console.info(`Listening on port ${process.env.PORT}`);
    DBConnect()
});

