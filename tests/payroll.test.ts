import { describe, it, expect } from 'vitest';
import { calculateVietnamesePayroll } from '../server/data/seedData';
import { Employee } from '../server/types';

describe('AMIS HRMS - Phân hệ Tính Lương & Thuế TNCN (Vietnamese Payroll Engine)', () => {
  const mockBaseEmployee: Employee = {
    id: 'emp-test-01',
    code: 'AMIS-9999',
    fullName: 'Nguyễn Văn Test',
    gender: 'male',
    dob: '1992-05-15',
    email: 'test@amis.corp',
    phone: '0901234567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    departmentId: 'dept-it',
    departmentName: 'Khối Công Nghệ & Kỹ Thuật',
    positionId: 'pos-dev',
    positionTitle: 'Kỹ sư phần mềm',
    joinDate: '2023-01-10',
    status: 'active',
    contractType: 'indefinite',
    contractNumber: 'HDLD-2023-9999',
    idCardNumber: '001092008888',
    idCardIssueDate: '2021-04-10',
    idCardIssuePlace: 'Cục Cảnh sát QLHC về TTXH',
    address: 'Hà Nội',
    bankAccount: '1903847291001',
    bankName: 'Techcombank',
    taxCode: '8492019283',
    socialInsuranceNumber: '0129384729',
    salary: {
      baseSalary: 20000000,
      allowanceResponsibility: 1000000,
      allowanceLunch: 730000,
      allowanceGas: 500000,
      dependents: 0
    }
  };

  it('1. Tính đúng tỷ lệ đóng BHXH bắt buộc 10.5% (8% BHXH + 1.5% BHYT + 1% BHTN)', () => {
    const payroll = calculateVietnamesePayroll(mockBaseEmployee, 22, 0);

    // Mức lương đóng BHXH = 20,000,000
    // BHXH 8% = 1,600,000
    // BHYT 1.5% = 300,000
    // BHTN 1% = 200,000
    // Tổng = 2,100,000 (10.5%)
    expect(payroll.bhxh).toBe(1600000);
    expect(payroll.bhyt).toBe(300000);
    expect(payroll.bhtn).toBe(200000);
    expect(payroll.totalInsurance).toBe(2100000);
  });

  it('2. Áp dụng mức trần đóng BHXH (tối đa 20 lần mức lương cơ sở = 46.800.000 VNĐ)', () => {
    const highEarner: Employee = {
      ...mockBaseEmployee,
      salary: {
        ...mockBaseEmployee.salary,
        baseSalary: 80000000 // Cao hơn mức trần 46.8tr
      }
    };

    const payroll = calculateVietnamesePayroll(highEarner, 22, 0);
    const expectedMaxBase = 46800000;
    expect(payroll.bhxh).toBe(Math.round(expectedMaxBase * 0.08));
    expect(payroll.bhyt).toBe(Math.round(expectedMaxBase * 0.015));
    expect(payroll.bhtn).toBe(Math.round(expectedMaxBase * 0.01));
    expect(payroll.totalInsurance).toBe(Math.round(expectedMaxBase * 0.105));
  });

  it('3. Miễn thuế khoản phụ cấp ăn trưa hợp lệ (tối đa 730.000 VNĐ)', () => {
    const empWithHighLunch: Employee = {
      ...mockBaseEmployee,
      salary: {
        ...mockBaseEmployee.salary,
        baseSalary: 30000000,
        allowanceLunch: 1200000 // Vượt mức trần 730.000
      }
    };

    const payroll = calculateVietnamesePayroll(empWithHighLunch, 22, 0);
    // Thu nhập chịu thuế chỉ được giảm trừ tối đa 730k tiền ăn
    const earnedBase = 30000000;
    const allowances = 1000000 + 1200000 + 500000;
    const gross = earnedBase + allowances;
    const nonTaxableLunch = 730000;
    const insurance = Math.round(30000000 * 0.105);
    const personalDeduction = 11000000;
    const expectedTaxableIncome = gross - nonTaxableLunch - insurance - personalDeduction;

    expect(payroll.taxableIncome).toBe(expectedTaxableIncome);
  });

  it('4. Giảm trừ gia cảnh cho người phụ thuộc (4.400.000 VNĐ / người)', () => {
    const highIncomeEmp: Employee = {
      ...mockBaseEmployee,
      salary: {
        ...mockBaseEmployee.salary,
        baseSalary: 35000000,
        dependents: 0
      }
    };
    const empWithoutDep = calculateVietnamesePayroll(highIncomeEmp, 22, 0);
    const empWith2Deps: Employee = {
      ...highIncomeEmp,
      salary: {
        ...highIncomeEmp.salary,
        dependents: 2
      }
    };
    const payrollWith2Deps = calculateVietnamesePayroll(empWith2Deps, 22, 0);

    // Mức giảm trừ thêm cho 2 người phụ thuộc = 8.800.000 VNĐ
    expect(empWithoutDep.taxableIncome - payrollWith2Deps.taxableIncome).toBe(8800000);
    // Thuế TNCN khi có người phụ thuộc phải thấp hơn
    expect(payrollWith2Deps.personalIncomeTax).toBeLessThan(empWithoutDep.personalIncomeTax);
  });

  it('5. Tính chuẩn xác thuế TNCN theo biểu thuế lũy tiến từng phần 7 bậc', () => {
    // Trường hợp 1: Thu nhập chịu thuế <= 0 -> Thuế TNCN = 0
    const lowIncomeEmp: Employee = {
      ...mockBaseEmployee,
      salary: {
        baseSalary: 11000000,
        allowanceResponsibility: 0,
        allowanceLunch: 730000,
        allowanceGas: 0,
        dependents: 0
      }
    };
    const lowPayroll = calculateVietnamesePayroll(lowIncomeEmp, 22, 0);
    expect(lowPayroll.taxableIncome).toBe(0);
    expect(lowPayroll.personalIncomeTax).toBe(0);

    // Trường hợp 2: Bậc 1 (Đến 5 triệu: 5%)
    const tier1Emp: Employee = {
      ...mockBaseEmployee,
      salary: {
        baseSalary: 16000000,
        allowanceResponsibility: 0,
        allowanceLunch: 730000,
        allowanceGas: 0,
        dependents: 0
      }
    };
    const tier1Payroll = calculateVietnamesePayroll(tier1Emp, 22, 0);
    // Gross = 16,000,000 + 730,000 = 16,730,000
    // BHXH 10.5% = 1,680,000
    // Giảm trừ: 730,000 (ăn) + 1,680,000 (BHXH) + 11,000,000 (bản thân) = 13,410,000
    // Taxable = 16,730,000 - 13,410,000 = 3,320,000 (< 5M -> 5%)
    expect(tier1Payroll.taxableIncome).toBe(3320000);
    expect(tier1Payroll.personalIncomeTax).toBe(Math.round(3320000 * 0.05));
  });

  it('6. Tính lương làm thêm giờ (OT Rate 150% ngày thường)', () => {
    const normalPayroll = calculateVietnamesePayroll(mockBaseEmployee, 22, 0);
    const otPayroll = calculateVietnamesePayroll(mockBaseEmployee, 22, 10); // 10 giờ OT

    // Đơn giá 1 giờ = (20,000,000 / 22 / 8) = 113,636.36
    // OT 150% cho 10h = 10 * 113,636.36 * 1.5 = 1,704,545
    const expectedOtPay = Math.round(10 * (20000000 / 22 / 8) * 1.5);
    expect(otPayroll.otPay).toBe(expectedOtPay);
    expect(otPayroll.grossSalary).toBe(normalPayroll.grossSalary + expectedOtPay);
  });

  it('7. Đảm bảo cân đối kế toán: Lương thực lĩnh Net = Gross - BHXH - Thuế TNCN', () => {
    const payroll = calculateVietnamesePayroll(mockBaseEmployee, 21, 5);
    const calculatedNet = payroll.grossSalary - payroll.totalInsurance - payroll.personalIncomeTax;
    expect(payroll.netSalary).toBe(calculatedNet);
  });
});
