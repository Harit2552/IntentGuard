import express, { type ErrorRequestHandler } from 'express';
import { port } from './config/env.js';
import { healthRouter } from './routes/health.js';

const app = express();

app.use(express.json());
app.use('/api', healthRouter);
app.use((_request, response) => {
  response.status(404).json({ error: 'Not Found' });
});

const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  console.error(error);
  if (response.headersSent) {
    next(error);
    return;
  }

  response.status(500).json({ error: 'Internal Server Error' });
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
