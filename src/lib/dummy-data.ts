export interface DummyLink {
  id: string;
  slug: string;
  title: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
  uniqueClicks: number;
  status: "active" | "inactive" | "expired";
  tags: string[];
  password?: string | null;
  expiresAt?: string | null;
  qrColor?: string;
  qrBg?: string;
}

export const DUMMY_LINKS: DummyLink[] = [
  {
    id: "1",
    slug: "buket-nikah-jkt",
    title: "Katalog Buket Pernikahan Premium Jakarta Selatan",
    originalUrl: "https://tokobunga.id/katalog/buket-pernikahan-premium-jakarta-selatan",
    shortUrl: "https://pendek.in/s/buket-nikah-jkt",
    createdAt: "2026-10-01",
    clicks: 1247,
    uniqueClicks: 983,
    status: "active",
    tags: ["Bisnis", "Promo"],
    expiresAt: null,
    qrColor: "#00D26A",
    qrBg: "#FFFFFF",
  },
  {
    id: "2",
    slug: "tutorial-copywriting",
    title: "Tutorial Copywriting Menjual untuk Pelaku UMKM",
    originalUrl: "https://youtube.com/watch?v=contoh-video-tutorial-copywriting",
    shortUrl: "https://pendek.in/s/tutorial-copywriting",
    createdAt: "2026-10-03",
    clicks: 452,
    uniqueClicks: 388,
    status: "active",
    tags: ["Edukasi", "YouTube"],
    expiresAt: null,
    qrColor: "#0A0A0A",
    qrBg: "#FFFFFF",
  },
  {
    id: "3",
    slug: "flash-sale-1010",
    title: "Promo Kilat 10.10 Diskon Spektakuler Hingga 70%",
    originalUrl: "https://toko-online-indonesia.com/promo/flash-sale-oktober-spesial",
    shortUrl: "https://pendek.in/s/flash-sale-1010",
    createdAt: "2026-10-09",
    clicks: 2150,
    uniqueClicks: 1890,
    status: "active",
    tags: ["E-Commerce", "Promo"],
    expiresAt: "2026-10-25",
    qrColor: "#FF5C5C",
    qrBg: "#FFFFFF",
  },
  {
    id: "4",
    slug: "portfolio-dimas",
    title: "Portofolio UI/UX Designer Dimas Pratama 2026",
    originalUrl: "https://dimaspratama.design/showcase-2026",
    shortUrl: "https://pendek.in/s/portfolio-dimas",
    createdAt: "2026-09-20",
    clicks: 830,
    uniqueClicks: 612,
    status: "active",
    tags: ["Personal", "Portfolio"],
    expiresAt: null,
    qrColor: "#0A0A0A",
    qrBg: "#F5F5F0",
  },
  {
    id: "5",
    slug: "wa-konsultasi",
    title: "Chat WhatsApp Layanan Pelanggan & Konsultasi Langsung",
    originalUrl: "https://wa.me/6281234567890?text=Halo%20saya%20tertarik%20dengan%20layanan%20Anda",
    shortUrl: "https://pendek.in/s/wa-konsultasi",
    createdAt: "2026-09-15",
    clicks: 340,
    uniqueClicks: 295,
    status: "active",
    tags: ["Customer Service"],
    expiresAt: null,
    qrColor: "#00D26A",
    qrBg: "#FFFFFF",
  },
  {
    id: "6",
    slug: "ebook-gratis",
    title: "Download Gratis E-Book Panduan Digital Marketing Praktis",
    originalUrl: "https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0/view?usp=sharing",
    shortUrl: "https://pendek.in/s/ebook-gratis",
    createdAt: "2026-08-25",
    clicks: 1680,
    uniqueClicks: 1420,
    status: "inactive",
    tags: ["Lead Magnet"],
    password: "rahasia123",
    expiresAt: "2026-09-30",
    qrColor: "#3B82F6",
    qrBg: "#FFFFFF",
  },
  {
    id: "7",
    slug: "webinar-ai",
    title: "Registrasi Eksklusif Webinar AI Automation Batch 3",
    originalUrl: "https://zoom.us/webinar/register/WN_contoh_webinar_ai_2026",
    shortUrl: "https://pendek.in/s/webinar-ai",
    createdAt: "2026-10-05",
    clicks: 1120,
    uniqueClicks: 950,
    status: "expired",
    tags: ["Event", "Webinar"],
    expiresAt: "2026-10-10",
    qrColor: "#0A0A0A",
    qrBg: "#B4FF39",
  },
  {
    id: "8",
    slug: "linktree-sosmed",
    title: "Kumpulan Tautan Resmi Media Sosial & Kanal Komunitas",
    originalUrl: "https://instagram.com/dimas_pratama_uiux",
    shortUrl: "https://pendek.in/s/linktree-sosmed",
    createdAt: "2026-07-10",
    clicks: 590,
    uniqueClicks: 480,
    status: "active",
    tags: ["Sosial Media"],
    expiresAt: null,
    qrColor: "#0A0A0A",
    qrBg: "#FFFFFF",
  },
];

export const DUMMY_ANALYTICS_7_DAYS = [
  { date: "06 Okt", clicks: 145, unique: 112 },
  { date: "07 Okt", clicks: 210, unique: 168 },
  { date: "08 Okt", clicks: 185, unique: 145 },
  { date: "09 Okt", clicks: 340, unique: 280 },
  { date: "10 Okt", clicks: 420, unique: 350 },
  { date: "11 Okt", clicks: 390, unique: 310 },
  { date: "12 Okt", clicks: 462, unique: 375 },
];

export const DUMMY_ANALYTICS_30_DAYS = [
  { date: "13 Sep", clicks: 90, unique: 75 },
  { date: "16 Sep", clicks: 120, unique: 98 },
  { date: "19 Sep", clicks: 150, unique: 124 },
  { date: "22 Sep", clicks: 180, unique: 140 },
  { date: "25 Sep", clicks: 210, unique: 175 },
  { date: "28 Sep", clicks: 290, unique: 230 },
  { date: "01 Okt", clicks: 310, unique: 260 },
  { date: "04 Okt", clicks: 280, unique: 220 },
  { date: "07 Okt", clicks: 420, unique: 345 },
  { date: "10 Okt", clicks: 540, unique: 460 },
  { date: "12 Okt", clicks: 462, unique: 375 },
];

export const DUMMY_REFERRERS = [
  { name: "Direct / Langsung", clicks: 3410, percentage: 41.2 },
  { name: "Instagram", clicks: 2180, percentage: 26.3 },
  { name: "WhatsApp", clicks: 1240, percentage: 15.0 },
  { name: "Twitter / X", clicks: 680, percentage: 8.2 },
  { name: "TikTok", clicks: 450, percentage: 5.4 },
  { name: "Google Search", clicks: 320, percentage: 3.9 },
];

export const DUMMY_DEVICES = [
  { name: "Mobile (Smartphone)", value: 5240, percentage: 63.3, color: "#00D26A" },
  { name: "Desktop (PC / Laptop)", value: 2650, percentage: 32.0, color: "#0A0A0A" },
  { name: "Tablet", value: 390, percentage: 4.7, color: "#B4FF39" },
];

export const DUMMY_COUNTRIES = [
  { code: "ID", name: "Indonesia", clicks: 7120, percentage: 86.0 },
  { code: "MY", name: "Malaysia", clicks: 580, percentage: 7.0 },
  { code: "SG", name: "Singapura", clicks: 310, percentage: 3.7 },
  { code: "US", name: "Amerika Serikat", clicks: 160, percentage: 1.9 },
  { code: "AU", name: "Australia", clicks: 110, percentage: 1.4 },
];

export const DUMMY_CITIES = [
  { name: "Jakarta", clicks: 3240, percentage: 39.1 },
  { name: "Surabaya", clicks: 1450, percentage: 17.5 },
  { name: "Bandung", clicks: 1120, percentage: 13.5 },
  { name: "Medan", clicks: 680, percentage: 8.2 },
  { name: "Yogyakarta", clicks: 540, percentage: 6.5 },
  { name: "Semarang", clicks: 410, percentage: 5.0 },
];

export interface DummyApiKey {
  id: string;
  name: string;
  prefix: string;
  fullKey?: string;
  createdAt: string;
  lastUsedAt: string | null;
  status: "active" | "revoked";
}

export const DUMMY_API_KEYS: DummyApiKey[] = [
  {
    id: "key_1",
    name: "Integrasi Toko Online Webhook",
    prefix: "pk_live_8f3d...4e2a",
    fullKey: "pk_live_8f3d9a2c1b4e5f60718293a4b5c6d7e8f9014e2a",
    createdAt: "2026-09-10",
    lastUsedAt: "2026-10-12 11:42",
    status: "active",
  },
  {
    id: "key_2",
    name: "Zapier & Bot Telegram Otomatis",
    prefix: "pk_live_2c7a...99b1",
    fullKey: "pk_live_2c7ab81943849182390ab1289128381999b1",
    createdAt: "2026-10-01",
    lastUsedAt: "2026-10-11 18:20",
    status: "active",
  },
  {
    id: "key_3",
    name: "Development Localhost API (Testing)",
    prefix: "pk_live_09ea...11fa",
    createdAt: "2026-08-15",
    lastUsedAt: "2026-08-20 09:15",
    status: "revoked",
  },
];

export interface DummyNotification {
  id: string;
  title: string;
  message: string;
  category: "milestone" | "security" | "system" | "expiry";
  timestamp: string;
  read: boolean;
}

export const DUMMY_NOTIFICATIONS: DummyNotification[] = [
  {
    id: "notif_1",
    title: "🎉 Pencapaian Milestone Baru!",
    message: "Tautan 'Katalog Buket Pernikahan' (pendek.in/s/buket-nikah-jkt) berhasil melampaui 1.000 total klik!",
    category: "milestone",
    timestamp: "10 menit yang lalu",
    read: false,
  },
  {
    id: "notif_2",
    title: "🔑 API Key Baru Dibuat",
    message: "API Key 'Zapier & Bot Telegram Otomatis' berhasil di-generate dari IP 180.252.112.44.",
    category: "security",
    timestamp: "2 jam yang lalu",
    read: false,
  },
  {
    id: "notif_3",
    title: "⚠️ Tautan Akan Kadaluarsa",
    message: "Tautan promo 'Promo Kilat 10.10' akan kadaluarsa dalam 13 hari pada 25 Oktober 2026.",
    category: "expiry",
    timestamp: "1 hari yang lalu",
    read: true,
  },
  {
    id: "notif_4",
    title: "🚀 Pembaruan Sistem Pendek-In v1.2",
    message: "Fitur kustomisasi warna QR code dinamis dan format SVG resolusi tinggi kini telah tersedia di dashboard.",
    category: "system",
    timestamp: "3 hari yang lalu",
    read: true,
  },
  {
    id: "notif_5",
    title: "🛡️ Login Berhasil dari Perangkat Baru",
    message: "Akun Anda diakses dari Chrome di macOS (Jakarta, Indonesia). Jika ini bukan Anda, segera ubah sandi.",
    category: "security",
    timestamp: "5 hari yang lalu",
    read: true,
  },
];

export const DUMMY_USER_PROFILE = {
  name: "Dimas Pratama",
  email: "dimas.pratama@gmail.com",
  username: "dimaspratama",
  phone: "+62 812-3456-7890",
  bio: "Lead UI/UX Designer & Digital Entrepreneur berbasis di Jakarta. Pengguna setia Pendek-In untuk link tracking & bio links.",
  avatarUrl: "",
  role: "Member",
  joinedAt: "Juli 2026",
};
