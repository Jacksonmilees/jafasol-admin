export enum PlanName {
  Free = 'Free',
  Basic = 'Basic',
  Premium = 'Premium',
  Enterprise = 'Enterprise',
}

export enum SchoolStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended',
}

export enum ModuleKey {
  Analytics = 'analytics',
  StudentManagement = 'studentManagement',
  TeacherManagement = 'teacherManagement',
  Timetable = 'timetable',
  FeeManagement = 'fees',
  Exams = 'exams',
  Communication = 'communication',
  Attendance = 'attendance',
  Library = 'library',
  Transport = 'transport',
  Academics = 'academics',
}

export interface Plan {
  id: string;
  name: PlanName;
  price: number;
  durationDays: number;
  features: string[];
  color: string;
}

export interface School {
  id: string;
  name: string;
  email: string;
  phone: string;
  logoUrl: string;
  plan: PlanName;
  status: SchoolStatus;
  subdomain: string;
  storageUsage: number; // in GB
  createdAt: string;
  modules: ModuleKey[];
  enabledFeatureToggles?: string[];
}

export enum TicketStatus {
  Open = 'Open',
  InProgress = 'In Progress',
  Closed = 'Closed',
}

export enum TicketPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export interface TicketMessage {
    id: string;
    sender: 'Super Admin' | 'School Admin';
    senderAvatar: string;
    text: string;
    timestamp: string;
}

export interface SupportTicket {
  id: string;
  schoolId: string;
  schoolName: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  lastUpdated: string;
  conversation: TicketMessage[];
}


export enum BackupStatus {
  Completed = 'Completed',
  InProgress = 'In Progress',
  Failed = 'Failed',
}

export enum BackupType {
  Automatic = 'Automatic',
  Manual = 'Manual',
}

export interface Backup {
  id: string;
  schoolId: string;
  schoolName: string;
  createdAt: string;
  type: BackupType;
  status: BackupStatus;
  size: string; // e.g., "150 MB"
}

export interface FeatureToggle {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
}

export enum AlertLevel {
    Info = 'Info',
    Warning = 'Warning',
    Critical = 'Critical',
}

export interface Announcement {
    id: string;
    title: string;
    message: string;
    target: 'all' | string; // 'all' or schoolId
    targetName: string; // "All Schools" or school name
    sentAt: string;
}

export interface SystemAlert {
    id:string;
    title: string;
    description: string;
    level: AlertLevel;
    timestamp: string;
}

export enum SSLStatus {
    Active = 'Active',
    ExpiringSoon = 'Expiring Soon',
    Inactive = 'Inactive',
}

export enum ServerStatus {
    Online = 'Online',
    Offline = 'Offline',
    Maintenance = 'Maintenance',
}

export interface Subdomain {
    id: string;
    schoolId: string;
    schoolName: string;
    subdomain: string;
    fullDomain: string;
    url: string;
    sslStatus: SSLStatus;
    serverStatus: ServerStatus;
    createdAt: string;
    lastChecked?: string;
    dnsRecords?: Array<{
        type: string;
        name: string;
        value: string;
    }>;
}

export enum UserRole {
    SuperAdmin = 'Super Admin',
    SchoolAdmin = 'School Admin',
}

export enum UserStatus {
    Active = 'Active',
    Suspended = 'Suspended',
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    schoolId?: string;
    schoolName?: string;
    avatarUrl: string;
    lastLogin: string;
}

export interface ActivityLog {
    id: string;
    userName: string;
    userAvatar: string;
    action: string;
    ipAddress: string;
    timestamp: string;
}

export interface PasswordPolicy {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
}

export enum InvoiceStatus {
    Paid = 'Paid',
    Due = 'Due',
    Overdue = 'Overdue',
}

export interface Invoice {
    id: string;
    schoolId: string;
    schoolName: string;
    planName: PlanName;
    amount: number;
    dueDate: string;
    issuedDate: string;
    status: InvoiceStatus;
}

export interface SystemSettings {
    platformName: string;
    adminEmail: string;
    platformUrl: string;
    defaultCurrency: string;
    taxPercentage: number;
    paymentGateways: {
        stripe: { apiKey: string; secretKey: string; };
        paypal: { clientId: string; clientSecret: string; };
        mpesa: { consumerKey: string; consumerSecret: string; };
    };
    emailConfig: {
        smtpHost: string;
        smtpPort: number;
        smtpUser: string;
        smtpPass: string;
    };
    branding: {
        logoUrl: string;
    };
}


export type ActiveView = 'dashboard' | 'schools' | 'billing' | 'support' | 'settings' | 'analytics' | 'backup' | 'featureToggles' | 'notifications' | 'hosting' | 'users' | 'security' | 'geminiChat' | 'dataExport' | 'systemHealth';

export type ToastType = 'success' | 'info' | 'error' | 'warning';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

export enum ServiceStatus {
    Operational = 'Operational',
    Degraded = 'Degraded',
    Outage = 'Outage',
}

export interface MonitoredService {
    id: string;
    name: string;
    status: ServiceStatus;
    lastChecked: string;
    latency?: number; // in ms
}

export interface TimePoint {
    time: string;
    value: number;
}

export interface SystemHealthData {
    overallStatus: ServiceStatus;
    services: MonitoredService[];
    apiResponseTime: TimePoint[];
    dbQueryLoad: TimePoint[];
}
