import bodyParser from 'body-parser';
import { config as configureEnv } from 'dotenv';
import express from 'express';
import logger from 'morgan';
import path from 'path';

import setGlobals from './config/globals';
import apiRouter from './routes/api';

import indexRouter from './routes/index';

configureEnv();
setGlobals();

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', indexRouter);
app.use('/api/v1', apiRouter);

export default app;
