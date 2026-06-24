// ============================================================
// FacilityOS Arabia — Centralized Mock Data (3-Role MVP)
// All data is fake. No backend. No database.
// Roles: admin | owner | labour
// ============================================================

// ─── AUTH USERS ──────────────────────────────────────────────
export type AppRole = "admin" | "owner" | "labour";

export interface MockAuthUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AppRole;
  ownerId?: string;   // for owner role
  labourId?: string;  // for labour role
  avatar?: string;
}

export const mockAuthUsers: MockAuthUser[] = [
  {
    id: "AUTH-001",
    name: "Platform Admin",
    email: "admin@facilityos.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "AUTH-002",
    name: "Ahmed Al-Farsi",
    email: "owner@building.com",
    password: "owner123",
    role: "owner",
    ownerId: "OWN-001",
  },
  {
    id: "AUTH-003",
    name: "Ali Hassan",
    email: "labour@building.com",
    password: "labour123",
    role: "labour",
    labourId: "LAB-001",
  },
];

// ─── OWNERS ──────────────────────────────────────────────────
export type PlanType = "Starter" | "Professional" | "Enterprise";
export type OwnerStatus = "Active" | "Trial" | "Suspended";

export interface MockOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  plan: PlanType;
  status: OwnerStatus;
  buildingIds: string[];
  monthlyPayment: number;
  joinedDate: string;
  nextBilling: string;
  avatar?: string;
}

export const mockOwners: MockOwner[] = [
  {
    id: "OWN-001",
    name: "Ahmed Al-Farsi",
    email: "ahmed@riyadhtower.com",
    phone: "+966 55 123 4567",
    company: "Riyadh Tower Group",
    plan: "Professional",
    status: "Active",
    buildingIds: ["BLD-001", "BLD-002", "BLD-003"],
    monthlyPayment: 899,
    joinedDate: "Jan 2026",
    nextBilling: "Jul 22, 2026",
  },
  {
    id: "OWN-002",
    name: "Khalid Mansour",
    email: "khalid@jeddahplaza.com",
    phone: "+966 55 987 6543",
    company: "Jeddah Plaza Real Estate",
    plan: "Starter",
    status: "Active",
    buildingIds: ["BLD-004"],
    monthlyPayment: 299,
    joinedDate: "Feb 2026",
    nextBilling: "Jul 15, 2026",
  },
  {
    id: "OWN-003",
    name: "Sara Al-Harbi",
    email: "sara@dammamcomplex.com",
    phone: "+966 56 444 8822",
    company: "Dammam & Khobar Properties",
    plan: "Enterprise",
    status: "Trial",
    buildingIds: ["BLD-005", "BLD-006"],
    monthlyPayment: 1999,
    joinedDate: "Jun 2026",
    nextBilling: "Jul 10, 2026",
  },
];

// ─── BUILDINGS ───────────────────────────────────────────────
export type BuildingStatus = "Healthy" | "Pending" | "Attention Needed";

export interface MockBuilding {
  id: string;
  name: string;
  city: string;
  address: string;
  ownerId: string;
  ownerName: string;
  assignedLabourIds: string[];
  completionToday: number; // percentage
  totalTasksToday: number;
  doneTasksToday: number;
  lastReportTime: string;
  status: BuildingStatus;
  cover: string;
}

export const mockBuildings: MockBuilding[] = [
  {
    id: "BLD-001",
    name: "Riyadh Tower A",
    city: "Riyadh",
    address: "King Fahad Road, Riyadh",
    ownerId: "OWN-001",
    ownerName: "Ahmed Al-Farsi",
    assignedLabourIds: ["LAB-001"],
    completionToday: 87,
    totalTasksToday: 8,
    doneTasksToday: 7,
    lastReportTime: "Today, 09:15",
    status: "Healthy",
    cover: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=70",
  },
  {
    id: "BLD-002",
    name: "Riyadh Tower B",
    city: "Riyadh",
    address: "Olaya Street, Riyadh",
    ownerId: "OWN-001",
    ownerName: "Ahmed Al-Farsi",
    assignedLabourIds: ["LAB-002"],
    completionToday: 100,
    totalTasksToday: 8,
    doneTasksToday: 8,
    lastReportTime: "Today, 08:52",
    status: "Healthy",
    cover: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=70",
  },
  {
    id: "BLD-003",
    name: "Riyadh Tower C",
    city: "Riyadh",
    address: "Prince Mohammed Bin Abdulaziz Road",
    ownerId: "OWN-001",
    ownerName: "Ahmed Al-Farsi",
    assignedLabourIds: ["LAB-003"],
    completionToday: 62,
    totalTasksToday: 8,
    doneTasksToday: 5,
    lastReportTime: "Today, 10:30",
    status: "Pending",
    cover: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=70",
  },
  {
    id: "BLD-004",
    name: "Jeddah Plaza",
    city: "Jeddah",
    address: "Tahlia Street, Jeddah",
    ownerId: "OWN-002",
    ownerName: "Khalid Mansour",
    assignedLabourIds: ["LAB-004"],
    completionToday: 50,
    totalTasksToday: 8,
    doneTasksToday: 4,
    lastReportTime: "Today, 11:05",
    status: "Attention Needed",
    cover: "https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?w=600&q=70",
  },
  {
    id: "BLD-005",
    name: "Dammam Business Complex",
    city: "Dammam",
    address: "King Abdullah Road, Dammam",
    ownerId: "OWN-003",
    ownerName: "Sara Al-Harbi",
    assignedLabourIds: ["LAB-005"],
    completionToday: 75,
    totalTasksToday: 8,
    doneTasksToday: 6,
    lastReportTime: "Today, 09:44",
    status: "Healthy",
    cover: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&q=70",
  },
  {
    id: "BLD-006",
    name: "Khobar Heights",
    city: "Khobar",
    address: "Prince Turki Street, Khobar",
    ownerId: "OWN-003",
    ownerName: "Sara Al-Harbi",
    assignedLabourIds: [],
    completionToday: 0,
    totalTasksToday: 8,
    doneTasksToday: 0,
    lastReportTime: "No report yet",
    status: "Attention Needed",
    cover: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=600&q=70",
  },
];

// ─── LABOUR ──────────────────────────────────────────────────
export type LabourStatus = "Submitted" | "In Progress" | "Not Started" | "Missed";

export interface MockLabour {
  id: string;
  name: string;
  phone: string;
  email: string;
  buildingId: string;
  buildingName: string;
  ownerId: string;
  todayStatus: LabourStatus;
  completedTasksToday: number;
  totalTasksToday: number;
  lastSubmission: string;
  performanceWeek: number; // percentage
  joinedDate: string;
}

export const mockLabour: MockLabour[] = [
  {
    id: "LAB-001",
    name: "Ali Hassan",
    phone: "+966 53 111 0001",
    email: "ali.hassan@facilityos.com",
    buildingId: "BLD-001",
    buildingName: "Riyadh Tower A",
    ownerId: "OWN-001",
    todayStatus: "Submitted",
    completedTasksToday: 7,
    totalTasksToday: 8,
    lastSubmission: "Today, 09:15",
    performanceWeek: 92,
    joinedDate: "Mar 2026",
  },
  {
    id: "LAB-002",
    name: "Muhammad Imran",
    phone: "+966 53 111 0002",
    email: "imran@facilityos.com",
    buildingId: "BLD-002",
    buildingName: "Riyadh Tower B",
    ownerId: "OWN-001",
    todayStatus: "Submitted",
    completedTasksToday: 8,
    totalTasksToday: 8,
    lastSubmission: "Today, 08:52",
    performanceWeek: 98,
    joinedDate: "Mar 2026",
  },
  {
    id: "LAB-003",
    name: "Bilal Khan",
    phone: "+966 53 111 0003",
    email: "bilal@facilityos.com",
    buildingId: "BLD-003",
    buildingName: "Riyadh Tower C",
    ownerId: "OWN-001",
    todayStatus: "In Progress",
    completedTasksToday: 5,
    totalTasksToday: 8,
    lastSubmission: "Today, 10:30",
    performanceWeek: 78,
    joinedDate: "Apr 2026",
  },
  {
    id: "LAB-004",
    name: "Omar Saeed",
    phone: "+966 53 111 0004",
    email: "omar@facilityos.com",
    buildingId: "BLD-004",
    buildingName: "Jeddah Plaza",
    ownerId: "OWN-002",
    todayStatus: "In Progress",
    completedTasksToday: 4,
    totalTasksToday: 8,
    lastSubmission: "Today, 11:05",
    performanceWeek: 71,
    joinedDate: "Apr 2026",
  },
  {
    id: "LAB-005",
    name: "Yousuf Ahmed",
    phone: "+966 53 111 0005",
    email: "yousuf@facilityos.com",
    buildingId: "BLD-005",
    buildingName: "Dammam Business Complex",
    ownerId: "OWN-003",
    todayStatus: "Submitted",
    completedTasksToday: 6,
    totalTasksToday: 8,
    lastSubmission: "Today, 09:44",
    performanceWeek: 85,
    joinedDate: "May 2026",
  },
];

// ─── CHECKLIST TASKS (Labour daily) ──────────────────────────
export interface ChecklistTask {
  id: string;
  title: string;
  instruction: string;
  icon: string; // lucide icon name
  category: string;
  priority: "Normal" | "Important";
  photoRequired: boolean;
}

export const defaultChecklist: ChecklistTask[] = [
  { id: "T-001", title: "Clean Entrance", instruction: "Sweep and mop entrance area thoroughly", icon: "Brush", category: "Cleaning", priority: "Important", photoRequired: false },
  { id: "T-002", title: "Check Elevator", instruction: "Make sure elevator is working properly", icon: "Square", category: "Elevator", priority: "Important", photoRequired: false },
  { id: "T-003", title: "Remove Garbage", instruction: "Empty all garbage bins and take to disposal area", icon: "Trash2", category: "Waste", priority: "Normal", photoRequired: false },
  { id: "T-004", title: "Check Water Tank", instruction: "Check water tank level and pump operation", icon: "Droplets", category: "Water", priority: "Important", photoRequired: false },
  { id: "T-005", title: "Check Lights", instruction: "Check lobby and corridor lights, replace any burnt bulbs", icon: "Lightbulb", category: "Lighting", priority: "Normal", photoRequired: false },
  { id: "T-006", title: "Clean Stairs", instruction: "Sweep and clean all staircase areas", icon: "ArrowUp", category: "Cleaning", priority: "Normal", photoRequired: false },
  { id: "T-007", title: "Check Parking", instruction: "Check parking area cleanliness and organization", icon: "Car", category: "Parking", priority: "Normal", photoRequired: false },
  { id: "T-008", title: "Security Gate Check", instruction: "Check security gate and camera systems", icon: "Shield", category: "Security", priority: "Important", photoRequired: false },
];

// ─── CHECKLIST TEMPLATES ─────────────────────────────────────
export interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  tasks: { name: string; category: string; frequency: string; priority: "Normal" | "Important"; photoRequired: boolean }[];
  assignedBuildings: string[];
  createdAt: string;
}

export const mockChecklistTemplates: ChecklistTemplate[] = [
  {
    id: "TPL-001",
    name: "Daily Cleaning Checklist",
    description: "Standard daily cleaning tasks for all buildings",
    tasks: [
      { name: "Clean entrance", category: "Cleaning", frequency: "Daily", priority: "Important", photoRequired: false },
      { name: "Clean lobby", category: "Cleaning", frequency: "Daily", priority: "Important", photoRequired: false },
      { name: "Remove garbage", category: "Waste", frequency: "Daily", priority: "Normal", photoRequired: false },
      { name: "Clean stairs", category: "Cleaning", frequency: "Daily", priority: "Normal", photoRequired: false },
      { name: "Check washrooms", category: "Cleaning", frequency: "Daily", priority: "Important", photoRequired: false },
    ],
    assignedBuildings: ["BLD-001", "BLD-002", "BLD-003"],
    createdAt: "Jan 15, 2026",
  },
  {
    id: "TPL-002",
    name: "Daily Building Safety Checklist",
    description: "Daily safety and equipment checks",
    tasks: [
      { name: "Check elevator", category: "Elevator", frequency: "Daily", priority: "Important", photoRequired: false },
      { name: "Check lights", category: "Lighting", frequency: "Daily", priority: "Normal", photoRequired: false },
      { name: "Check water pump", category: "Water", frequency: "Daily", priority: "Important", photoRequired: false },
      { name: "Check security gate", category: "Security", frequency: "Daily", priority: "Important", photoRequired: false },
      { name: "Check fire extinguisher area", category: "Safety", frequency: "Weekly", priority: "Important", photoRequired: false },
    ],
    assignedBuildings: ["BLD-001", "BLD-004", "BLD-005"],
    createdAt: "Jan 20, 2026",
  },
];

// ─── DAILY REPORTS ───────────────────────────────────────────
export type ReportStatus = "Submitted" | "Pending" | "Missed" | "Approved";

export interface MockReport {
  id: string;
  date: string;
  buildingId: string;
  buildingName: string;
  labourId: string;
  labourName: string;
  ownerId: string;
  ownerName: string;
  completedTasks: number;
  totalTasks: number;
  pendingTasks: number;
  submittedAt: string;
  status: ReportStatus;
  notes?: string;
}

export const mockReports: MockReport[] = [
  { id: "RPT-001", date: "Jun 24, 2026", buildingId: "BLD-001", buildingName: "Riyadh Tower A", labourId: "LAB-001", labourName: "Ali Hassan", ownerId: "OWN-001", ownerName: "Ahmed Al-Farsi", completedTasks: 7, totalTasks: 8, pendingTasks: 1, submittedAt: "Today, 09:15", status: "Submitted" },
  { id: "RPT-002", date: "Jun 24, 2026", buildingId: "BLD-002", buildingName: "Riyadh Tower B", labourId: "LAB-002", labourName: "Muhammad Imran", ownerId: "OWN-001", ownerName: "Ahmed Al-Farsi", completedTasks: 8, totalTasks: 8, pendingTasks: 0, submittedAt: "Today, 08:52", status: "Approved" },
  { id: "RPT-003", date: "Jun 24, 2026", buildingId: "BLD-003", buildingName: "Riyadh Tower C", labourId: "LAB-003", labourName: "Bilal Khan", ownerId: "OWN-001", ownerName: "Ahmed Al-Farsi", completedTasks: 5, totalTasks: 8, pendingTasks: 3, submittedAt: "Today, 10:30", status: "Submitted" },
  { id: "RPT-004", date: "Jun 24, 2026", buildingId: "BLD-004", buildingName: "Jeddah Plaza", labourId: "LAB-004", labourName: "Omar Saeed", ownerId: "OWN-002", ownerName: "Khalid Mansour", completedTasks: 4, totalTasks: 8, pendingTasks: 4, submittedAt: "—", status: "Pending" },
  { id: "RPT-005", date: "Jun 24, 2026", buildingId: "BLD-005", buildingName: "Dammam Business Complex", labourId: "LAB-005", labourName: "Yousuf Ahmed", ownerId: "OWN-003", ownerName: "Sara Al-Harbi", completedTasks: 6, totalTasks: 8, pendingTasks: 2, submittedAt: "Today, 09:44", status: "Submitted" },
  { id: "RPT-006", date: "Jun 24, 2026", buildingId: "BLD-006", buildingName: "Khobar Heights", labourId: "", labourName: "No Labour Assigned", ownerId: "OWN-003", ownerName: "Sara Al-Harbi", completedTasks: 0, totalTasks: 8, pendingTasks: 8, submittedAt: "—", status: "Missed" },
  // Past reports
  { id: "RPT-007", date: "Jun 23, 2026", buildingId: "BLD-001", buildingName: "Riyadh Tower A", labourId: "LAB-001", labourName: "Ali Hassan", ownerId: "OWN-001", ownerName: "Ahmed Al-Farsi", completedTasks: 8, totalTasks: 8, pendingTasks: 0, submittedAt: "Jun 23, 09:10", status: "Approved" },
  { id: "RPT-008", date: "Jun 23, 2026", buildingId: "BLD-002", buildingName: "Riyadh Tower B", labourId: "LAB-002", labourName: "Muhammad Imran", ownerId: "OWN-001", ownerName: "Ahmed Al-Farsi", completedTasks: 8, totalTasks: 8, pendingTasks: 0, submittedAt: "Jun 23, 08:45", status: "Approved" },
  { id: "RPT-009", date: "Jun 23, 2026", buildingId: "BLD-003", buildingName: "Riyadh Tower C", labourId: "LAB-003", labourName: "Bilal Khan", ownerId: "OWN-001", ownerName: "Ahmed Al-Farsi", completedTasks: 6, totalTasks: 8, pendingTasks: 2, submittedAt: "Jun 23, 11:20", status: "Submitted" },
  { id: "RPT-010", date: "Jun 22, 2026", buildingId: "BLD-001", buildingName: "Riyadh Tower A", labourId: "LAB-001", labourName: "Ali Hassan", ownerId: "OWN-001", ownerName: "Ahmed Al-Farsi", completedTasks: 7, totalTasks: 8, pendingTasks: 1, submittedAt: "Jun 22, 09:30", status: "Approved" },
];

// ─── SUBSCRIPTIONS / EARNINGS ────────────────────────────────
export const mockSubscriptions = {
  totalMRR: 3097, // 899 + 299 + 1999
  totalOwners: 3,
  activeOwners: 2,
  trialOwners: 1,
  plans: {
    starter: 1,
    professional: 1,
    enterprise: 1,
  },
  recentPayments: [
    { id: "PAY-001", owner: "Ahmed Al-Farsi", plan: "Professional", amount: 899, date: "Jun 1, 2026", status: "Paid" },
    { id: "PAY-002", owner: "Khalid Mansour", plan: "Starter", amount: 299, date: "Jun 1, 2026", status: "Paid" },
    { id: "PAY-003", owner: "Sara Al-Harbi", plan: "Enterprise", amount: 1999, date: "Jun 10, 2026", status: "Trial" },
    { id: "PAY-004", owner: "Ahmed Al-Farsi", plan: "Professional", amount: 899, date: "May 1, 2026", status: "Paid" },
    { id: "PAY-005", owner: "Khalid Mansour", plan: "Starter", amount: 299, date: "May 1, 2026", status: "Paid" },
  ],
  failedAlerts: [
    { owner: "Omar Al-Dawoud", plan: "Starter", amount: 299, date: "Jun 5, 2026", reason: "Card declined" },
  ],
};

// ─── CHART DATA ───────────────────────────────────────────────
export const revenueChart = [
  { month: "Jan", revenue: 598, owners: 2 },
  { month: "Feb", revenue: 598, owners: 2 },
  { month: "Mar", revenue: 1198, owners: 2 },
  { month: "Apr", revenue: 1198, owners: 2 },
  { month: "May", revenue: 1198, owners: 2 },
  { month: "Jun", revenue: 3097, owners: 3 },
];

export const completionChart = [
  { day: "Mon", completion: 88 },
  { day: "Tue", completion: 92 },
  { day: "Wed", completion: 79 },
  { day: "Thu", completion: 95 },
  { day: "Fri", completion: 87 },
  { day: "Sat", completion: 91 },
  { day: "Sun", completion: 84 },
];

export const buildingCompletionChart = mockBuildings.map(b => ({
  name: b.name.replace(" ", "\n"),
  completion: b.completionToday,
}));

// ─── ADMIN OVERVIEW KPIs ─────────────────────────────────────
export const adminKpis = {
  totalOwners: 3,
  activeSubscriptions: 2,
  totalBuildings: 6,
  totalLabour: 5,
  todaySubmittedReports: 4,
  pendingReports: 1,
  missedReports: 1,
  monthlyRevenue: 3097,
  completionRate: 72,
};

// ─── PRICING PLANS ───────────────────────────────────────────
export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 299,
    description: "Best for single building owners",
    buildings: 1,
    labour: 5,
    features: ["1 Building", "Up to 5 Labour", "Daily Checklists", "Report Dashboard", "Email Support"],
  },
  {
    id: "professional",
    name: "Professional",
    price: 899,
    description: "Best for growing portfolios",
    buildings: 5,
    labour: 20,
    features: ["Up to 5 Buildings", "Up to 20 Labour", "Daily Checklists", "Advanced Reports", "Priority Support", "Custom Templates"],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 1999,
    description: "For large property groups",
    buildings: -1, // unlimited
    labour: -1,
    features: ["Unlimited Buildings", "Unlimited Labour", "Advanced Analytics", "Custom Reports", "Dedicated Support", "API Access"],
  },
];

// ─── BACKWARD COMPAT (old exports used in existing routes) ───
export type Status = "excellent" | "good" | "attention" | "critical";
export type Role = "admin" | "owner" | "labour";

export const buildings = mockBuildings.map(b => ({
  id: b.id,
  name: b.name,
  nameAr: b.name,
  city: b.city,
  floors: 20,
  units: 80,
  supervisor: "",
  owner: b.ownerName,
  laborCount: b.assignedLabourIds.length,
  health: b.completionToday,
  tasksToday: { done: b.doneTasksToday, total: b.totalTasksToday },
  openComplaints: 0,
  status: b.status === "Healthy" ? "excellent" as Status : b.status === "Pending" ? "good" as Status : "attention" as Status,
  cover: b.cover,
}));

export const tasks: { id: string; name: string; category: string; building: string; labor: string; status: string; proof?: string }[] = [];
export const complaints: { id: string; building: string; assigned: string; photo?: string }[] = [];
export const overviewKpis = adminKpis;
export const taskTrend = completionChart.map(d => ({ day: d.day, done: Math.round(d.completion * 0.4), missed: Math.round((100 - d.completion) * 0.1) }));
export const complaintCategories: { name: string; value: number; color: string }[] = [];
export const buildingHealthCompare = buildingCompletionChart;
export const complaintResolutionTrend: { week: string; hours: number }[] = [];
export const openVsResolved: { month: string; open: number; resolved: number }[] = [];
