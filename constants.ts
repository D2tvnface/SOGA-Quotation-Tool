import { QuotationData, Section } from './types';
import { generateId } from './utils';

export const INITIAL_SECTIONS: Section[] = [
  {
    id: generateId(),
    romanIndex: 'I',
    title: 'BỘ NHẬN DIỆN THƯƠNG HIỆU ĐẦY ĐỦ',
    items: [
      {
        id: generateId(),
        name: 'Thiết kế gói Branding Pro',
        description: 'Danh thiếp, Tiêu đề thư, Phong bì, Thư mời\nHóa đơn, Phiếu thu – chi, Thẻ nhân viên\nChữ ký email, Background họp online\nĐồng phục nhân viên, Thẻ ra vào\nSocial media template, Slide thuyết trình (PPT)',
        unit: 'Gói',
        quantity: 1,
        price: 15000000
      }
    ]
  },
  {
    id: generateId(),
    romanIndex: 'II',
    title: 'WEBSITE & HẠ TẦNG (adventureocean.vn)',
    items: [
      {
        id: generateId(),
        name: 'Đăng ký tên miền .VN',
        description: 'adventureocean.vn (1 năm)',
        unit: 'Năm',
        quantity: 1,
        price: 750000
      },
      {
        id: generateId(),
        name: 'Hosting Doanh Nghiệp (High Speed)',
        description: 'SSD 10GB, Băng thông không giới hạn, SSL miễn phí',
        unit: 'Năm',
        quantity: 1,
        price: 2400000
      },
      {
        id: generateId(),
        name: 'Thiết kế & Lập trình Website',
        description: 'Giao diện UX/UI hiện đại, chuẩn SEO, Mobile Responsive, CMS quản trị.',
        unit: 'Dự án',
        quantity: 1,
        price: 18000000
      }
    ]
  },
  {
    id: generateId(),
    romanIndex: 'III',
    title: 'HỆ THỐNG EMAIL & TỔNG ĐÀI',
    items: [
      {
        id: generateId(),
        name: 'Google Workspace (Business Starter)',
        description: 'Email theo tên miền, Drive 30GB, Meet (Đơn giá/User/Năm)',
        unit: 'User/Năm',
        quantity: 5,
        price: 1600000
      },
      {
        id: generateId(),
        name: 'Thiết lập hệ thống Tổng đài ảo (Cloud PBX)',
        description: 'Khởi tạo đầu số cố định/hotline, kịch bản lời chào, ghi âm cuộc gọi.',
        unit: 'Gói',
        quantity: 1,
        price: 1500000
      }
    ]
  },
  {
    id: generateId(),
    romanIndex: 'IV',
    title: 'MARKETING KHỞI TẠO',
    items: [
      {
        id: generateId(),
        name: 'Xây dựng hệ thống Marketing nền tảng',
        description: 'Xác thực Google Maps doanh nghiệp.\nThiết lập Fanpage Facebook chuẩn SEO (Ảnh bìa, Avatar, Info).\nThiết lập kênh Youtube, Linkedin profile doanh nghiệp.',
        unit: 'Gói',
        quantity: 1,
        price: 5000000
      }
    ]
  }
];

export const INITIAL_DATA: QuotationData = {
  company: {
    name: 'CÔNG TY CỔ PHẦN SOGA',
    address: 'Tầng 4, 245 Lê Thánh Tôn, Phường Bến Thành, TP.HCM',
    phone: '028.77759.888',
    email: 'info@soga.com.vn',
    taxId: '0312592175',
    logoUrl: 'https://vuottroi.vn/public/images/logo-new.png'
  },
  customer: {
    companyName: 'CÔNG TY TNHH ADVENTURE OCEAN',
    contactPerson: 'Chị Vi',
    projectName: 'Xây dựng hệ thống vận hành & Thương hiệu số'
  },
  meta: {
    quoteNumber: 'BG-2024-AO01',
    date: new Date().toLocaleDateString('vi-VN'),
    validityDays: 15
  },
  sections: INITIAL_SECTIONS,
  vatRate: 8,
  terms: {
    payment: 'Đợt 1: Thanh toán 50% ngay sau khi ký hợp đồng.\nĐợt 2: Thanh toán 50% còn lại sau khi nghiệm thu.\nHình thức: Chuyển khoản ngân hàng.',
    notes: 'Báo giá trên mang tính chất tham khảo, chi phí chính xác có thể thay đổi tùy thuộc vào yêu cầu chi tiết chức năng website và số lượng user thực tế cho Email/Tổng đài.\nPhí tên miền và Hosting gia hạn hàng năm.'
  }
};
