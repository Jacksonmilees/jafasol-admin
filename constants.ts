import { PlanName, SchoolStatus, ModuleKey, Plan, School, SupportTicket, TicketStatus, TicketPriority, Backup, BackupStatus, BackupType, FeatureToggle, Announcement, SystemAlert, AlertLevel, Subdomain, SSLStatus, ServerStatus, User, UserRole, UserStatus, ActivityLog, PasswordPolicy, Invoice, InvoiceStatus, SystemSettings, SystemHealthData, ServiceStatus } from './types';

export const MODULES: { key: ModuleKey; name: string; description: string }[] = [
  { key: ModuleKey.Analytics, name: 'Analytics', description: 'Performance by subject/stream' },
  { key: ModuleKey.StudentManagement, name: 'Student Management', description: 'Manage student profiles' },
  { key: ModuleKey.TeacherManagement, name: 'Teacher Management', description: 'Manage teacher profiles' },
  { key: ModuleKey.Timetable, name: 'Timetable Generator', description: 'Create and manage schedules' },
  { key: ModuleKey.FeeManagement, name: 'Fee Management', description: 'Track and collect fees' },
  { key: ModuleKey.Exams, name: 'Exams & Report Cards', description: 'Manage exams and grades' },
  { key: ModuleKey.Communication, name: 'Communication (SMS/Email)', description: 'Send alerts and messages' },
  { key: ModuleKey.Attendance, name: 'Attendance', description: 'Track student attendance' },
  { key: ModuleKey.Library, name: 'Library', description: 'Manage library resources' },
  { key: ModuleKey.HostelTransport, name: 'Hostel/Transport', description: 'Manage accommodation & transport' },
  { key: ModuleKey.Settings, name: 'Settings', description: 'School-specific settings' },
];

export const PLANS: Record<PlanName, Plan> = {
  [PlanName.Free]: { id: 'plan_free', name: PlanName.Free, price: 0, durationDays: 365, features: ['Student Management', 'Attendance', 'Basic Analytics'], color: 'gray' },
  [PlanName.Basic]: { id: 'plan_basic', name: PlanName.Basic, price: 99, durationDays: 30, features: ['All Free features', 'Fee Management', 'Exams & Reports', 'Timetable'], color: 'blue' },
  [PlanName.Premium]: { id: 'plan_premium', name: PlanName.Premium, price: 199, durationDays: 30, features: ['All Basic features', 'Communication', 'Library', 'Teacher Management'], color: 'indigo' },
  [PlanName.Enterprise]: { id: 'plan_enterprise', name: PlanName.Enterprise, price: 499, durationDays: 365, features: ['All Premium features', 'Custom Modules', 'Dedicated Support'], color: 'purple' },
};

export const MOCK_SCHOOLS: School[] = [
  { id: 'sch_1', name: 'Greenwood High', email: 'contact@greenwood.com', phone: '123-456-7890', logoUrl: 'https://picsum.photos/seed/greenwood/40/40', plan: PlanName.Premium, status: SchoolStatus.Active, subdomain: 'greenwood.jafasol.com', storageUsage: 12.5, createdAt: '2023-08-15', modules: [ModuleKey.Analytics, ModuleKey.StudentManagement, ModuleKey.FeeManagement, ModuleKey.Exams], enabledFeatureToggles: ['ft_1'] },
  { id: 'sch_2', name: 'Oakridge International', email: 'admin@oakridge.edu', phone: '234-567-8901', logoUrl: 'https://picsum.photos/seed/oakridge/40/40', plan: PlanName.Enterprise, status: SchoolStatus.Active, subdomain: 'oakridge.jafasol.com', storageUsage: 45.2, createdAt: '2023-05-20', modules: Object.values(ModuleKey), enabledFeatureToggles: ['ft_1', 'ft_4'] },
  { id: 'sch_3', name: 'Maple Bear Academy', email: 'info@maplebear.ca', phone: '345-678-9012', logoUrl: 'https://picsum.photos/seed/maplebear/40/40', plan: PlanName.Basic, status: SchoolStatus.Inactive, subdomain: 'maplebear.jafasol.com', storageUsage: 5.1, createdAt: '2023-11-01', modules: [ModuleKey.StudentManagement, ModuleKey.Attendance] },
  { id: 'sch_4', name: 'City Central School', email: 'support@citycentral.org', phone: '456-789-0123', logoUrl: 'https://picsum.photos/seed/citycentral/40/40', plan: PlanName.Free, status: SchoolStatus.Active, subdomain: 'citycentral.jafasol.com', storageUsage: 1.8, createdAt: '2024-01-10', modules: [ModuleKey.StudentManagement] },
  { id: 'sch_5', name: 'Lakeside Grammar', email: 'headmaster@lakeside.com', phone: '567-890-1234', logoUrl: 'https://picsum.photos/seed/lakeside/40/40', plan: PlanName.Premium, status: SchoolStatus.Suspended, subdomain: 'lakeside.jafasol.com', storageUsage: 9.7, createdAt: '2022-12-18', modules: [ModuleKey.Analytics, ModuleKey.FeeManagement] },
];

export const MOCK_USERS: User[] = [
    { id: 'usr_1', name: 'Super Admin', email: 'admin@jafasol.com', role: UserRole.SuperAdmin, status: UserStatus.Active, avatarUrl: 'https://picsum.photos/seed/admin/40/40', lastLogin: '2024-07-21 10:00' },
    { id: 'usr_2', name: 'Alice Johnson', email: 'alice.j@greenwood.com', role: UserRole.SchoolAdmin, status: UserStatus.Active, schoolId: 'sch_1', schoolName: 'Greenwood High', avatarUrl: 'https://picsum.photos/seed/alice/40/40', lastLogin: '2024-07-21 09:30' },
    { id: 'usr_3', name: 'Bob Williams', email: 'bob.w@oakridge.edu', role: UserRole.SchoolAdmin, status: UserStatus.Active, schoolId: 'sch_2', schoolName: 'Oakridge International', avatarUrl: 'https://picsum.photos/seed/bob/40/40', lastLogin: '2024-07-20 15:00' },
    { id: 'usr_4', name: 'Charlie Brown', email: 'charlie.b@lakeside.com', role: UserRole.SchoolAdmin, status: UserStatus.Suspended, schoolId: 'sch_5', schoolName: 'Lakeside Grammar', avatarUrl: 'https://picsum.photos/seed/charlie/40/40', lastLogin: '2024-06-15 11:00' },
    { id: 'usr_5', name: 'Diana Miller', email: 'diana.m@greenwood.com', role: UserRole.SchoolAdmin, status: UserStatus.Active, schoolId: 'sch_1', schoolName: 'Greenwood High', avatarUrl: 'https://picsum.photos/seed/diana/40/40', lastLogin: '2024-07-19 18:45' },
];

export const MOCK_TICKETS: SupportTicket[] = [
    { 
        id: 'tic_1', 
        schoolId: 'sch_1', 
        schoolName: 'Greenwood High', 
        subject: 'Payment Gateway Issue', 
        description: 'We are unable to process payments through the integrated payment gateway. We are receiving a "Connection Refused" error. This has been happening since yesterday morning. Can you please investigate?',
        status: TicketStatus.Open, 
        priority: TicketPriority.High, 
        lastUpdated: '2 hours ago',
        conversation: [
            { id: 'msg_1_1', sender: 'School Admin', senderAvatar: 'https://picsum.photos/seed/alice/40/40', text: 'We are unable to process payments. We keep getting an error. Please help!', timestamp: '4 hours ago' },
            { id: 'msg_1_2', sender: 'Super Admin', senderAvatar: 'https://picsum.photos/seed/admin/40/40', text: 'We have received your ticket and are looking into the issue. We will update you shortly.', timestamp: '2 hours ago' },
        ] 
    },
    { 
        id: 'tic_2', 
        schoolId: 'sch_2', 
        schoolName: 'Oakridge International', 
        subject: 'How to add custom fields?',
        description: 'We need to add a "House System" custom field to the student profiles. I looked through the settings but could not find an option for this. Is this feature available?',
        status: TicketStatus.InProgress, 
        priority: TicketPriority.Medium, 
        lastUpdated: '1 day ago',
        conversation: [
            { id: 'msg_2_1', sender: 'School Admin', senderAvatar: 'https://picsum.photos/seed/bob/40/40', text: 'Is it possible to add custom fields to student profiles? We need a "House" field.', timestamp: '2 days ago' },
            { id: 'msg_2_2', sender: 'Super Admin', senderAvatar: 'https://picsum.photos/seed/admin/40/40', text: 'Hi Bob, custom fields are an Enterprise plan feature. I see you are on that plan. I will enable the custom field manager for you. Please check the student settings page.', timestamp: '1 day ago' },
        ] 
    },
    { 
        id: 'tic_3', 
        schoolId: 'sch_3', 
        schoolName: 'Maple Bear Academy', 
        subject: 'Login problem for a teacher', 
        description: 'One of our teachers, Mrs. Davis (davis@maplebear.ca), is unable to log in. She says her password is not working. We tried resetting it from our admin panel, but it did not seem to work.',
        status: TicketStatus.Closed, 
        priority: TicketPriority.Low, 
        lastUpdated: '3 days ago',
        conversation: [
            { id: 'msg_3_1', sender: 'School Admin', text: 'A teacher cannot log in. Can you help?', senderAvatar: 'https://picsum.photos/seed/maplebear_admin/40/40', timestamp: '4 days ago' },
            { id: 'msg_3_2', sender: 'Super Admin', text: 'We have manually reset the password for "davis@maplebear.ca" and sent a temporary password to their email. Please ask them to check.', senderAvatar: 'https://picsum.photos/seed/admin/40/40', timestamp: '3 days ago' },
            { id: 'msg_3_3', sender: 'School Admin', text: 'It worked! Thank you so much.', senderAvatar: 'https://picsum.photos/seed/maplebear_admin/40/40', timestamp: '3 days ago' },
        ]
    },
    { 
        id: 'tic_4', 
        schoolId: 'sch_5', 
        schoolName: 'Lakeside Grammar', 
        subject: 'Billing inquiry', 
        description: 'Our last invoice seems incorrect. It shows a charge for the "Communication" module, which we have not actively used. Can you please clarify this charge?',
        status: TicketStatus.Open, 
        priority: TicketPriority.Medium, 
        lastUpdated: '30 minutes ago',
        conversation: [
            { id: 'msg_4_1', sender: 'School Admin', senderAvatar: 'https://picsum.photos/seed/charlie/40/40', text: 'We have a question about our latest bill.', timestamp: '30 minutes ago' },
        ] 
    },
];

export const MOCK_INVOICES: Invoice[] = [
    { id: 'inv_1', schoolId: 'sch_1', schoolName: 'Greenwood High', planName: PlanName.Premium, amount: 199, issuedDate: '2024-07-15', dueDate: '2024-08-15', status: InvoiceStatus.Due },
    { id: 'inv_2', schoolId: 'sch_2', schoolName: 'Oakridge International', planName: PlanName.Enterprise, amount: 499, issuedDate: '2024-07-20', dueDate: '2024-08-20', status: InvoiceStatus.Due },
    { id: 'inv_3', schoolId: 'sch_5', schoolName: 'Lakeside Grammar', planName: PlanName.Premium, amount: 199, issuedDate: '2024-06-18', dueDate: '2024-07-18', status: InvoiceStatus.Overdue },
    { id: 'inv_4', schoolId: 'sch_1', schoolName: 'Greenwood High', planName: PlanName.Premium, amount: 199, issuedDate: '2024-06-15', dueDate: '2024-07-15', status: InvoiceStatus.Paid },
    { id: 'inv_5', schoolId: 'sch_3', schoolName: 'Maple Bear Academy', planName: PlanName.Basic, amount: 99, issuedDate: '2024-07-01', dueDate: '2024-08-01', status: InvoiceStatus.Due },
];


export const MOCK_ANALYTICS = {
    totalSchools: 5,
    activeSchools: 3,
    totalRevenue: 797,
    monthlySignups: [
        { name: 'Jan', signups: 1 },
        { name: 'Feb', signups: 2 },
        { name: 'Mar', signups: 1 },
        { name: 'Apr', signups: 3 },
        { name: 'May', signups: 2 },
        { name: 'Jun', signups: 4 },
    ],
    planDistribution: [
        { name: 'Free', value: 1, fill: '#6B7280' },
        { name: 'Basic', value: 1, fill: '#3B82F6' },
        { name: 'Premium', value: 2, fill: '#4F46E5' },
        { name: 'Enterprise', value: 1, fill: '#8B5CF6' },
    ]
};

export const MOCK_REVENUE_GROWTH = [
    { month: 'Jan', revenue: 599 },
    { month: 'Feb', revenue: 698 },
    { month: 'Mar', revenue: 698 },
    { month: 'Apr', revenue: 797 },
    { month: 'May', revenue: 797 },
    { month: 'Jun', revenue: 996 },
];

export const MOCK_MODULE_USAGE = [
    { name: 'Student Mgmt', usage: 95 },
    { name: 'Fee Mgmt', usage: 85 },
    { name: 'Exams', usage: 80 },
    { name: 'Attendance', usage: 70 },
    { name: 'Timetable', usage: 65 },
    { name: 'Communication', usage: 50 },
    { name: 'Analytics', usage: 45 },
    { name: 'Teacher Mgmt', usage: 40 },
    { name: 'Library', usage: 30 },
];

export const MOCK_BACKUPS: Backup[] = [
    { id: 'bak_1', schoolId: 'sch_1', schoolName: 'Greenwood High', createdAt: '2024-07-20 02:00', type: BackupType.Automatic, status: BackupStatus.Completed, size: '256 MB' },
    { id: 'bak_2', schoolId: 'sch_2', schoolName: 'Oakridge International', createdAt: '2024-07-20 02:00', type: BackupType.Automatic, status: BackupStatus.Completed, size: '1.2 GB' },
    { id: 'bak_3', schoolId: 'sch_5', schoolName: 'Lakeside Grammar', createdAt: '2024-07-19 14:30', type: BackupType.Manual, status: BackupStatus.Completed, size: '89 MB' },
    { id: 'bak_4', schoolId: 'sch_3', schoolName: 'Maple Bear Academy', createdAt: '2024-07-19 02:00', type: BackupType.Automatic, status: BackupStatus.Failed, size: 'N/A' },
    { id: 'bak_5', schoolId: 'sch_4', schoolName: 'City Central School', createdAt: '2024-07-20 10:00', type: BackupType.Manual, status: BackupStatus.InProgress, size: '...'},
];

export const MOCK_FEATURE_TOGGLES: FeatureToggle[] = [
    { id: 'ft_1', name: 'AI-Powered Timetable Generator', description: 'Uses machine learning to suggest optimal class schedules based on teacher availability and classroom constraints.', enabled: true },
    { id: 'ft_2', name: 'Advanced Parent-Teacher Communication Portal', description: 'A new real-time chat and video call feature for parent-teacher meetings.', enabled: false },
    { id: 'ft_3', name: 'Automated Attendance with Facial Recognition', description: 'Beta module for capturing student attendance using classroom cameras (requires specific hardware).', enabled: false },
    { id: 'ft_4', name: 'Dynamic Fee Structure', description: 'Allows schools to create custom, rule-based fee structures for different student groups.', enabled: true },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    { id: 'ann_1', title: 'Scheduled Maintenance for July 25th', message: 'The Jafasol platform will be down for scheduled maintenance on July 25th from 2:00 AM to 4:00 AM UTC. We apologize for any inconvenience.', target: 'all', targetName: 'All Schools', sentAt: '2024-07-18 09:00' },
    { id: 'ann_2', title: 'New "Library" Module now available for Premium Plans', message: 'We are excited to announce the launch of our new Library module. Schools on the Premium plan can now enable it from their settings.', target: 'all', targetName: 'All Schools', sentAt: '2024-07-15 11:30' },
    { id: 'ann_3', title: 'Welcome to Jafasol!', message: 'Welcome aboard, City Central School! Our team is here to help you get started. Check out our quick start guide in the help section.', target: 'sch_4', targetName: 'City Central School', sentAt: '2024-07-12 16:00' },
];

export const MOCK_SYSTEM_ALERTS: SystemAlert[] = [
    { id: 'sa_1', title: 'Database performance degraded', description: 'We are observing slower than normal database response times. Our engineering team is investigating.', level: AlertLevel.Warning, timestamp: '15 minutes ago' },
    { id: 'sa_2', title: 'New Platform Version Deployed', description: 'Version 2.3.1 has been successfully deployed. This includes performance improvements and bug fixes for the Fee Management module.', level: AlertLevel.Info, timestamp: '2 hours ago' },
    { id: 'sa_3', title: 'Backup failed for Maple Bear Academy', description: 'The automatic daily backup for school sch_3 (Maple Bear Academy) failed. Please investigate and trigger a manual backup.', level: AlertLevel.Critical, timestamp: '1 day ago' },
];

export const MOCK_SUBDOMAINS: Subdomain[] = [
    { id: 'sub_1', schoolId: 'sch_1', schoolName: 'Greenwood High', url: 'greenwood.jafasol.com', sslStatus: SSLStatus.Active, serverStatus: ServerStatus.Online, createdAt: '2023-08-15' },
    { id: 'sub_2', schoolId: 'sch_2', schoolName: 'Oakridge International', url: 'oakridge.jafasol.com', sslStatus: SSLStatus.Active, serverStatus: ServerStatus.Online, createdAt: '2023-05-20' },
    { id: 'sub_3', schoolId: 'sch_3', schoolName: 'Maple Bear Academy', url: 'maplebear.jafasol.com', sslStatus: SSLStatus.Inactive, serverStatus: ServerStatus.Offline, createdAt: '2023-11-01' },
    { id: 'sub_4', schoolId: 'sch_4', schoolName: 'City Central School', url: 'citycentral.jafasol.com', sslStatus: SSLStatus.Active, serverStatus: ServerStatus.Online, createdAt: '2024-01-10' },
    { id: 'sub_5', schoolId: 'sch_5', schoolName: 'Lakeside Grammar', url: 'lakeside.jafasol.com', sslStatus: SSLStatus.ExpiringSoon, serverStatus: ServerStatus.Maintenance, createdAt: '2022-12-18' },
];

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
    { id: 'log_1', userName: 'Super Admin', userAvatar: 'https://picsum.photos/seed/admin/40/40', action: 'User "Alice Johnson" suspended.', ipAddress: '192.168.1.1', timestamp: '2024-07-21 10:05' },
    { id: 'log_2', userName: 'Super Admin', userAvatar: 'https://picsum.photos/seed/admin/40/40', action: 'Logged in.', ipAddress: '192.168.1.1', timestamp: '2024-07-21 10:00' },
    { id: 'log_3', userName: 'Alice Johnson', userAvatar: 'https://picsum.photos/seed/alice/40/40', action: 'Updated student profile for "John Doe".', ipAddress: '203.0.113.25', timestamp: '2024-07-21 09:32' },
    { id: 'log_4', userName: 'Bob Williams', userAvatar: 'https://picsum.photos/seed/bob/40/40', action: 'Generated exam reports for Grade 10.', ipAddress: '198.51.100.10', timestamp: '2024-07-20 15:10' },
    { id: 'log_5', userName: 'Super Admin', userAvatar: 'https://picsum.photos/seed/admin/40/40', action: 'Enabled feature toggle "AI-Powered Timetable".', ipAddress: '192.168.1.1', timestamp: '2024-07-20 11:00' },
];

export const MOCK_PASSWORD_POLICY: PasswordPolicy = {
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: false,
};

export const MOCK_SYSTEM_SETTINGS: SystemSettings = {
    platformName: 'Jafasol Platform',
    adminEmail: 'superadmin@jafasol.com',
    platformUrl: 'https://jafasol.com',
    defaultCurrency: 'USD',
    taxPercentage: 8.5,
    paymentGateways: {
        stripe: { apiKey: 'pk_test_xxxxxxxxxxxxxx', secretKey: 'sk_test_xxxxxxxxxxxxxx' },
        paypal: { clientId: 'PAYPAL_CLIENT_ID_xxxx', clientSecret: 'PAYPAL_SECRET_xxxx' },
        mpesa: { consumerKey: 'MPESA_KEY_xxxx', consumerSecret: 'MPESA_SECRET_xxxx' },
    },
    emailConfig: {
        smtpHost: 'smtp.mailtrap.io',
        smtpPort: 2525,
        smtpUser: 'mailtrapuser',
        smtpPass: 'mailtrappassword',
    },
    branding: {
        logoUrl: 'https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg',
    }
};

export const MOCK_SYSTEM_HEALTH_DATA: SystemHealthData = {
    overallStatus: ServiceStatus.Operational,
    services: [
        { id: 'api', name: 'API Server', status: ServiceStatus.Operational, lastChecked: '1 min ago', latency: 52 },
        { id: 'db', name: 'Database', status: ServiceStatus.Operational, lastChecked: '1 min ago', latency: 80 },
        { id: 'payments', name: 'Payment Gateways', status: ServiceStatus.Operational, lastChecked: '5 mins ago', latency: 150 },
        { id: 'email', name: 'Email Service', status: ServiceStatus.Degraded, lastChecked: '2 mins ago', latency: 3200 },
        { id: 'backups', name: 'Backup System', status: ServiceStatus.Operational, lastChecked: '1 hour ago' },
        { id: 'hosting', name: 'Hosting Infrastructure', status: ServiceStatus.Operational, lastChecked: '10 mins ago' },
    ],
    apiResponseTime: Array.from({ length: 30 }, (_, i) => ({ time: `${30 - i}m ago`, value: Math.floor(Math.random() * 40) + 50 })).reverse(),
    dbQueryLoad: Array.from({ length: 30 }, (_, i) => ({ time: `${30 - i}m ago`, value: Math.floor(Math.random() * 30) + 20 })).reverse(),
};
