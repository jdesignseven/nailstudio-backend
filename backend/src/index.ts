import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRouter } from './routes/auth';
import { clientRouter } from './routes/clients';
import { appointmentRouter } from './routes/appointments';
import { serviceRouter } from './routes/services';
import { expenseRouter } from './routes/expenses';
import { studioRouter } from './routes/studio';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'ok', app: 'NailStudio API', version: '1.0.0', endpoints: ['/api/auth', '/api/clients', '/api/appointments', '/api/services', '/api/expenses', '/api/studio', '/api/studio/reports/monthly'] });
});

app.use('/api/auth', authRouter);
app.use('/api/clients', clientRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/services', serviceRouter);
app.use('/api/expenses', expenseRouter);
app.use('/api/studio', studioRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
