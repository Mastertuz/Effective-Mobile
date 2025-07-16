import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth', userRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'User Service is running' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📋 API Endpoints:`);
  console.log(`  POST /api/auth/register - Регистрация пользователя`);
  console.log(`  POST /api/auth/login - Авторизация пользователя`);
  console.log(`  GET /api/auth/users/:id - Получение пользователя по ID`);
  console.log(`  GET /api/auth/users - Получение списка пользователей (только для админа)`);
  console.log(`  PATCH /api/auth/users/:id/block - Блокировка пользователя`);
  console.log(`\n👤 Default admin account:`);
  console.log(`  Email: admin@example.com`);
  console.log(`  Password: admin123`);
});

export default app;
