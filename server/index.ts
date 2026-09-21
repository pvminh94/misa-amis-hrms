import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard';
import employeesRoutes from './routes/employees';
import attendanceRoutes from './routes/attendance';
import leavesRoutes from './routes/leaves';
import payrollRoutes from './routes/payroll';
import departmentsRoutes from './routes/departments';
import settingsRoutes from './routes/settings';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leavesRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'MISA AMIS HRM Enterprise System API',
    version: '4.5.0',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[HRMS Backend] Server listening on http://0.0.0.0:${PORT}`);
});
