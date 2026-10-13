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

// ==========================================
// DATA DUMMY ADMIN AREA (TASK 1.6)
// ==========================================

export interface DummyAdminUser {
  id: string;
  name: string;
  email: string;
  role: "member" | "super_admin";
  status: "active" | "suspended";
  linksCount: number;
  totalClicks: number;
  joinedAt: string;
  lastLoginAt: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
}

export const DUMMY_ADMIN_USERS: DummyAdminUser[] = [
  {
    id: "usr-01",
    name: "Dimas Pratama",
    email: "dimas.pratama@gmail.com",
    role: "member",
    status: "active",
    linksCount: 8,
    totalClicks: 3849,
    joinedAt: "01 Jul 2026",
    lastLoginAt: "10 menit yang lalu",
    phone: "+62 812-3456-7890",
    bio: "Lead UI/UX Designer & Digital Entrepreneur berbasis di Jakarta.",
  },
  {
    id: "usr-02",
    name: "Sari Wulandari",
    email: "sari@tokobunga.id",
    role: "member",
    status: "active",
    linksCount: 14,
    totalClicks: 8420,
    joinedAt: "15 Agu 2026",
    lastLoginAt: "2 jam yang lalu",
    phone: "+62 813-9876-5432",
    bio: "Owner Toko Bunga Cantik Jakarta & Florist Specialist.",
  },
  {
    id: "usr-03",
    name: "Budi Santoso",
    email: "budi@spamsite.xyz",
    role: "member",
    status: "suspended",
    linksCount: 3,
    totalClicks: 120,
    joinedAt: "28 Sep 2026",
    lastLoginAt: "3 hari yang lalu",
    phone: "+62 819-0011-2233",
    bio: "Akun ditangguhkan karena pelanggaran pembuatan link undian palsu.",
  },
  {
    id: "usr-04",
    name: "Admin Pendek-In",
    email: "admin@pendek.in",
    role: "super_admin",
    status: "active",
    linksCount: 2,
    totalClicks: 450,
    joinedAt: "01 Jan 2026",
    lastLoginAt: "Sedang Aktif",
    phone: "+62 811-1234-5678",
    bio: "Super Administrator & Pemilik Sistem Pendek-In.",
  },
  {
    id: "usr-05",
    name: "Rian Hidayat",
    email: "rian.h@startup.id",
    role: "member",
    status: "active",
    linksCount: 5,
    totalClicks: 1250,
    joinedAt: "10 Sep 2026",
    lastLoginAt: "Kemarin",
    phone: "+62 856-7890-1234",
    bio: "Growth Marketer di Startup Edutech Jakarta.",
  },
  {
    id: "usr-06",
    name: "Dewi Lestari",
    email: "dewi.lestari@gmail.com",
    role: "member",
    status: "active",
    linksCount: 9,
    totalClicks: 4120,
    joinedAt: "20 Agu 2026",
    lastLoginAt: "4 jam yang lalu",
    phone: "+62 878-1122-3344",
    bio: "Content Creator & Reviewer Gadget.",
  },
];

export interface DummyAdminLink {
  id: string;
  slug: string;
  title: string;
  originalUrl: string;
  shortUrl: string;
  userName: string;
  userEmail: string;
  userId: string;
  clicks: number;
  uniqueClicks: number;
  status: "active" | "expired" | "blocked";
  blockReason?: string;
  createdAt: string;
  tags: string[];
}

export const DUMMY_ADMIN_LINKS: DummyAdminLink[] = [
  {
    id: "link-01",
    slug: "buket-nikah-jkt",
    title: "Katalog Buket Pernikahan Premium Jakarta Selatan",
    originalUrl: "https://tokobunga.id/katalog/buket-pernikahan-premium-jakarta-selatan",
    shortUrl: "https://pendek.in/s/buket-nikah-jkt",
    userName: "Dimas Pratama",
    userEmail: "dimas.pratama@gmail.com",
    userId: "usr-01",
    clicks: 1247,
    uniqueClicks: 983,
    status: "active",
    createdAt: "01 Okt 2026",
    tags: ["Bisnis", "Promo"],
  },
  {
    id: "link-02",
    slug: "tutorial-copywriting",
    title: "Tutorial Copywriting Menjual untuk Pelaku UMKM",
    originalUrl: "https://youtube.com/watch?v=contoh-video-tutorial-copywriting",
    shortUrl: "https://pendek.in/s/tutorial-copywriting",
    userName: "Dimas Pratama",
    userEmail: "dimas.pratama@gmail.com",
    userId: "usr-01",
    clicks: 452,
    uniqueClicks: 388,
    status: "active",
    createdAt: "03 Okt 2026",
    tags: ["Edukasi", "YouTube"],
  },
  {
    id: "link-03",
    slug: "menang-jutaan-rupiah",
    title: "Klaim Undian Berhadiah Telkomsel & Bank 2026",
    originalUrl: "https://klik-menang-undian.xyz/login/klaim-dana-kaget-tunai",
    shortUrl: "https://pendek.in/s/menang-jutaan-rupiah",
    userName: "Budi Santoso",
    userEmail: "budi@spamsite.xyz",
    userId: "usr-03",
    clicks: 120,
    uniqueClicks: 85,
    status: "blocked",
    blockReason: "Website penipuan phising perbankan dan SMS scam.",
    createdAt: "29 Sep 2026",
    tags: ["Scam", "Phishing"],
  },
  {
    id: "link-04",
    slug: "flash-sale-1010",
    title: "Promo Kilat 10.10 Diskon Spektakuler Hingga 70%",
    originalUrl: "https://toko-online-indonesia.com/promo/flash-sale-oktober-spesial",
    shortUrl: "https://pendek.in/s/flash-sale-1010",
    userName: "Sari Wulandari",
    userEmail: "sari@tokobunga.id",
    userId: "usr-02",
    clicks: 2150,
    uniqueClicks: 1890,
    status: "active",
    createdAt: "09 Okt 2026",
    tags: ["E-Commerce", "Promo"],
  },
  {
    id: "link-05",
    slug: "promo-agustus-merdeka",
    title: "Katalog Promo HUT RI Diskon 17% Toko Bunga",
    originalUrl: "https://tokobunga.id/promo/hut-ri-79-agustus-spesial",
    shortUrl: "https://pendek.in/s/promo-agustus-merdeka",
    userName: "Sari Wulandari",
    userEmail: "sari@tokobunga.id",
    userId: "usr-02",
    clicks: 742,
    uniqueClicks: 610,
    status: "expired",
    createdAt: "10 Agu 2026",
    tags: ["Expired", "Promo"],
  },
  {
    id: "link-06",
    slug: "unduh-software-crack",
    title: "Free Download Software Pro Full Patch",
    originalUrl: "https://necopromo-scam.top/files/installer.exe",
    shortUrl: "https://pendek.in/s/unduh-software-crack",
    userName: "Budi Santoso",
    userEmail: "budi@spamsite.xyz",
    userId: "usr-03",
    clicks: 45,
    uniqueClicks: 32,
    status: "blocked",
    blockReason: "Penyebaran file executable malware/trojan.",
    createdAt: "30 Sep 2026",
    tags: ["Malware", "Bahaya"],
  },
];

export interface DummyBlockedDomain {
  id: string;
  domain: string;
  reason: string;
  addedBy: string;
  createdAt: string;
  blockedAttempts: number;
}

export const DUMMY_BLOCKED_DOMAINS: DummyBlockedDomain[] = [
  {
    id: "dom-01",
    domain: "klik-menang-undian.xyz",
    reason: "Situs phising undian palsu bermodus SMS blast",
    addedBy: "Admin Pendek-In",
    createdAt: "10 Okt 2026",
    blockedAttempts: 412,
  },
  {
    id: "dom-02",
    domain: "bit.ly-phishing.example",
    reason: "Impersonasi link perbankan internet banking palsu",
    addedBy: "Admin Pendek-In",
    createdAt: "08 Okt 2026",
    blockedAttempts: 189,
  },
  {
    id: "dom-03",
    domain: "necopromo-scam.top",
    reason: "Distribusi malware dan dropper trojan otomatis",
    addedBy: "Admin Pendek-In",
    createdAt: "05 Okt 2026",
    blockedAttempts: 95,
  },
  {
    id: "dom-04",
    domain: "hadiah-telkomsel-palsu.online",
    reason: "Pencurian OTP dan credential phishing provider",
    addedBy: "Admin Pendek-In",
    createdAt: "02 Okt 2026",
    blockedAttempts: 320,
  },
];

export interface DummyReservedWord {
  id: string;
  word: string;
  category: "system" | "brand" | "security";
  addedBy: string;
  createdAt: string;
}

export const DUMMY_RESERVED_WORDS: DummyReservedWord[] = [
  { id: "rw-01", word: "admin", category: "system", addedBy: "Sistem Otomatis", createdAt: "01 Jan 2026" },
  { id: "rw-02", word: "api", category: "system", addedBy: "Sistem Otomatis", createdAt: "01 Jan 2026" },
  { id: "rw-03", word: "dashboard", category: "system", addedBy: "Sistem Otomatis", createdAt: "01 Jan 2026" },
  { id: "rw-04", word: "login", category: "system", addedBy: "Sistem Otomatis", createdAt: "01 Jan 2026" },
  { id: "rw-05", word: "masuk", category: "system", addedBy: "Sistem Otomatis", createdAt: "01 Jan 2026" },
  { id: "rw-06", word: "daftar", category: "system", addedBy: "Sistem Otomatis", createdAt: "01 Jan 2026" },
  { id: "rw-07", word: "s", category: "system", addedBy: "Sistem Otomatis", createdAt: "01 Jan 2026" },
  { id: "rw-08", word: "p", category: "system", addedBy: "Sistem Otomatis", createdAt: "01 Jan 2026" },
  { id: "rw-09", word: "qr", category: "system", addedBy: "Sistem Otomatis", createdAt: "01 Jan 2026" },
  { id: "rw-10", word: "bca", category: "brand", addedBy: "Admin Pendek-In", createdAt: "15 Feb 2026" },
  { id: "rw-11", word: "mandiri", category: "brand", addedBy: "Admin Pendek-In", createdAt: "15 Feb 2026" },
  { id: "rw-12", word: "bri", category: "brand", addedBy: "Admin Pendek-In", createdAt: "15 Feb 2026" },
  { id: "rw-13", word: "support", category: "security", addedBy: "Admin Pendek-In", createdAt: "20 Mar 2026" },
  { id: "rw-14", word: "official", category: "security", addedBy: "Admin Pendek-In", createdAt: "20 Mar 2026" },
];

export interface DummyAuditLog {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  targetType: "domain" | "link" | "user" | "word" | "system";
  target: string;
  metadata: string;
  timestamp: string;
  ipAddress: string;
}

export const DUMMY_AUDIT_LOGS: DummyAuditLog[] = [
  {
    id: "log-01",
    actor: "Admin Pendek-In",
    actorRole: "super_admin",
    action: "BLOCK_DOMAIN",
    targetType: "domain",
    target: "klik-menang-undian.xyz",
    metadata: "Alasan: Terdeteksi website penipuan undian palsu (SMS spam blast).",
    timestamp: "12 menit yang lalu",
    ipAddress: "180.252.14.88",
  },
  {
    id: "log-02",
    actor: "Admin Pendek-In",
    actorRole: "super_admin",
    action: "ADD_RESERVED_WORD",
    targetType: "word",
    target: "bank-bca-official",
    metadata: "Alasan: Pencegahan impersonasi institusi perbankan resmi.",
    timestamp: "1 jam yang lalu",
    ipAddress: "180.252.14.88",
  },
  {
    id: "log-03",
    actor: "Admin Pendek-In",
    actorRole: "super_admin",
    action: "SUSPEND_USER",
    targetType: "user",
    target: "budi@spamsite.xyz",
    metadata: "Alasan: Pengguna terbukti membuat link scam dan bot blast.",
    timestamp: "1 hari yang lalu",
    ipAddress: "180.252.14.88",
  },
  {
    id: "log-04",
    actor: "Admin Pendek-In",
    actorRole: "super_admin",
    action: "BLOCK_LINK",
    targetType: "link",
    target: "s/menang-jutaan-rupiah",
    metadata: "Alasan: Konten judi online / phishing finansial.",
    timestamp: "2 hari yang lalu",
    ipAddress: "180.252.14.88",
  },
  {
    id: "log-05",
    actor: "Admin Pendek-In",
    actorRole: "super_admin",
    action: "UPDATE_SYSTEM_SETTINGS",
    targetType: "system",
    target: "Batas Rate-Limit API",
    metadata: "Perubahan nilai batas permintaan dari 60 req/menit menjadi 120 req/menit.",
    timestamp: "4 hari yang lalu",
    ipAddress: "180.252.14.88",
  },
  {
    id: "log-06",
    actor: "Admin Pendek-In",
    actorRole: "super_admin",
    action: "RESET_PASSWORD_USER",
    targetType: "user",
    target: "sari@tokobunga.id",
    metadata: "Permintaan bantuan reset password dari saluran support@pendek.in.",
    timestamp: "1 minggu yang lalu",
    ipAddress: "180.252.14.88",
  },
];

export const DUMMY_SYSTEM_SETTINGS = {
  siteName: "Pendek-In",
  siteDescription: "Layanan Pemendek Tautan Neobrutalisme Indonesia",
  appUrl: "https://pendek.in",
  maintenanceMode: false,
  maintenanceMessage: "Pendek-In sedang dalam pemeliharaan sistem berkala. Layanan akan kembali normal dalam beberapa saat.",
  guestRateLimit: 10, // tautan / jam
  memberRateLimit: 200, // tautan / jam
  apiRateLimit: 120, // req / menit
  resendApiKeyConfigured: true,
  senderEmail: "noreply@pendek.in",
  senderName: "Pendek-In Notifikasi",
  enableWeeklyDigest: true,
  enableSecurityAlerts: true,
};

