// Centralized dummy data for the Riyadh OS / FacilityOS Arabia frontend demo.
// Everything here is fake - no backend calls. Names, IDs, timestamps are realistic.

export type Status = "excellent" | "good" | "attention" | "critical";

export interface Building {
  id: string;
  name: string;
  nameAr: string;
  city: string;
  floors: number;
  units: number;
  supervisor: string;
  owner: string;
  laborCount: number;
  health: number;
  tasksToday: { done: number; total: number };
  openComplaints: number;
  status: Status;
  cover: string;
}

export const buildings: Building[] = [
  { id: "BLD-001", name: "Riyadh Tower A", nameAr: "برج الرياض أ", city: "Riyadh", floors: 24, units: 96, supervisor: "Khalid Al-Otaibi", owner: "Abdulrahman Al-Saud", laborCount: 12, health: 94, tasksToday: { done: 28, total: 30 }, openComplaints: 2, status: "excellent", cover: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=70" },
  { id: "BLD-002", name: "Olaya Residence", nameAr: "العليا ريزيدنس", city: "Riyadh", floors: 18, units: 72, supervisor: "Mohammed Al-Zahrani", owner: "Faisal Al-Harbi", laborCount: 9, health: 88, tasksToday: { done: 22, total: 26 }, openComplaints: 4, status: "good", cover: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=70" },
  { id: "BLD-003", name: "Jeddah Corniche Plaza", nameAr: "كورنيش بلازا جدة", city: "Jeddah", floors: 30, units: 120, supervisor: "Youssef Ahmed", owner: "Nora Al-Rashid", laborCount: 15, health: 91, tasksToday: { done: 34, total: 38 }, openComplaints: 3, status: "excellent", cover: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=70" },
  { id: "BLD-004", name: "Dammam Business Center", nameAr: "مركز الدمام التجاري", city: "Dammam", floors: 22, units: 88, supervisor: "Khalid Al-Otaibi", owner: "Abdulrahman Al-Saud", laborCount: 11, health: 76, tasksToday: { done: 19, total: 28 }, openComplaints: 6, status: "attention", cover: "https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?w=600&q=70" },
  { id: "BLD-005", name: "Khobar Heights", nameAr: "خبر هايتس", city: "Khobar", floors: 16, units: 64, supervisor: "Mohammed Al-Zahrani", owner: "Faisal Al-Harbi", laborCount: 8, health: 82, tasksToday: { done: 17, total: 22 }, openComplaints: 3, status: "good", cover: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600&q=70" },
  { id: "BLD-006", name: "Makkah Residence Complex", nameAr: "مجمع مكة السكني", city: "Makkah", floors: 12, units: 144, supervisor: "Youssef Ahmed", owner: "Nora Al-Rashid", laborCount: 14, health: 89, tasksToday: { done: 25, total: 28 }, openComplaints: 2, status: "good", cover: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=600&q=70" },
  { id: "BLD-007", name: "Madinah Commercial Tower", nameAr: "برج المدينة التجاري", city: "Madinah", floors: 20, units: 80, supervisor: "Khalid Al-Otaibi", owner: "Abdulrahman Al-Saud", laborCount: 10, health: 65, tasksToday: { done: 12, total: 24 }, openComplaints: 9, status: "critical", cover: "https://images.unsplash.com/photo-1554435493-93422e8220c8?w=600&q=70" },
  { id: "BLD-008", name: "Al Nakheel Compound", nameAr: "مجمع النخيل", city: "Riyadh", floors: 3, units: 210, supervisor: "Mohammed Al-Zahrani", owner: "Faisal Al-Harbi", laborCount: 22, health: 93, tasksToday: { done: 41, total: 44 }, openComplaints: 5, status: "excellent", cover: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=70" },
];

export type Role = "super-admin" | "property-admin" | "owner" | "supervisor" | "labor" | "tenant";

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  phone: string;
  buildings: string[];
  status: "active" | "inactive";
  lastActive: string;
  performance: number;
  tasksDone?: number;
  approvalRate?: number;
  avatar?: string;
}

export const users: User[] = [
  { id: "U-001", name: "Omar Al-Fahad", role: "super-admin", email: "omar@riyadhos.sa", phone: "+966 55 123 4567", buildings: buildings.map(b=>b.id), status: "active", lastActive: "Just now", performance: 99 },
  { id: "U-010", name: "Sarah Al-Qahtani", role: "property-admin", email: "sarah@riyadhos.sa", phone: "+966 55 234 5678", buildings: ["BLD-001","BLD-002","BLD-008"], status: "active", lastActive: "3 min ago", performance: 96 },
  { id: "U-021", name: "Abdulrahman Al-Saud", role: "owner", email: "a.alsaud@portfolio.sa", phone: "+966 50 111 2233", buildings: ["BLD-001","BLD-004","BLD-007"], status: "active", lastActive: "Today, 09:14", performance: 0 },
  { id: "U-022", name: "Faisal Al-Harbi", role: "owner", email: "faisal@harbi.sa", phone: "+966 50 222 3344", buildings: ["BLD-002","BLD-005","BLD-008"], status: "active", lastActive: "Yesterday", performance: 0 },
  { id: "U-023", name: "Nora Al-Rashid", role: "owner", email: "nora@rashid.sa", phone: "+966 50 333 4455", buildings: ["BLD-003","BLD-006"], status: "active", lastActive: "Today, 07:42", performance: 0 },
  { id: "U-031", name: "Khalid Al-Otaibi", role: "supervisor", email: "k.otaibi@riyadhos.sa", phone: "+966 55 345 6789", buildings: ["BLD-001","BLD-004","BLD-007"], status: "active", lastActive: "1 min ago", performance: 92, tasksDone: 412, approvalRate: 88 },
  { id: "U-032", name: "Mohammed Al-Zahrani", role: "supervisor", email: "m.zahrani@riyadhos.sa", phone: "+966 55 456 7890", buildings: ["BLD-002","BLD-005","BLD-008"], status: "active", lastActive: "12 min ago", performance: 89, tasksDone: 387, approvalRate: 91 },
  { id: "U-033", name: "Youssef Ahmed", role: "supervisor", email: "y.ahmed@riyadhos.sa", phone: "+966 55 567 8901", buildings: ["BLD-003","BLD-006"], status: "active", lastActive: "2 min ago", performance: 94, tasksDone: 421, approvalRate: 93 },
  { id: "U-041", name: "Ahmed Khan", role: "labor", email: "ahmed.k@riyadhos.sa", phone: "+966 53 111 0001", buildings: ["BLD-001"], status: "active", lastActive: "Just now", performance: 95, tasksDone: 218, approvalRate: 96 },
  { id: "U-042", name: "Bilal Hussain", role: "labor", email: "bilal.h@riyadhos.sa", phone: "+966 53 111 0002", buildings: ["BLD-001","BLD-004"], status: "active", lastActive: "5 min ago", performance: 91, tasksDone: 198, approvalRate: 92 },
  { id: "U-043", name: "Rahim Ali", role: "labor", email: "rahim.a@riyadhos.sa", phone: "+966 53 111 0003", buildings: ["BLD-002"], status: "active", lastActive: "Just now", performance: 88, tasksDone: 174, approvalRate: 89 },
  { id: "U-044", name: "Farhan Malik", role: "labor", email: "farhan.m@riyadhos.sa", phone: "+966 53 111 0004", buildings: ["BLD-003"], status: "active", lastActive: "8 min ago", performance: 93, tasksDone: 202, approvalRate: 94 },
  { id: "U-045", name: "Imran Shah", role: "labor", email: "imran.s@riyadhos.sa", phone: "+966 53 111 0005", buildings: ["BLD-005","BLD-008"], status: "active", lastActive: "20 min ago", performance: 78, tasksDone: 156, approvalRate: 82 },
  { id: "U-046", name: "Saeed Noor", role: "labor", email: "saeed.n@riyadhos.sa", phone: "+966 53 111 0006", buildings: ["BLD-006","BLD-007"], status: "inactive", lastActive: "Yesterday", performance: 71, tasksDone: 129, approvalRate: 76 },
  { id: "U-051", name: "Ali Hassan", role: "tenant", email: "ali.hassan@mail.com", phone: "+966 56 999 0001", buildings: ["BLD-001"], status: "active", lastActive: "1 hour ago", performance: 0 },
  { id: "U-052", name: "Mariam Saleh", role: "tenant", email: "mariam.s@mail.com", phone: "+966 56 999 0002", buildings: ["BLD-002"], status: "active", lastActive: "Today", performance: 0 },
  { id: "U-053", name: "Abdullah Nasser", role: "tenant", email: "a.nasser@mail.com", phone: "+966 56 999 0003", buildings: ["BLD-008"], status: "active", lastActive: "2 days ago", performance: 0 },
];

export type TaskStatus = "pending" | "submitted" | "approved" | "rejected" | "overdue";
export type TaskCategory = "Cleaning" | "Elevator" | "Lighting" | "Water" | "Parking" | "Security" | "Plumbing" | "Electrical" | "Waste" | "Landscaping" | "Inspection";

export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  building: string;
  area: string;
  labor: string;
  supervisor: string;
  frequency: "daily" | "weekly" | "monthly" | "one-time";
  due: string;
  photoRequired: boolean;
  priority: "low" | "medium" | "high";
  status: TaskStatus;
  proof?: string;
  submittedAt?: string;
  comment?: string;
}

const proofPhotos = [
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=60",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=60",
  "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=400&q=60",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=60",
  "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&q=60",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=60",
];

const taskNames: { name: string; cat: TaskCategory }[] = [
  { name: "Clean main entrance", cat: "Cleaning" },
  { name: "Check elevator operation", cat: "Elevator" },
  { name: "Inspect parking area", cat: "Parking" },
  { name: "Check water tank level", cat: "Water" },
  { name: "Clean staircase", cat: "Cleaning" },
  { name: "Inspect corridor lighting", cat: "Lighting" },
  { name: "Remove waste from basement", cat: "Waste" },
  { name: "Check rooftop access door", cat: "Security" },
  { name: "Inspect fire extinguisher cabinet", cat: "Inspection" },
  { name: "Clean lobby glass doors", cat: "Cleaning" },
  { name: "Check generator fuel level", cat: "Electrical" },
  { name: "Inspect plumbing in mechanical room", cat: "Plumbing" },
  { name: "Landscape watering - front lawn", cat: "Landscaping" },
];

const statusPool: TaskStatus[] = ["pending","submitted","approved","rejected","overdue","submitted","approved","approved","pending"];

export const tasks: Task[] = Array.from({ length: 48 }).map((_, i) => {
  const t = taskNames[i % taskNames.length];
  const b = buildings[i % buildings.length];
  const labor = users.filter(u => u.role === "labor")[i % 6];
  const sup = users.find(u => u.id === b.supervisor) || users.find(u => u.role === "supervisor")!;
  const st = statusPool[i % statusPool.length];
  return {
    id: `TSK-${(2600 + i).toString()}`,
    name: t.name,
    category: t.cat,
    building: b.name,
    area: ["Floor 1","Floor 2","Basement","Rooftop","Lobby","Parking B1"][i % 6],
    labor: labor.name,
    supervisor: sup.name,
    frequency: (["daily","weekly","monthly","daily"] as const)[i % 4],
    due: ["07:00","09:00","11:00","13:00","16:00","18:00"][i % 6],
    photoRequired: true,
    priority: (["low","medium","high","medium"] as const)[i % 4],
    status: st,
    proof: (st === "submitted" || st === "approved" || st === "rejected") ? proofPhotos[i % proofPhotos.length] : undefined,
    submittedAt: (st !== "pending" && st !== "overdue") ? `Today, ${(8 + (i % 9)).toString().padStart(2,"0")}:${(10 + i * 3 % 50).toString().padStart(2,"0")}` : undefined,
    comment: (st === "rejected") ? "Photo blurry - please retake." : undefined,
  };
});

export type ComplaintStatus = "open" | "in-progress" | "resolved" | "closed";

export interface Complaint {
  id: string;
  category: string;
  building: string;
  unit: string;
  tenant: string;
  description: string;
  photo?: string;
  priority: "low" | "medium" | "high";
  status: ComplaintStatus;
  assigned: string;
  created: string;
  updated: string;
  sla: "on-track" | "at-risk" | "breached";
}

const complaintSeed = [
  { cat: "Elevator", desc: "Elevator not working on floor 8" },
  { cat: "Plumbing", desc: "Water leakage near parking B2" },
  { cat: "Lighting", desc: "Corridor light broken near unit 304" },
  { cat: "Cleaning", desc: "Cleaning required near entrance" },
  { cat: "Security", desc: "Security gate delay at main entry" },
  { cat: "Waste", desc: "Bad smell near garbage room" },
  { cat: "Parking", desc: "Parking slot blocked by another car" },
  { cat: "Water", desc: "Water pressure very low in unit" },
  { cat: "Electrical", desc: "AC tripping circuit breaker repeatedly" },
];

export const complaints: Complaint[] = Array.from({ length: 22 }).map((_, i) => {
  const s = complaintSeed[i % complaintSeed.length];
  const b = buildings[i % buildings.length];
  const tenant = users.filter(u => u.role === "tenant")[i % 3];
  const sup = users.filter(u => u.role === "supervisor")[i % 3];
  const stArr: ComplaintStatus[] = ["open","in-progress","resolved","resolved","closed","in-progress","open"];
  return {
    id: `CMP-2026-${(40 + i).toString().padStart(4,"0")}`,
    category: s.cat,
    building: b.name,
    unit: `Unit ${100 + (i*7) % 400}`,
    tenant: tenant.name,
    description: s.desc,
    photo: i % 2 === 0 ? proofPhotos[i % proofPhotos.length] : undefined,
    priority: (["high","medium","low","medium","high"] as const)[i % 5],
    status: stArr[i % stArr.length],
    assigned: sup.name,
    created: `${(i % 9) + 1} Jun 2026`,
    updated: `${(i % 9) + 2} Jun 2026`,
    sla: (["on-track","on-track","at-risk","breached","on-track"] as const)[i % 5],
  };
});

export interface MaintenanceIssue {
  id: string;
  building: string;
  area: string;
  category: string;
  description: string;
  priority: "low"|"medium"|"high";
  reportedBy: string;
  assigned: string;
  status: "open"|"in-progress"|"completed";
  estCost: number;
  completion: string;
  photo?: string;
}

export const maintenance: MaintenanceIssue[] = [
  { id: "MNT-3001", building: "Riyadh Tower A", area: "Elevator 2", category: "Elevator", description: "Annual elevator inspection needed", priority: "high", reportedBy: "Khalid Al-Otaibi", assigned: "OTIS Service", status: "in-progress", estCost: 4200, completion: "2026-06-24", photo: proofPhotos[0] },
  { id: "MNT-3002", building: "Olaya Residence", area: "Basement", category: "Plumbing", description: "Plumbing leak in basement utility room", priority: "high", reportedBy: "Rahim Ali", assigned: "FixIt Co.", status: "open", estCost: 1800, completion: "2026-06-22" },
  { id: "MNT-3003", building: "Dammam Business Center", area: "Electrical Room", category: "Electrical", description: "Electrical panel check & thermal scan", priority: "medium", reportedBy: "Mohammed Al-Zahrani", assigned: "Saudi Power Services", status: "in-progress", estCost: 2600, completion: "2026-06-23" },
  { id: "MNT-3004", building: "Khobar Heights", area: "Parking Gate", category: "Parking gate", description: "Parking gate sensor intermittently failing", priority: "medium", reportedBy: "Imran Shah", assigned: "Gulf Gates", status: "open", estCost: 900, completion: "2026-06-25" },
  { id: "MNT-3005", building: "Jeddah Corniche Plaza", area: "Roof", category: "Water tank", description: "Water pump noise & vibration", priority: "low", reportedBy: "Youssef Ahmed", assigned: "AquaTech", status: "completed", estCost: 1200, completion: "2026-06-18" },
  { id: "MNT-3006", building: "Madinah Commercial Tower", area: "Fire System", category: "Fire safety", description: "Fire alarm battery replacement (annual)", priority: "high", reportedBy: "Khalid Al-Otaibi", assigned: "SafeGuard FM", status: "in-progress", estCost: 3400, completion: "2026-06-21" },
];

// Charts data
export const taskTrend = [
  { day: "Mon", done: 132, missed: 14 },
  { day: "Tue", done: 145, missed: 11 },
  { day: "Wed", done: 138, missed: 18 },
  { day: "Thu", done: 156, missed: 9 },
  { day: "Fri", done: 121, missed: 12 },
  { day: "Sat", done: 162, missed: 8 },
  { day: "Sun", done: 148, missed: 14 },
];

export const complaintCategories = [
  { name: "Cleaning", value: 28, color: "#3b6fa0" },
  { name: "Electrical", value: 14, color: "#0e7c66" },
  { name: "Plumbing", value: 19, color: "#c9a84c" },
  { name: "Elevator", value: 11, color: "#e85d3a" },
  { name: "Parking", value: 9, color: "#7c5cff" },
  { name: "Security", value: 6, color: "#475569" },
];

export const buildingHealthCompare = buildings.map(b => ({ name: b.name.replace(/ /g, "\n"), score: b.health }));

export const complaintResolutionTrend = [
  { week: "W1", hours: 22 },
  { week: "W2", hours: 18 },
  { week: "W3", hours: 14 },
  { week: "W4", hours: 12 },
  { week: "W5", hours: 9 },
  { week: "W6", hours: 7 },
];

export const laborPerformance = users.filter(u => u.role === "labor").map(l => ({
  name: l.name.split(" ")[0],
  approval: l.approvalRate || 0,
  done: l.tasksDone || 0,
}));

export const openVsResolved = [
  { month: "Jan", open: 41, resolved: 38 },
  { month: "Feb", open: 35, resolved: 41 },
  { month: "Mar", open: 48, resolved: 44 },
  { month: "Apr", open: 39, resolved: 47 },
  { month: "May", open: 44, resolved: 49 },
  { month: "Jun", open: 31, resolved: 36 },
];

export const overviewKpis = {
  totalBuildings: 18,
  activeLabor: 76,
  tasksDoneToday: 148,
  tasksTotal: 162,
  pendingTasks: 14,
  overdueTasks: 9,
  openComplaints: 17,
  resolvedRate: 91,
  pendingApprovals: 23,
  healthScore: 92,
};

export const notifications = [
  { id: "N1", type: "overdue", title: "Task overdue: Clean main entrance", body: "Riyadh Tower A · assigned Ahmed Khan · 1 hr late", time: "12 min ago", unread: true },
  { id: "N2", type: "complaint", title: "New complaint CMP-2026-0048", body: "Elevator not working - Khobar Heights, Unit 312", time: "34 min ago", unread: true },
  { id: "N3", type: "approval", title: "Supervisor rejected a task", body: "Khalid Al-Otaibi rejected TSK-2618 - photo blurry", time: "1 hr ago", unread: true },
  { id: "N4", type: "report", title: "Owner weekly summary is ready", body: "Abdulrahman Al-Saud · 3 buildings · ready to send", time: "2 hr ago", unread: false },
  { id: "N5", type: "complaint", title: "Complaint resolved CMP-2026-0041", body: "Corridor light fixed in Olaya Residence", time: "3 hr ago", unread: false },
  { id: "N6", type: "maintenance", title: "Maintenance escalated", body: "Plumbing leak - Olaya Residence basement", time: "5 hr ago", unread: false },
];

export const auditLogs = Array.from({ length: 14 }).map((_, i) => ({
  id: `LOG-${4000 + i}`,
  user: users[i % users.length].name,
  action: ["Approved task","Rejected task","Created building","Updated user","Resolved complaint","Created task","Exported report"][i % 7],
  module: ["Tasks","Tasks","Buildings","Staff","Complaints","Tasks","Reports"][i % 7],
  time: `Today, ${(8 + i % 10).toString().padStart(2,"0")}:${(11 + i * 4 % 50).toString().padStart(2,"0")}`,
  ip: `94.200.${i*3 % 250}.${i*7 % 250}`,
  status: i % 8 === 0 ? "failed" : "success" as const,
}));

export const billing = {
  plan: "Growth",
  price: "2,499 SAR / mo",
  buildingsUsed: 8,
  buildingsLimit: 10,
  usersUsed: 47,
  usersLimit: 75,
  storageUsed: 38,
  storageLimit: 100,
  addons: ["WhatsApp notifications", "Extra storage (50GB)", "Custom monthly reports"],
  invoices: [
    { id: "INV-2026-006", date: "01 Jun 2026", amount: "2,499 SAR", status: "Paid" },
    { id: "INV-2026-005", date: "01 May 2026", amount: "2,499 SAR", status: "Paid" },
    { id: "INV-2026-004", date: "01 Apr 2026", amount: "2,499 SAR", status: "Paid" },
    { id: "INV-2026-003", date: "01 Mar 2026", amount: "1,999 SAR", status: "Paid" },
  ],
};
