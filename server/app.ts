import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard';
import employeesRoutes from './routes/employees';
import attendanceRoutes from './routes/attendance';
import leavesRoutes from './routes/leaves';
import payrollRoutes from './routes/payroll';
import departmentsRoutes from './routes/departments';
import settingsRoutes from './routes/settings';
import adminRoutes from './routes/admin';
import authRoutes from './routes/auth';

export const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leavesRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'AMIS HRM Enterprise System API',
    version: '4.5.0',
    timestamp: new Date().toISOString()
  });
});
