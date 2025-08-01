import { PlanName, SchoolStatus, ModuleKey, Plan, School, SupportTicket, TicketStatus, TicketPriority, Backup, BackupStatus, BackupType, FeatureToggle, Announcement, SystemAlert, AlertLevel, Subdomain, SSLStatus, ServerStatus, User, UserRole, UserStatus, ActivityLog, PasswordPolicy, Invoice, InvoiceStatus, SystemSettings, SystemHealthData, ServiceStatus } from './types';

export const MODULES: { key: ModuleKey; name: string; description: string }[] = [
  { key: ModuleKey.Analytics, name: 'Analytics', description: 'Performance by subject/stream' },
  { key: ModuleKey.Academics, name: 'Academics', description: 'Manage academic activities' },
  { key: ModuleKey.Attendance, name: 'Attendance', description: 'Track student attendance' },
  { key: ModuleKey.FeeManagement, name: 'Fee Management', description: 'Track and collect fees' },
  { key: ModuleKey.Communication, name: 'Communication', description: 'Send alerts and messages' },
  { key: ModuleKey.Transport, name: 'Transport', description: 'Manage transport services' },
  { key: ModuleKey.Library, name: 'Library', description: 'Manage library resources' },
];

export const PLANS: Record<PlanName, Plan> = {
  [PlanName.Free]: { id: 'plan_free', name: PlanName.Free, price: 0, durationDays: 365, features: ['Student Management', 'Attendance', 'Basic Analytics'], color: 'gray' },
  [PlanName.Basic]: { id: 'plan_basic', name: PlanName.Basic, price: 15000, durationDays: 30, features: ['All Free features', 'Fee Management', 'Exams & Reports', 'Timetable'], color: 'blue' },
  [PlanName.Premium]: { id: 'plan_premium', name: PlanName.Premium, price: 30000, durationDays: 30, features: ['All Basic features', 'Communication', 'Library', 'Teacher Management'], color: 'indigo' },
  [PlanName.Enterprise]: { id: 'plan_enterprise', name: PlanName.Enterprise, price: 75000, durationDays: 365, features: ['All Premium features', 'Custom Modules', 'Dedicated Support'], color: 'purple' },
};
