# AMIS HRM - Nền Tảng Quản Trị Nguồn Nhân Lực Toàn Diện

> **AMIS HRM Enterprise** là giải pháp phần mềm quản lý nhân sự chuyên nghiệp bằng tiếng Việt, được thiết kế chuẩn mực theo mô hình SaaS quản trị doanh nghiệp hiện đại. Phần mềm tích hợp đầy đủ các phân hệ cốt lõi: Hồ sơ nhân sự chuyên sâu, Chấm công ca kíp, Đơn từ phê duyệt online, Tiền lương chuẩn luật Thuế & BHXH Việt Nam, Cơ cấu tổ chức và Thiết lập hệ thống.

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Node.js-Express_5-000000?logo=express&logoColor=white)](https://expressjs.com/)

---

## 📋 MỤC LỤC

1. [Yêu cầu môi trường](#-1-yêu-cầu-môi-trường)
2. [Hướng dẫn tải về và cài đặt](#-2-hướng-dẫn-tải-về-và-cài-đặt-chi-tiết)
3. [Tài khoản kiểm thử có sẵn](#-3-tài-khoản-kiểm-thử-có-sẵn)
4. [Các lệnh vận hành (NPM Scripts)](#-4-các-lệnh-vận-hành-npm-scripts)
5. [Cấu trúc thư mục dự án](#-5-cấu-trúc-thư-mục-dự-án)
6. [Tổng quan các phân hệ chức năng](#-6-tổng-quan-các-phân-hệ-chức-năng)
7. [Hệ thống kiểm thử tự động & CI/CD](#-8-hệ-thống-kiểm-thử-tự-động--cicd-quality-gate)
8. [Hướng dẫn triển khai Production](#-9-hướng-dẫn-triển-khai-production)
9. [Khắc phục sự cố thường gặp (FAQ)](#-10-khắc-phục-sự-cố-thường-gặp-faq)

---

## 💻 1. Yêu cầu Môi trường

Trước khi cài đặt, vui lòng đảm bảo máy tính của bạn đã cài đặt các công cụ sau:

* **Node.js**: Phiên bản **>= 18.0.0** (Khuyến nghị dùng bản LTS: Node.js 20.x hoặc 22.x).
  * Kiểm tra phiên bản: `node -v`
* **NPM**: Phiên bản **>= 9.0.0** (đi kèm Node.js).
  * Kiểm tra phiên bản: `npm -v`
* **Git**: Dùng để tải mã nguồn.
  * Kiểm tra phiên bản: `git -v`
* **Hệ điều hành hỗ trợ**: Windows 10/11, macOS, Linux (Ubuntu, Debian, CentOS...).

---

## 🚀 2. Hướng dẫn Tải về và Cài đặt Chi tiết

Chỉ với **4 bước đơn giản**, bạn có thể tải về và chạy ứng dụng cục bộ trên máy tính:

### Bước 1: Clone (Tải) mã nguồn từ GitHub về máy
Mở Terminal / PowerShell / Command Prompt trên máy tính của bạn và chạy lệnh:

```bash
git clone https://github.com/pvminh94/misa-amis-hrms.git
```

Sau khi clone xong, chuyển vào thư mục dự án:

```bash
cd misa-amis-hrms
```

---

### Bước 2: Cài đặt các thư viện phụ thuộc (Dependencies)
Cài đặt toàn bộ các gói thư viện frontend và backend:

```bash
npm install
```

> **Mẹo:** Quá trình cài đặt thường mất khoảng 30 - 60 giây tùy thuộc tốc độ mạng internet của bạn.

---

### Bước 3: Khởi chạy môi trường phát triển (Development)
Chạy lệnh duy nhất để khởi động đồng thời cả Backend API và Frontend Dev Server:

```bash
npm run dev
```

Khi chạy thành công, Terminal sẽ hiển thị:
```text
[0] [HRMS Backend] Server listening on http://0.0.0.0:5000
[1] VITE v8.x.x  ready in 400 ms
[1] ➜  Local:   http://localhost:3000/
[1] ➜  Network: http://...:3000/
```

---

### Bước 4: Mở trình duyệt và trải nghiệm
Mở trình duyệt web bất kỳ (Chrome, Edge, Firefox, Safari) và truy cập:

👉 **[http://localhost:3000](http://localhost:3000)**

* Frontend chạy tại: `http://localhost:3000`
* Backend API tự động chạy ngầm tại: `http://localhost:5000` (được cấu hình proxy tự động qua Vite `/api`).

---

## 👥 3. Tài khoản Kiểm thử Có sẵn

Hệ thống đã tích hợp sẵn tính năng **Chuyển đổi vai trò (Role Switcher)** ngay góc trên bên phải thanh Menu:

| Vai trò | Người dùng đại diện | Mã NV | Mô tả quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | Trịnh Văn Cường | `AMIS-0001` | **Toàn quyền:** Quản lý tất cả hồ sơ, ký hợp đồng, duyệt đơn, chốt và chi trả bảng lương, cấu hình công ty. |
| **Trưởng phòng (Manager)** | Vũ Quốc Thái | `AMIS-0002` | **Quản lý bộ phận:** Xem danh bạ nhân sự, phê duyệt/từ chối đơn xin nghỉ phép, OT, xem công của nhóm. |
| **Nhân viên (Employee)** | Phạm Thị Hương Ly | `AMIS-0007` | **Cá nhân:** Chấm công GPS/Wifi, xem hồ sơ cá nhân, nộp đơn xin nghỉ/OT, tra cứu phiếu lương cá nhân. |

---

## 🛠 4. Các Lệnh Vận hành (NPM Scripts)

Trong file `package.json`, các lệnh quản trị được định nghĩa rõ ràng:

| Lệnh | Ý nghĩa chức năng |
| :--- | :--- |
| `npm run dev` | **(Khuyến nghị)** Khởi chạy đồng thời cả Backend Express (kèm tự động tải lại `tsx watch`) và Frontend Vite (`port 3000`). |
| `npm test` | **Chạy toàn bộ 30 bài kiểm thử tự động (Unit & Integration Tests) bằng Vitest.** |
| `npm run test:watch` | Chạy kiểm thử ở chế độ theo dõi thay đổi mã nguồn (Watch mode). |
| `npm run server` | Chỉ khởi chạy riêng Backend API trên cổng `5000`. |
| `npm run client` | Chỉ khởi chạy riêng Frontend Vite trên cổng `3000`. |
| `npm run build` | Biên dịch toàn bộ mã nguồn TypeScript & đóng gói sản phẩm ra thư mục `/dist` cho môi trường Production. |
| `npm run preview` | Chạy thử nghiệm sản phẩm đã được build trong thư mục `/dist`. |

---

## 📂 5. Cấu trúc Thư mục Dự án

```text
misa-amis-hrms/
├── server/                    # MÃ NGUỒN BACKEND (NODE.JS + EXPRESS + TYPESCRIPT)
│   ├── data/
│   │   ├── db.json            # Cơ sở dữ liệu JSON lưu trữ bền vững (Tự động cập nhật)
│   │   └── seedData.ts        # Bộ dữ liệu khởi tạo phong phú (16+ nhân sự mẫu, bảng lương, chấm công)
│   ├── routes/                # Các Router RESTful API tách theo domain nghiệp vụ
│   │   ├── employees.ts       # API hồ sơ nhân sự, hợp đồng, thăng tiến, người phụ thuộc
│   │   ├── attendance.ts      # API chấm công vào/ra ca, bảng điểm danh
│   │   ├── leaves.ts          # API đơn từ & luồng phê duyệt trực tuyến
│   │   ├── payroll.ts         # API tính lương tự động, thuế TNCN, BHXH, phiếu lương
│   │   ├── departments.ts     # API cơ cấu phòng ban & chức danh
│   │   ├── settings.ts        # API cấu hình tham số hệ thống
│   │   └── dashboard.ts       # API số liệu thống kê & cảnh báo
│   ├── db.ts                  # Data Store Engine (CRUD, Transaction, tự động tính thuế/công)
│   ├── index.ts               # File khởi chạy Express Server (Port 5000)
│   └── types.ts               # TypeScript interfaces định nghĩa cấu trúc dữ liệu Backend
│
├── src/                       # MÃ NGUỒN FRONTEND (REACT 18 + TYPESCRIPT + VITE)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx     # Thanh điều hướng trên cùng (Đồng hồ, Điểm danh nhanh, Thông báo, Đổi vai trò)
│   │   │   └── Sidebar.tsx    # Thanh menu bên trái (Có thể thu gọn/mở rộng, huy hiệu thông báo)
│   │   └── modules/           # CÁC PHÂN HỆ QUẢN TRỊ NGHIỆP VỤ
│   │       ├── dashboard/     # Phân hệ Tổng quan: KPI, biểu đồ cơ cấu, sinh nhật, cảnh báo HĐLĐ
│   │       ├── employees/     # Phân hệ Hồ sơ nhân sự: Danh bạ, Form thêm mới, Modal Dossier 7 tabs
│   │       ├── attendance/    # Phân hệ Chấm công: Giả lập GPS/Wifi, bảng công thời gian thực
│   │       ├── leaves/        # Phân hệ Đơn từ: Nghỉ phép, OT 150%, Đi muộn, Modal duyệt
│   │       ├── payroll/       # Phân hệ Tiền lương: Bảng lương tự động, Phiếu lương Payslip (có in)
│   │       ├── organization/  # Phân hệ Cơ cấu tổ chức: Sơ đồ phòng ban, chức danh
│   │       └── settings/      # Phân hệ Thiết lập: Giờ làm việc, tỷ lệ BHXH, mức giảm trừ gia cảnh
│   ├── context/
│   │   ├── AuthContext.tsx    # Quản lý phiên làm việc & phân quyền (Admin / Manager / Employee)
│   │   └── ToastContext.tsx   # Hệ thống thông báo nổi (Toast Notification) thời gian thực
│   ├── services/
│   │   └── api.ts             # API Client giao tiếp đồng bộ với Backend
│   ├── types/
│   │   └── index.ts           # Định nghĩa Typescript toàn bộ ứng dụng Frontend
│   ├── App.tsx                # Ứng dụng gốc kết nối toàn bộ luồng nghiệp vụ
│   ├── main.tsx               # Entry point khởi tạo React DOM
│   └── index.css              # Cấu hình Tailwind CSS v4 & theme AMIS
│
├── index.html                 # Trang chủ HTML chuẩn SEO tiếng Việt
├── package.json               # Cấu hình gói và tập lệnh NPM
├── tsconfig.json              # Cấu hình TypeScript Compiler
└── vite.config.ts             # Cấu hình Vite Dev Server & Proxy API
```

---

## 🌟 6. Tổng quan Các Phân hệ Chức năng

### 1. Tổng quan Nhân sự (HR Dashboard)
* **Bảng chỉ số KPI điều hành:** Số lượng nhân viên chính thức, thử việc, tỷ lệ chuyên cần hôm nay, đơn chờ duyệt, tổng quỹ lương thực chi trong tháng.
* **Biểu đồ phân bổ nguồn lực:** Tỷ lệ phần trăm nhân sự trực thuộc các khối phòng ban.
* **Cảnh báo thông minh:** Nhân sự sắp hết hạn hợp đồng / thử việc (kèm nút tái ký nhanh), sinh nhật trong tháng.

### 2. Quản trị Hồ sơ & Vòng đời Nhân sự (AMIS HR Records)
* **Danh bạ nhân viên:** Tìm kiếm tức thì, lọc theo phòng ban và trạng thái làm việc, xuất Excel (CSV).
* **Hồ sơ nhân viên điện tử chuyên sâu (7 Tabs nghiệp vụ):**
  1. *Sơ yếu lý lịch:* CCCD 12 số, ngày cấp, nơi cấp, ngày sinh, nguyên quán, hộ khẩu thường trú, học vấn.
  2. *Hợp đồng & Phụ lục (Contracts):* Xem toàn bộ lịch sử hợp đồng lao động qua các thời kỳ, ký mới HĐLĐ hoặc phụ lục điều chỉnh lương trực tuyến.
  3. *Quá trình công tác (Work History Timeline):* Dòng thời gian thăng tiến, bổ nhiệm, điều chuyển phòng ban, nâng bậc lương. **Tự động cập nhật mức lương mới vào bảng lương**.
  4. *Người phụ thuộc thuế (Tax Dependents):* Đăng ký người phụ thuộc giảm trừ gia cảnh. **Tự động áp dụng mức giảm trừ 4.400.000 VNĐ/người vào phân hệ Tiền lương**.
  5. *Sổ Khen thưởng & Kỷ luật:* Lưu vết thành tích thi đua khen thưởng và các chế tài kỷ luật lao động.
  6. *Kho Chứng từ số hóa:* Lưu trữ bản scan CCCD, bằng cấp, chứng chỉ, hợp đồng gốc có chữ ký.
  7. *Lương & Ngân hàng:* Cơ cấu thu nhập, phụ cấp ăn trưa, xăng xe, trách nhiệm, số tài khoản ngân hàng chi trả lương.
* **In Sơ yếu lý lịch:** Hỗ trợ xem và in sơ yếu lý lịch chuẩn phục vụ thanh kiểm tra.

### 3. AMIS Chấm công & Quản lý Ca kíp Doanh nghiệp Chuyên sâu (Enterprise Time & Attendance Engine)
* **Đăng ký Sinh trắc Khuôn mặt 3D (Face Biometrics Enrollment):**
  * Thu thập mẫu khuôn mặt 3 góc độ: *Chính diện (0°)*, *Nghiêng trái (15° - 30°)*, *Nghiêng phải (-15° - -30°)*.
  * Trích xuất vector đặc trưng sinh trắc học 512 chiều (`VEC-512-XXXXXXXX`) bảo mật mã hóa AES-256.
  * Danh bạ quản trị hồ sơ FaceID: xem ảnh thumbnail, độ tin cậy nhận diện (99.8%), ngày đăng ký, quét lại hoặc xóa mẫu.
  * Kiểm tra bắt buộc: nhân viên chưa có hồ sơ sinh trắc sẽ bị chặn bấm công và nhận cảnh báo yêu cầu đăng ký trước.
* **Thuật toán Chống Giả Mạo & Xác thực Người Thật (Active Liveness Detection):**
  * Thử thách động tương tác thời gian thực: *Chớp mắt tự nhiên (EAR < 0.2)* và *Xoay đầu 15° (Yaw angle)*.
  * Bộ lọc vân giao thoa **Moiré** và phát lại qua màn hình phẳng (Screen Replay Attack) qua phân tích phổ tần số FFT.
  * Phân tích trường sâu quang học 3D (3D Depth Mesh) loại trừ ảnh in giấy phẳng.
  * Cảm biến con quay hồi chuyển (Gyroscope telemetry) ngăn chặn GPS giả lập (Mock Location).
* **Trung tâm Bấm công Đa phương thức (Omni-Channel Punch Hub):**
  * Tích hợp máy nhận diện khuôn mặt **Hikvision DS-K1T671 AI Face Terminal** (nhiệt độ thân nhiệt, nhận diện 0.3s).
  * Máy quẹt vân tay & thẻ từ **Ronald Jack RJ-8800** (cảm biến SilkID).
  * Ứng dụng di động **AMIS Mobile App PWA** (GPS Geofence + Selfie Liveness AI).
* **Cấu hình Luật Chấm Công Doanh Nghiệp Toàn Diện (Attendance Policy):**
  * Thời gian linh hoạt đi muộn cho phép (*Grace Period*, mặc định 15 phút không phạt).
  * Thời gian cho phép về sớm tối đa (*Early Leave*, 10 phút).
  * Ngưỡng tối thiểu tính tăng ca (*Overtime threshold*, 30 phút).
  * Tiền phạt lũy tiến mỗi phút đi trễ (VND) tự động khấu trừ vào bảng tính lương.
  * Giới hạn số lần đi muộn tối đa trong tháng trước khi lập biên bản kỷ luật.
  * Mức độ nghiêm ngặt Liveness Strictness (*Tiêu chuẩn / Nâng cao / Nghiêm ngặt tối đa*).
  * Bắt buộc kết nối WiFi công ty (`AMIS_CORP_5G`) khi quẹt thẻ.
* **Xếp lịch & Phân ca tháng/tuần (Shift Rostering Planner):** Lập kế hoạch phân bổ ca làm việc trước cho từng nhân sự trong tháng. Hỗ trợ **Phân ca hàng loạt** theo bộ phận (Áp dụng ca hành chính T2-T6, Xoay ca 3 ca 4 kíp) và tự động kiểm tra **Điều 110 Bộ luật Lao động 2019** (khoảng cách nghỉ giữa 2 ca tối thiểu 12 giờ).
* **Nhật ký quẹt thẻ thô máy chấm công (Raw Biometric Punch Logs):** Thu thập và lưu vết từng giây quẹt thẻ từ máy vân tay **Ronald Jack**, máy nhận diện khuôn mặt **Hikvision FaceID AI** (tỷ lệ nhận diện 99.4%) và GPS di động. Nút **"Đồng bộ máy chấm công"** thời gian thực kèm thuật toán ghép cặp thông minh (First-in / Last-out).
* **Bảng chấm công tổng hợp tháng (Ma trận 30 ngày):** Theo dõi công chi tiết 30 ngày của toàn bộ nhân sự theo các ký hiệu chuẩn: `X` (Đủ công 8h), `L` (Đi muộn), `P` (Nghỉ phép/Lễ có lương), `KP` (Nghỉ không lương), `OT` (Tăng ca), `CT` (Công tác), `OFF` (Nghỉ tuần).
* **Kiểm tra & Hiệu chỉnh ô công tức thì (Timesheet Inspector):** Nhấp chuột vào bất kỳ ô công nào để xem giờ check-in, check-out thực tế hoặc sửa công. **Hệ thống tự động liên kết cập nhật lại bảng lương của nhân sự ngay lập tức!**
* **Báo cáo Chuyên cần & Bảng xếp hạng đi muộn (Late Leaderboard):** Thống kê tỷ lệ chuyên cần theo phòng ban, tổng quỹ giờ OT và xếp hạng Top nhân sự đi muộn lũy kế kèm mức độ cảnh báo (Nhắc nhở / Trừ thưởng chuyên cần).
* **Quản lý danh mục Ca làm việc (Shift Definitions):** Định nghĩa linh hoạt Ca hành chính (08:00 - 17:30), Ca sáng (4h), Ca chiều (4h), Ca đêm (22:00 - 06:00, hệ số 1.3 có phụ cấp làm đêm 30% theo luật lao động).
* **Đăng ký & Phê duyệt Đổi ca làm việc (Shift Swap Requests):** Nhân viên đăng ký đổi ca trực với đồng nghiệp, Quản lý phê duyệt trực tuyến 1-click.
* **Đơn giải trình Chấm công / Bù công (Attendance Regularization):** Giải trình quên quẹt thẻ, lỗi thiết bị hoặc đi công tác ngoại tỉnh kèm ảnh minh chứng. Khi duyệt sẽ tự động bù đủ công.
* **Cấu hình vị trí GPS Geofencing & Wifi:** Thiết lập bán kính cho phép quẹt thẻ (100m, 150m) tại các trụ sở Hà Nội, TP.HCM, Đà Nẵng và danh sách Wifi BSSID hợp lệ.
* **Xuất Bảng chấm công & Lịch phân ca 30 ngày ra file Excel (CSV).**

### 4. AMIS Đơn từ & Phê duyệt trực tuyến (Approval Workflow)
* Hỗ trợ đầy đủ các loại đơn: *Nghỉ phép năm, Làm thêm giờ (OT 150%), Đi muộn/về sớm, Nghỉ ốm hưởng BHXH, Nghỉ không lương*.
* Bộ lọc trạng thái: *Chờ duyệt, Đã duyệt, Từ chối*.
* Phê duyệt nhanh kèm ghi chú từ cấp quản lý.

### 5. AMIS Tiền lương & Thuế TNCN (Payroll & Payslip)
* **Tự động hóa 100% theo Luật Lao động & Thuế Việt Nam:**
  * Lương Gross = (Lương cơ bản / 22 ngày công * Ngày công thực tế) + Các khoản phụ cấp + Lương làm thêm OT.
  * Trích nộp BHXH bắt buộc: BHXH 8%, BHYT 1.5%, BHTN 1% = **10.5%**.
  * Giảm trừ gia cảnh Thuế TNCN: Bản thân **11.000.000 VNĐ** + Người phụ thuộc **4.400.000 VNĐ/người**.
  * Tính thuế TNCN theo đúng **biểu thuế lũy tiến từng phần 7 bậc**.
* Nghiệp vụ: Khóa & Chốt bảng lương, Xác nhận chi trả, Xuất bảng lương ra Excel.
* **Phiếu lương điện tử (Payslip):** Minh bạch từng khoản mục thu nhập, giảm trừ, thực lĩnh nhận về và hỗ trợ nút **In phiếu lương**.

### 6. Cơ cấu tổ chức (Organization)
* Sơ đồ phân cấp các Khối / Phòng ban.
* Khung chức danh và tiêu chuẩn cấp bậc chuyên môn.

### 7. AMIS Quản trị Phân quyền RBAC & An Toàn Thông Tin Doanh Nghiệp (Enterprise RBAC & Security Hub)
* **Ma trận phân quyền chi tiết (Granular Permission Matrix):** Phân định 6 quyền tác vụ độc lập (*Xem, Thêm, Sửa, Xóa, Phê duyệt, Xuất file*) trên 8 phân hệ cốt lõi (`dashboard`, `employees`, `attendance`, `leaves`, `payroll`, `organization`, `admin_rbac`, `settings`).
* **Phạm vi dữ liệu động (Data Scoping Engine):**
  * *Toàn bộ công ty (All Company)*: Dành cho Ban Giám Đốc, Quản trị hệ thống cấp cao.
  * *Phòng ban trực thuộc (Department Scope)*: Giới hạn theo khối/bộ phận của cấp Trưởng bộ phận.
  * *Chi nhánh / Điểm làm việc (Branch Scope)*: Giới hạn theo cơ sở/nhà máy.
  * *Dữ liệu cá nhân (Self-Service)*: Chỉ cho phép xem/thao tác dữ liệu của chính tài khoản.
* **Quản lý Danh bạ Tài khoản (User Directory & Account Controls):**
  * Khởi tạo tài khoản người dùng mới trực tiếp trong trang quản trị (`POST /api/admin/users`).
  * Danh bạ người dùng đồng bộ hồ sơ nhân sự, trạng thái kích hoạt, huy hiệu vai trò và trạng thái 2FA.
  * Khóa / Mở khóa tài khoản khẩn cấp chỉ bằng 1 cú nhấp chuột.
  * Cơ chế cấp lại mật khẩu tạm thời an toàn (Temporary Password Generator) bắt buộc đổi mật khẩu khi truy cập.
  * Gán và thay đổi vai trò phân quyền người dùng trực tiếp trên giao diện.
* **Nhật ký Truy vết Bảo mật (Security Audit Trail):**
  * Ghi nhận bất biến (Append-only) mọi sự kiện nhạy cảm: sửa phân quyền, gán vai trò, khóa tài khoản, đăng nhập, duyệt đơn, xuất file.
  * Hỗ trợ tìm kiếm, lọc theo phân hệ và xuất file báo cáo **CSV** phục vụ kiểm toán nội bộ.
* **Chính sách An toàn Thông tin & Quản trị Phiên (Security & Session Policy):**
  * Thiết lập độ dài tối thiểu của mật khẩu, yêu cầu bắt buộc chữ hoa, số và ký tự đặc biệt.
  * Quy định thời gian tự động khóa phiên làm việc (Session Inactivity Timeout).
  * Giới hạn số lần đăng nhập sai tối đa trước khi tài khoản tự động bị khóa bảo vệ.
  * Bắt buộc xác thực đa yếu tố 2FA (Two-Factor Authentication).
  * Danh sách trắng địa chỉ IP (IP Whitelisting) dành riêng cho các tác vụ Quản trị viên từ mạng nội bộ doanh nghiệp.

### 8. AMIS Xác Thực Đăng Nhập & Tiếp Nhận Tuyển Dụng Từ CRM A-Z (Authentication & CRM Onboarding Pipeline)
* **Cổng Đăng Nhập Doanh Nghiệp (Enterprise Login Portal):**
  * Giao diện đăng nhập chuẩn mực AMIS HRM, hỗ trợ đăng nhập bằng Tên đăng nhập hoặc Email.
  * Bật/Tắt xem mật khẩu, tùy chọn "Ghi nhớ phiên đăng nhập", liên hệ hỗ trợ khôi phục mật khẩu.
  * **Trải nghiệm nhanh 1-Click (Demo Logins):** Cho phép kiểm thử tức thì 4 vai trò đại diện:
    1. 👑 *Tổng Giám Đốc (Super Admin)*: Toàn quyền cấu hình, phê duyệt và quản trị RBAC.
    2. 👔 *Trưởng Khối Tech (Manager)*: Quản lý hồ sơ phòng ban, duyệt công, duyệt phép.
    3. 👩‍💼 *Chuyên viên C&B (HR & Payroll)*: Quản lý tiền lương, BHXH và hồ sơ nhân sự.
    4. 👨‍💻 *Nhân viên Tiêu Chuẩn (Employee)*: Tự phục vụ cá nhân (ESS), chấm công, nộp đơn từ.
  * Nút Đăng xuất (Logout) an toàn trên thanh điều hướng góc phải, xóa sạch phiên và quay về trang đăng nhập.
* **Tiếp Nhận Ứng Viên Từ Tuyển Dụng / CRM (CRM Talent Pool Pipeline):**
  * Danh mục ứng viên đã trúng tuyển từ các kênh tuyển dụng (TopCV, LinkedIn, Giới thiệu nội bộ).
  * Nút **"Tiếp nhận & Onboarding ngay" (1-Click Convert)**: Tự động chuyển đổi hồ sơ ứng viên thành Nhân viên chính thức trong công ty.
* **Quy Trình Onboarding A-Z Tự Động Kích Hoạt 100%:**
  1. *Hồ sơ nhân sự:* Tạo bản ghi với mã số `AMIS-xxxx` và lưu trữ đầy đủ thông tin định danh cá nhân.
  2. *Hợp đồng lao động:* Tự động sinh bản ghi HĐLĐ đầu tiên (HĐ thử việc 2 tháng hoặc chính thức 12 tháng) có mã số chuẩn hóa `HĐLĐ-2026/AMIS-xxxx`.
  3. *Lịch phân ca (Rostering):* Tự động xếp lịch phân ca hành chính chuẩn 22 ngày công trong tháng.
  4. *Bảng lương:* Tự động tính toán và thêm dòng lương vào Bảng lương tháng hiện tại.
  5. *Tài khoản hệ thống (User Account Provisioning):* Tự động khởi tạo tài khoản đăng nhập với tên người dùng, mật khẩu mặc định `Amis@123456` và gán vai trò tương ứng.
  6. *Nhật ký truy vết:* Tự động ghi bản ghi Audit Trail ghi nhận hành vi tiếp nhận nhân sự.
* **Quản Trị Thôi Việc (Offboarding Governance):**
  * Quy trình 3 bước chuẩn hóa: Khóa tài khoản thu hồi quyền truy cập bảo mật -> Bàn giao thiết bị & công việc -> Quyết toán tiền lương, phép năm và chốt sổ BHXH.

---

## 🧪 8. Hệ Thống Kiểm Thử Tự Động & CI/CD (Quality Gate)

Hệ thống được trang bị bộ kiểm thử tự động toàn diện với **55 bài test tự động** đạt tỷ lệ thành công 100%:

1. **Kiểm thử Xác thực Đăng nhập & Tiếp nhận Onboarding A-Z (`tests/onboarding_auth.test.ts` - 9 tests):**
   * Đăng nhập thành công với tài khoản Quản trị viên (Super Admin).
   * Từ chối đăng nhập khi sai mật khẩu và bắt lỗi chính sách khóa tài khoản.
   * Lấy danh sách tài khoản Demo kiểm thử 1-click.
   * Đăng xuất và ghi nhận nhật ký Audit Trail.
   * Quản trị viên tạo tài khoản người dùng mới thành công qua `POST /api/admin/users`.
   * Bắt lỗi trùng lặp tên đăng nhập trong hệ thống.
   * Lấy danh sách ứng viên đã trúng tuyển từ CRM qua `GET /api/employees/candidates`.
   * Tiếp nhận ứng viên CRM thành nhân viên chính thức 1-click (`POST /api/employees/candidates/:id/convert`).
   * Kiểm thử luồng Onboarding A-Z: Tự động sinh HĐLĐ, phân ca 30 ngày, bảng lương và tài khoản đăng nhập.

2. **Kiểm thử Quản trị Phân quyền & RBAC (`tests/rbac.test.ts` - 16 tests):**
   * Đọc danh mục vai trò hệ thống và vai trò tùy biến.
   * Tạo vai trò mới với ma trận phân quyền chi tiết 6 quyền trên 8 phân hệ.
   * Cập nhật động quyền hạn vai trò và lưu trữ thời gian thực.
   * Cơ chế bảo vệ bất khả xâm phạm đối với các vai trò mặc định của hệ thống (`ROLE_SUPER_ADMIN`).
   * Truy vấn danh sách tài khoản người dùng gắn liền với vai trò tương ứng.
   * Khóa và mở khóa tài khoản người dùng 1 chạm.
   * Phân bổ và thay đổi vai trò của người dùng.
   * Sinh mật khẩu tạm thời bảo mật khi thực hiện reset mật khẩu.
   * Đọc và cập nhật các chính sách bảo mật an toàn thông tin.
   * Tự động sinh nhật ký truy vết (Audit Trail) khi xảy ra các thao tác quản trị.
   * Kiểm thử RESTful API phân hệ Admin RBAC (`/api/admin/roles`, `/api/admin/users`, `/api/admin/audit-logs`, `/api/admin/security`).

2. **Kiểm thử Thuế TNCN & Tiền lương (`tests/payroll.test.ts` - 7 tests):**
   * Đóng BHXH bắt buộc 10.5% (8% BHXH + 1.5% BHYT + 1% BHTN).
   * Mức trần đóng BHXH (tối đa 20 lần lương cơ sở = 46.800.000 VNĐ).
   * Miễn thuế phụ cấp ăn trưa hợp lệ (tối đa 730.000 VNĐ).
   * Giảm trừ gia cảnh bản thân (11tr) và người phụ thuộc (4.4tr/người).
   * Biểu thuế lũy tiến từng phần 7 bậc theo luật thuế Việt Nam.
   * Tính lương tăng ca (OT 150%).
   * Cân đối kế toán: `Lương thực lĩnh = Gross - BHXH - Thuế TNCN`.

3. **Kiểm thử Nghiệp vụ Chấm công (`tests/attendance.test.ts` - 8 tests):**
   * Danh mục ca làm việc (Ca hành chính 8h, Ca đêm phụ cấp hệ số 1.3).
   * Phân loại Đúng giờ vs Đi muộn (> 08:30).
   * Tính giờ công làm việc thực tế trừ giờ nghỉ trưa.
   * Điểm Geofencing GPS và danh sách WiFi BSSID hợp lệ.
   * Xếp lịch phân ca động (Shift Rostering Engine) cho nhân sự.
   * Lịch sử bấm công sinh trắc học (Biometric Punch Logs).
   * Thống kê chấm công phân tích nâng cao (Analytics KPI).
   * Áp dụng chính sách ân hạn đi muộn (Grace Period Policy 15 phút).

4. **Kiểm thử DataStore & Liên kết Nghiệp vụ (`tests/db.test.ts` - 5 tests):**
   * Đọc danh sách nhân viên và kiểm tra tính toàn vẹn dữ liệu.
   * Thêm nhân viên mới và tự động sinh bản ghi lương tương ứng.
   * Thêm người phụ thuộc và tự động cập nhật giảm trừ trên bảng lương.
   * Phê duyệt đơn nghỉ phép trực tuyến.
   * Sửa ô công ma trận 30 ngày và tự động liên kết tính lại bảng lương.

5. **Kiểm thử RESTful API Endpoints (`tests/api.test.ts` - 10 tests):**
   * Kiểm thử tích hợp toàn bộ các endpoint Express (`/api/dashboard/stats`, `/api/employees`, `/api/attendance/shifts`, `/api/attendance/locations`, `/api/attendance/rosters`, `/api/attendance/punches`, `/api/attendance/analytics`, `/api/leaves`, `/api/payroll`, `/api/departments`, `/api/settings`, `/api/health`).

### 🛡️ Git Pre-Push Hook & GitHub Actions CI
* **Pre-Push Hook:** File script `.git/hooks/pre-push` được thiết lập sẵn. Khi bất kỳ ai gõ `git push`, hệ thống tự động chạy `npm test` và `npm run build`. Nếu có bất kỳ bài test nào thất bại hoặc lỗi TypeScript, thao tác đẩy mã nguồn sẽ lập tức bị chặn.
* **GitHub Actions Workflow:** File cấu hình `.github/workflows/ci.yml` tự động kích hoạt mỗi khi có `push` hoặc `pull_request` lên nhánh `main`, đảm bảo kiểm thử và build độc lập trên máy chủ ảo GitHub.

---

## 🚢 9. Hướng dẫn Triển khai Production

### Cách 1: Chạy trực tiếp trên VPS/Server với PM2
Nếu bạn muốn triển khai hệ thống lên máy chủ Linux/Ubuntu:

1. **Build mã nguồn:**
   ```bash
   npm run build
   ```
2. **Cài đặt PM2 để quản lý tiến trình:**
   ```bash
   npm install -g pm2
   ```
3. **Khởi chạy Backend với PM2:**
   ```bash
   pm2 start "npx tsx server/index.ts" --name "amis-hrms-api"
   ```
4. **Cấu hình Nginx reverse proxy** để chuyển tiếp cổng `80/443` vào thư mục tĩnh `/dist` và chuyển tiếp `/api` đến cổng `5000`.

---

### Cách 2: Triển khai với Docker & Docker Compose
Tạo file `Dockerfile` trong thư mục gốc:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000 5000
CMD ["npm", "run", "dev"]
```

Khởi chạy bằng Docker:
```bash
docker build -t amis-hrms .
docker run -p 3000:3000 -p 5000:5000 amis-hrms
```

---

## ❓ 10. Khắc phục Sự cố Thường gặp (FAQ)

#### Q1: Tôi gặp lỗi `Error: listen EADDRINUSE: address already in use :::3000` hoặc `:::5000`?
* **Nguyên nhân:** Cổng 3000 hoặc 5000 đang bị một ứng dụng khác chiếm dụng trên máy bạn.
* **Cách khắc phục:**
  * Trên Windows (PowerShell):
    ```powershell
    Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
    Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
    ```
  * Trên macOS/Linux:
    ```bash
    kill -9 $(lsof -t -i:3000)
    kill -9 $(lsof -t -i:5000)
    ```

#### Q2: Sau khi chạy `npm run dev`, trình duyệt mở ra trang trắng hoặc báo không tìm thấy API?
* **Cách khắc phục:** Đảm bảo bạn mở đúng địa chỉ `http://localhost:3000`. Cấu hình proxy trong file `vite.config.ts` sẽ tự động chuyển tiếp tất cả các yêu cầu `/api` sang backend cổng `5000`.

#### Q3: Dữ liệu tôi thêm mới có bị mất khi khởi động lại máy không?
* **Trả lời:** Không! Tất cả dữ liệu (nhân viên, bảng chấm công, người phụ thuộc, hợp đồng, bảng lương) được lưu trữ bền vững tại file `server/data/db.json` theo cơ chế tự động ghi đồng bộ.

---

## 📄 Bản quyền & Đóng góp
Dự án được xây dựng và phát triển phục vụ công tác quản trị nguồn nhân lực doanh nghiệp.
Mọi đóng góp (Pull Request / Issue) vui lòng gửi trực tiếp tại GitHub: [https://github.com/pvminh94/misa-amis-hrms](https://github.com/pvminh94/misa-amis-hrms).
