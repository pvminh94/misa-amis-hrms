import { Router } from 'express';
import { db } from '../db';

const router = Router();

// GET payroll for period
router.get('/', (req, res) => {
  try {
    const { period = '2026-09', departmentName, search } = req.query;
    let list = db.getPayroll(typeof period === 'string' ? period : '2026-09');

    if (departmentName && typeof departmentName === 'string' && departmentName !== 'all') {
      list = list.filter((p) => p.departmentName === departmentName);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.employeeName.toLowerCase().includes(q) ||
          p.employeeCode.toLowerCase().includes(q)
      );
    }

    const summary = {
      totalGross: list.reduce((sum, p) => sum + p.grossSalary, 0),
      totalInsurance: list.reduce((sum, p) => sum + p.totalInsurance, 0),
      totalTax: list.reduce((sum, p) => sum + p.personalIncomeTax, 0),
      totalNet: list.reduce((sum, p) => sum + p.netSalary, 0),
      count: list.length
    };

    res.json({ success: true, data: list, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải bảng lương' });
  }
});

// GET single payslip
router.get('/:id', (req, res) => {
  try {
    const record = db.getPayrollById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu lương' });
    }
    const emp = db.getEmployeeById(record.employeeId);
    res.json({ success: true, data: record, employee: emp });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tải phiếu lương' });
  }
});

// Lock / Approve / Pay payroll batch
router.patch('/status', (req, res) => {
  try {
    const { period = '2026-09', status } = req.body;
    if (!['draft', 'approved', 'paid'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }

    db.updatePayrollStatus(period, status);
    res.json({ success: true, message: `Bảng lương kỳ ${period} đã chuyển sang trạng thái: ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật bảng lương' });
  }
});

export default router;
