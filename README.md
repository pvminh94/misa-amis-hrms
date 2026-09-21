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
7. [Hệ thống kiểm thử tự động & CI/CD](#-7-hệ-thống-kiểm-thử-tự-động--cicd-quality-gate)
8. [Hướng dẫn triển khai Production](#-8-hướng-dẫn-triển-khai-production)
9. [Khắc phục sự cố thường gặp (FAQ)](#-9-khắc-phục-sự-cố-thường-gặp-faq)

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
| `npm test` | **Chạy toàn bộ 23 bài kiểm thử tự động (Unit & Integration Tests) bằng Vitest.** |
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

### 3. AMIS Chấm công & Quản lý Ca kíp Chuyên sâu (Time & Attendance Engine)
* **Bảng chấm công tổng hợp tháng (Ma trận 30 ngày):** Theo dõi công chi tiết 30 ngày của toàn bộ nhân sự theo các ký hiệu chuẩn: `X` (Đủ công 8h), `L` (Đi muộn), `P` (Nghỉ phép/Lễ có lương), `KP` (Nghỉ không lương), `OT` (Tăng ca), `CT` (Công tác), `OFF` (Nghỉ tuần).
* **Kiểm tra & Hiệu chỉnh ô công tức thì (Timesheet Inspector):** Nhấp chuột vào bất kỳ ô công nào để xem giờ check-in, check-out thực tế hoặc sửa công. **Hệ thống tự động liên kết cập nhật lại bảng lương của nhân sự ngay lập tức!**
* **Quản lý danh mục Ca làm việc (Shift Definitions):** Định nghĩa linh hoạt Ca hành chính (08:00 - 17:30), Ca sáng (4h), Ca chiều (4h), Ca đêm (22:00 - 06:00, hệ số 1.3 có phụ cấp làm đêm 30% theo luật lao động).
* **Đăng ký & Phê duyệt Đổi ca làm việc (Shift Swap Requests):** Nhân viên đăng ký đổi ca trực với đồng nghiệp, Quản lý phê duyệt trực tuyến 1-click.
* **Đơn giải trình Chấm công / Bù công (Attendance Regularization):** Giải trình quên quẹt thẻ, lỗi thiết bị hoặc đi công tác ngoại tỉnh kèm ảnh minh chứng. Khi duyệt sẽ tự động bù đủ công.
* **Cấu hình vị trí GPS Geofencing & Wifi:** Thiết lập bán kính cho phép quẹt thẻ (100m, 150m) tại các trụ sở Hà Nội, TP.HCM, Đà Nẵng và danh sách Wifi BSSID hợp lệ.
* **Xuất Bảng chấm công 30 ngày ra file Excel (CSV).**

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

### 6. Cơ cấu tổ chức & Thiết lập hệ thống (Organization & Settings)
* Sơ đồ phân cấp các Khối / Phòng ban.
* Khung chức danh và tiêu chuẩn cấp bậc chuyên môn.
* Cấu hình tham số doanh nghiệp, thời gian ca làm việc hành chính, tỷ lệ bảo hiểm và mức giảm trừ thuế.

---

## 🧪 7. Hệ Thống Kiểm Thử Tự Động & CI/CD (Quality Gate)

Hệ thống được trang bị bộ kiểm thử tự động toàn diện với **23 bài test tự động** đạt tỷ lệ thành công 100%:

1. **Kiểm thử Thuế TNCN & Tiền lương (`tests/payroll.test.ts`):**
   * Đóng BHXH bắt buộc 10.5% (8% BHXH + 1.5% BHYT + 1% BHTN).
   * Mức trần đóng BHXH (tối đa 20 lần lương cơ sở = 46.800.000 VNĐ).
   * Miễn thuế phụ cấp ăn trưa hợp lệ (tối đa 730.000 VNĐ).
   * Giảm trừ gia cảnh bản thân (11tr) và người phụ thuộc (4.4tr/người).
   * Biểu thuế lũy tiến từng phần 7 bậc theo luật thuế Việt Nam.
   * Tính lương tăng ca (OT 150%).
   * Cân đối kế toán: `Lương thực lĩnh = Gross - BHXH - Thuế TNCN`.

2. **Kiểm thử Nghiệp vụ Chấm công (`tests/attendance.test.ts`):**
   * Danh mục ca làm việc (Ca hành chính 8h, Ca đêm phụ cấp hệ số 1.3).
   * Phân loại Đúng giờ vs Đi muộn (> 08:30).
   * Tính giờ công làm việc thực tế trừ giờ nghỉ trưa.
   * Điểm Geofencing GPS và danh sách WiFi BSSID hợp lệ.

3. **Kiểm thử DataStore & Liên kết Nghiệp vụ (`tests/db.test.ts`):**
   * Đọc danh sách nhân viên và kiểm tra tính toàn vẹn dữ liệu.
   * Thêm nhân viên mới và tự động sinh bản ghi lương tương ứng.
   * Thêm người phụ thuộc và tự động cập nhật giảm trừ trên bảng lương.
   * Phê duyệt đơn nghỉ phép trực tuyến.
   * Sửa ô công ma trận 30 ngày và tự động liên kết tính lại bảng lương.

4. **Kiểm thử RESTful API Endpoints (`tests/api.test.ts`):**
   * Kiểm thử tích hợp toàn bộ các endpoint Express (`/api/dashboard/stats`, `/api/employees`, `/api/attendance/shifts`, `/api/leaves`, `/api/payroll`, `/api/departments`, `/api/settings`, `/api/health`).

### 🛡️ Git Pre-Push Hook & GitHub Actions CI
* **Pre-Push Hook:** File script `.git/hooks/pre-push` được thiết lập sẵn. Khi bất kỳ ai gõ `git push`, hệ thống tự động chạy `npm test` và `npm run build`. Nếu có bất kỳ bài test nào thất bại hoặc lỗi TypeScript, thao tác đẩy mã nguồn sẽ lập tức bị chặn.
* **GitHub Actions Workflow:** File cấu hình `.github/workflows/ci.yml` tự động kích hoạt mỗi khi có `push` hoặc `pull_request` lên nhánh `main`, đảm bảo kiểm thử và build độc lập trên máy chủ ảo GitHub.

---

## 🚢 8. Hướng dẫn Triển khai Production

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

## ❓ 9. Khắc phục Sự cố Thường gặp (FAQ)

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
