import { Router } from 'express';
import { db } from '../db';

const router = Router();

// GET all employees (supports search, department filter, status filter)
router.get('/', (req, res) => {
  try {
    let employees = db.getEmployees();
    const { search, departmentId, status } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      employees = employees.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.code.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.phone.includes(q)
      );
    }

    if (departmentId && typeof departmentId === 'string' && departmentId !== 'all') {
      employees = employees.filter((e) => e.departmentId === departmentId);
    }

    if (status && typeof status === 'string' && status !== 'all') {
      employees = employees.filter((e) => e.status === status);
    }

    res.json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách nhân viên' });
  }
});

// GET single employee
router.get('/:id', (req, res) => {
  try {
    const employee = db.getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhân sự' });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết nhân viên' });
  }
});

// CREATE employee
router.post('/', (req, res) => {
  try {
    const data = req.body;
    if (!data.fullName || !data.departmentId || !data.positionId) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đủ họ tên, phòng ban và chức danh' });
    }

    // Lookup department and position names
    const depts = db.getDepartments();
    const positions = db.getPositions();
    const dept = depts.find((d) => d.id === data.departmentId);
    const pos = positions.find((p) => p.id === data.positionId);

    const newEmp = db.createEmployee({
      code: data.code || `MISA-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: data.fullName,
      gender: data.gender || 'Nam',
      dob: data.dob || '1995-01-01',
      idCard: data.idCard || '001095000000',
      idCardDate: data.idCardDate || '2022-01-01',
      idCardPlace: data.idCardPlace || 'Cục Cảnh sát QLHC về TTXH',
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      hometown: data.hometown || '',
      education: data.education || 'Đại học',
      departmentId: data.departmentId,
      departmentName: dept ? dept.name : 'Khác',
      positionId: data.positionId,
      positionTitle: pos ? pos.title : 'Chuyên viên',
      joinDate: data.joinDate || '2026-09-01',
      contractType: data.contractType || 'Hợp đồng xác định thời hạn 12 tháng',
      contractStartDate: data.contractStartDate || data.joinDate || '2026-09-01',
      contractEndDate: data.contractEndDate,
      status: data.status || 'active',
      bankAccount: data.bankAccount || { bankName: 'Vietcombank', accountNumber: '', branch: '' },
      salary: data.salary || {
        baseSalary: 15000000,
        allowanceResponsibility: 1000000,
        allowanceLunch: 1500000,
        allowanceGas: 500000,
        dependents: 0,
        taxCode: '',
        insuranceBookNumber: ''
      }
    });

    res.status(201).json({ success: true, data: newEmp, message: 'Thêm nhân viên thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi tạo mới nhân viên' });
  }
});

// UPDATE employee
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.departmentId) {
      const dept = db.getDepartments().find((d) => d.id === updates.departmentId);
      if (dept) updates.departmentName = dept.name;
    }
    if (updates.positionId) {
      const pos = db.getPositions().find((p) => p.id === updates.positionId);
      if (pos) updates.positionTitle = pos.title;
    }

    const updated = db.updateEmployee(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhân sự' });
    }

    res.json({ success: true, data: updated, message: 'Cập nhật thông tin nhân viên thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật nhân viên' });
  }
});

// DELETE employee
router.delete('/:id', (req, res) => {
  try {
    const success = db.deleteEmployee(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhân sự' });
    }
    res.json({ success: true, message: 'Xóa nhân sự thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi xóa nhân sự' });
  }
});

export default router;
