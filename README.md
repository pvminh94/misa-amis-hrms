# TỔNG QUAN KIẾN TRÚC HỆ THỐNG MISA AMIS HRM CLONE
## Nền Tảng Quản Trị Nguồn Nhân Lực Doanh Nghiệp Toàn Diện

---

### I. PHÂN TÍCH YÊU CẦU & LỰA CHỌN CÔNG NGHỆ (TECH STACK)

Để xây dựng một phần mềm quản lý nhân sự (HRMS) chuẩn hóa theo mô hình **MISA AMIS HRM** — bộ giải pháp SaaS doanh nghiệp phổ biến nhất tại Việt Nam — hệ thống cần đáp ứng các tiêu chí cốt lõi:
1. **Đặc thù pháp lý & nghiệp vụ Việt Nam:** Tính lương Gross/Net, trích nộp BHXH (8%), BHYT (1.5%), BHTN (1%), mức giảm trừ gia cảnh thuế TNCN (Bản thân 11.000.000 VNĐ, người phụ thuộc 4.400.000 VNĐ/người) và biểu thuế lũy tiến từng phần.
2. **Trải nghiệm giao diện chuẩn Enterprise ERP:** Tone màu nhận diện MISA Blue (`#0072BC`), giao diện gọn gàng, hệ thống bảng dữ liệu mật độ cao (Data Grid), bộ lọc đa tiêu chí, modal đa tab và phiếu lương điện tử có thể in ấn.
3. **Khả năng mở rộng theo từng module độc lập:** Kiến trúc phân tầng rõ ràng giúp đội ngũ phát triển dễ dàng phát triển sâu từng tính năng con (Hồ sơ, Chấm công, Tiền lương, Đơn từ, Đánh giá, Tuyển dụng).

#### Bộ công nghệ được lựa chọn:
* **Frontend:** 
  * `React 18` + `TypeScript`: Đảm bảo độ tin cậy về kiểu dữ liệu (Type-Safety) cho các mô hình nhân sự phức tạp.
  * `Vite v8`: Tốc độ khởi động siêu nhanh (<500ms), Hot-Module-Replacement tức thì.
  * `Tailwind CSS v4`: Hệ thống class tiện ích linh hoạt, dễ dàng tùy biến theo chuẩn Design System MISA.
  * `Lucide React`: Thư viện icon đồng bộ, chuẩn ứng dụng quản trị doanh nghiệp.
* **Backend:** 
  * `Node.js` + `Express` (RESTful API): Kiến trúc phân tách theo domain (Employees, Attendance, Leaves, Payroll, Departments, Settings).
  * `tsx`: Thực thi TypeScript trực tiếp không cần build trung gian.
* **Database & Persistence:**
  * Engine lưu trữ file JSON có cấu trúc (`server/data/db.json`) kèm bộ dữ liệu mẫu (Seed Data) phong phú, chân thực gồm 16+ cán bộ nhân viên, bảng chấm công tháng 09/2026, các loại hợp đồng lao động và bảng lương tự động. Dễ dàng chuyển dịch sang PostgreSQL/MySQL/Prisma.

---

### II. HỆ THỐNG PHÂN HỆ ĐÃ ĐƯỢC XÂY DỰNG HOÀN CHỈNH

Hệ thống nền tảng hiện tại bao gồm đầy đủ 7 phân hệ chính mô phỏng theo **MISA AMIS HRM**:

#### 1. Tổng quan Nhân sự (HR Dashboard)
* Thống kê quân số: Tổng số nhân sự, số lượng nhân sự chính thức, số lượng thử việc.
* Thống kê chấm công thời gian thực: Tỷ lệ chuyên cần trong ngày, số người đúng giờ, đi muộn, nghỉ phép.
* Cảnh báo tự động:
  * Nhân sự sắp hết hạn hợp đồng lao động / thử việc (kèm nút tái ký nhanh).
  * Danh sách sinh nhật nhân sự trong tháng (tháng 9 & 10/2026).
* Biểu đồ cơ cấu nhân sự theo Phòng ban & Khối chuyên môn.
* Tổng quỹ lương thực chi trong tháng.

#### 2. AMIS Thông tin nhân sự (HR Records)
* Danh bạ hồ sơ nhân sự dạng lưới (Data Grid) trực quan với Avatar, Mã NV, Phòng ban, Vị trí, Số điện thoại, Email, Loại hợp đồng, Trạng thái làm việc.
* Thanh công cụ tìm kiếm tức thì và bộ lọc kết hợp theo Phòng ban & Trạng thái (Đang làm việc, Thử việc, Nghỉ chế độ, Đã nghỉ).
* Modal chi tiết hồ sơ nhân sự (Dossier) chia làm 4 tab chuyên sâu:
  1. **Sơ yếu lý lịch:** Họ tên, Giới tính, Ngày sinh, Học vấn, CCCD 12 số, Ngày cấp, Nơi cấp, SĐT, Email công ty, Địa chỉ thường trú, Quê quán.
  2. **Vị trí & Hợp đồng:** Mã NV, Đơn vị trực thuộc, Chức danh, Ngày vào làm việc, Loại HĐLĐ (vô thời hạn, 12 tháng, 36 tháng, thử việc), Thời hạn HĐ.
  3. **Lương, Thuế & BHXH:** Mức lương cơ bản đóng BHXH, Phụ cấp trách nhiệm, Phụ cấp ăn trưa, Phụ cấp xăng xe, Số người phụ thuộc, MST cá nhân, Số sổ BHXH.
  4. **Tài khoản ngân hàng:** Số tài khoản nhận lương, Ngân hàng, Chi nhánh.
* Thêm mới / Chỉnh sửa hồ sơ nhân sự với form nhập liệu đầy đủ validation.
* Xuất dữ liệu nhân sự ra file Excel (CSV chuẩn UTF-8).

#### 3. AMIS Chấm công (Time & Attendance)
* Công cụ giả lập chấm công trực tuyến:
  * Nhận diện văn phòng MISA Cầu Giấy (bán kính GPS 15m, Wifi nội bộ `MISA_CORP_5G`).
  * Nút "Vào ca" và "Ra ca" nhanh ngay trên Navbar và trong phân hệ chấm công.
  * Tự động xác định trạng thái: Đi đúng giờ (trước 08:15) hoặc Đi muộn (sau 08:15).
* Bảng theo dõi điểm danh ngày hôm nay (21/09/2026): Giờ check-in, Giờ check-out, Tổng giờ làm việc thực tế, Trạng thái và Ghi chú giải trình.
* Bộ lọc theo phòng ban và tìm kiếm nhân viên.

#### 4. AMIS Đơn từ & Phê duyệt (Approval Workflow)
* Hỗ trợ các loại hình đơn từ doanh nghiệp:
  * Đơn xin nghỉ phép năm (Hưởng nguyên lương).
  * Đơn đăng ký làm thêm giờ (OT 150%).
  * Đơn giải trình Đi muộn / Về sớm.
  * Đơn xin nghỉ ốm đau (Hưởng trợ cấp BHXH).
  * Đơn xin nghỉ việc riêng không hưởng lương.
* Bộ lọc trạng thái đơn: Tất cả, Chờ phê duyệt, Đã phê duyệt, Đã từ chối.
* Phê duyệt trực tuyến: Quản lý hoặc Admin có thể duyệt nhanh hoặc từ chối kèm ghi chú.
* Form gửi đơn mới thân thiện, trực quan.

#### 5. AMIS Tiền lương & Thuế TNCN (Payroll & Payslip)
* Bảng tính lương tự động tháng 09/2026:
  * Lương Gross = (Lương cơ bản / 22 ngày công * Công thực tế) + Tổng phụ cấp + Lương OT.
  * Trích nộp BHXH bắt buộc theo luật Việt Nam: BHXH 8%, BHYT 1.5%, BHTN 1% = 10.5%.
  * Giảm trừ thuế TNCN: Bản thân 11.000.000 VNĐ + 4.400.000 VNĐ x Số người phụ thuộc.
  * Biểu thuế lũy tiến từng phần theo đúng 7 bậc thuế thu nhập cá nhân Việt Nam.
  * Lương thực lĩnh (Net) minh bạch.
* Thao tác nghiệp vụ:
  * "Khóa & Chốt bảng lương"
  * "Xác nhận chi trả lương"
  * "Xuất bảng lương ra Excel (CSV)"
* Phiếu lương điện tử (Payslip): Hiển thị chi tiết từng khoản mục Thu nhập, Giảm trừ, Thuế TNCN, Thực lĩnh, hỗ trợ nút "In phiếu lương" theo mẫu chứng từ chuẩn.

#### 6. Cơ cấu tổ chức (Organization Structure)
* Sơ đồ phân cấp các Khối/Phòng ban trong doanh nghiệp: Ban Giám Đốc, Khối Công Nghệ & Kỹ Thuật, Khối Kinh Doanh, Khối Nhân Sự & Vận Hành, Phòng Kế Toán.
* Khung vị trí chức danh công việc tiêu chuẩn kèm định biên cấp bậc (Director, Manager, Leader, Senior, Middle).
* Chức năng thêm mới phòng ban vào sơ đồ tổ chức.

#### 7. Thiết lập hệ thống (System Settings)
* Cấu hình thông tin pháp nhân doanh nghiệp (Tên công ty, MST, Địa chỉ trụ sở, Hotline, Email, Website).
* Cấu hình giờ làm việc hành chính: 08:00 - 17:30, Nghỉ trưa 12:00 - 13:30, Ngày công chuẩn 22 ngày.
* Cấu hình tỷ lệ trích nộp bảo hiểm và mức giảm trừ gia cảnh thuế TNCN.
* Ma trận phân quyền 3 cấp độ:
  * **Admin (Quản trị viên):** Toàn quyền kiểm soát hệ thống, phê duyệt bảng lương, cài đặt.
  * **Manager (Trưởng phòng):** Theo dõi công và duyệt đơn từ của nhân viên trực thuộc.
  * **Employee (Nhân viên):** Chấm công cá nhân, nộp đơn từ, tra cứu phiếu lương cá nhân.
* Bộ chuyển đổi góc nhìn vai trò (Role Switcher) ngay trên thanh công cụ để trải nghiệm trực tiếp góc nhìn của từng đối tượng người dùng.

---

### III. KẾ HOẠCH MỞ RỘNG TỪNG MODULE CHI TIẾT (ROADMAP)

Đúng theo định hướng yêu cầu của bạn ("còn từng tính năng module chi tiết thì mình sẽ làm sau từ chức năng một"), hệ thống đã được kiến trúc hóa sẵn sàng để chúng ta đi sâu vào từng tính năng cụ thể tiếp theo:

1. **Giai đoạn 1: Chuyên sâu AMIS Thông tin nhân sự**
   * Quản lý hợp đồng lao động điện tử (Tạo phụ lục hợp đồng, cảnh báo hợp đồng sắp đáo hạn tự động qua email).
   * Lịch sử quá trình công tác: Quyết định bổ nhiệm, thăng chức, điều chuyển phòng ban, tăng lương định kỳ.
   * Hồ sơ đính kèm: Upload tài liệu số (File scan CCCD, bằng đại học, chứng chỉ chuyên môn, sơ yếu lý lịch có công chứng).
   * Khen thưởng & Kỷ luật theo quyết định ban giám đốc.

2. **Giai đoạn 2: Chuyên sâu AMIS Chấm công & Ca kíp**
   * Quản lý phân ca làm việc phức tạp (Ca xoay 3 ca 4 kíp, ca gãy, ca đêm có phụ cấp ca đêm 30%).
   * Tích hợp đồng bộ dữ liệu từ máy chấm công vân tay / khuôn mặt (ZKTeco, Ronald Jack qua TCP/IP hoặc REST API).
   * Cơ chế đăng ký đổi ca giữa các nhân viên và giải trình công có đính kèm ảnh chụp hiện trường.

3. **Giai đoạn 3: Chuyên sâu AMIS Tiền lương & Thuế**
   * Trình thiết kế công thức lương động (Formula Builder giống Excel: hỗ trợ hàm IF, SUM, LOOKUP, KPI bonus).
   * Quản lý tạm ứng lương giữa tháng và tự động cấn trừ khi chốt bảng lương cuối tháng.
   * Quyết toán thuế TNCN cuối năm (Tờ khai quyết toán thuế TNCN mẫu 05/QTT-TNCN theo quy định Tổng cục Thuế).
   * Xuất file ủy nhiệm chi thanh toán lương qua ngân hàng (Vietcombank, Techcombank, BIDV, MB Bank theo định dạng file chuẩn của từng ngân hàng).

4. **Giai đoạn 4: AMIS Đánh giá hiệu suất & KPI / OKRs**
   * Thiết lập chu kỳ đánh giá (Đánh giá tháng, quý, năm hoặc 360 độ).
   * Giao chỉ tiêu KPI/OKR từ cấp công ty xuống phòng ban và từng cá nhân.
   * Tính toán điểm đánh giá tự động liên kết trực tiếp vào hệ số thưởng lương.

5. **Giai đoạn 5: AMIS Tuyển dụng (Recruitment)**
   * Quản lý tin tuyển dụng và chiến dịch thu hút nhân tài.
   * Phễu ứng viên (Ứng tuyển -> Sơ loại hồ sơ -> Phỏng vấn vòng 1 -> Phỏng vấn chuyên môn -> Offer -> Tiếp nhận nhân sự mới (Onboarding)).
