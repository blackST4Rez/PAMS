// src/mock/dashboardData.js
// Dashboard widget mock data — assets, transactions, charts, feeds, NPR values

/* ============================================================
   1. ASSETS — values in NPR
   ============================================================ */
export const MOCK_ASSETS = [
    { id: 'A-001', name: 'Town Hall Building', category: 'Building', status: 'Active', value: 'रू 2.4 करोड', date: '2080-01-15', ward: 'Ward 3' },
    { id: 'A-002', name: 'Fire Truck #1', category: 'Vehicle', status: 'Maintenance', value: 'रू 8.5 लाख', date: '2080-03-20', ward: 'Ward 2' },
    { id: 'A-003', name: 'Water Treatment Plant', category: 'Equipment', status: 'Active', value: 'रू 1.2 करोड', date: '2080-05-10', ward: 'Ward 7' },
    { id: 'A-004', name: 'Community Center', category: 'Building', status: 'Active', value: 'रू 1.8 करोड', date: '2080-07-01', ward: 'Ward 3' },
    { id: 'A-005', name: 'School Bus #3', category: 'Vehicle', status: 'Disposed', value: 'रू 1.2 लाख', date: '2080-09-15', ward: 'Ward 1' },
    { id: 'A-006', name: 'Ward 1 Road Section', category: 'Road', status: 'Active', value: 'रू 8.5 लाख', date: '2080-11-02', ward: 'Ward 1' },
    { id: 'A-007', name: 'Ward 5 Public Park Land', category: 'Land', status: 'Active', value: 'रू 2.4 करोड', date: '2081-01-20', ward: 'Ward 5' },
    { id: 'A-008', name: 'Ward 7 Water Pump', category: 'Infrastructure', status: 'Active', value: 'रू 1.8 लाख', date: '2081-02-11', ward: 'Ward 7' },
];

/* ============================================================
   2. ACTIVITY FEEDS — per role
   ============================================================ */
export const MOCK_ACTIVITY_ASSET = [
    { icon: 'FaPlus', color: 'text-green-400', title: 'Added new asset', detail: 'Fire Truck #2', time: '10 min ago' },
    { icon: 'FaEdit', color: 'text-blue-400', title: 'Updated asset', detail: 'Town Hall Building', time: '1 hour ago' },
    { icon: 'FaWrench', color: 'text-yellow-400', title: 'Maintenance logged', detail: 'Water Treatment Plant', time: '3 hours ago' },
    { icon: 'FaTrash', color: 'text-red-400', title: 'Asset disposed', detail: 'School Bus #3', time: '5 hours ago' },
    { icon: 'FaPlus', color: 'text-green-400', title: 'Added new asset', detail: 'Community Center', time: '1 day ago' },
];

export const MOCK_ACTIVITY_FIELD = [
    { icon: 'FaClipboardCheck', color: 'text-green-400', title: 'Inspection completed', detail: 'Town Hall Building', time: '10 min ago' },
    { icon: 'FaUserCheck', color: 'text-blue-400', title: 'Asset verified', detail: 'Fire Truck #1', time: '45 min ago' },
    { icon: 'FaCamera', color: 'text-purple-400', title: 'Photos uploaded', detail: 'Water Treatment Plant', time: '2 hours ago' },
    { icon: 'FaFileAlt', color: 'text-yellow-400', title: 'Field report submitted', detail: 'Weekly Summary #12', time: '3 hours ago' },
    { icon: 'FaMapMarkerAlt', color: 'text-red-400', title: 'Location updated', detail: 'Community Center Site', time: '5 hours ago' },
];

export const MOCK_ACTIVITY_FINANCE = [
    { icon: 'FaMoneyBillWave', color: 'text-green-400', title: 'Tax collection recorded', detail: 'Property Tax FY 2081/82', time: '10 min ago' },
    { icon: 'FaFileInvoice', color: 'text-blue-400', title: 'Invoice submitted', detail: 'Contractor Invoice #1245', time: '1 hour ago' },
    { icon: 'FaCreditCard', color: 'text-red-400', title: 'Payment processed', detail: 'Build Corp - रू 1.24 करोड', time: '3 hours ago' },
    { icon: 'FaUniversity', color: 'text-purple-400', title: 'Bank reconciliation', detail: 'Account #4521', time: '5 hours ago' },
    { icon: 'FaMoneyBillWave', color: 'text-green-400', title: 'Grant received', detail: 'Bagmati Province - रू 5 करोड', time: '1 day ago' },
];

export const MOCK_ACTIVITY_SYSADMIN = [
    { icon: 'FaUser', color: 'text-blue-400', title: 'John Doe', action: 'logged in', time: '2 min ago' },
    { icon: 'FaBox', color: 'text-green-400', title: 'Jane Smith', action: 'added new asset', time: '15 min ago' },
    { icon: 'FaShieldAlt', color: 'text-yellow-400', title: 'Admin', action: 'updated role permissions', time: '1 hour ago' },
    { icon: 'FaLock', color: 'text-red-400', title: 'System', action: 'locked user account', time: '2 hours ago' },
    { icon: 'FaHdd', color: 'text-purple-400', title: 'Backup', action: 'completed successfully', time: '3 hours ago' },
    { icon: 'FaUser', color: 'text-blue-400', title: 'Mike Johnson', action: 'requested access', time: '4 hours ago' },
    { icon: 'FaBox', color: 'text-green-400', title: 'Sarah Wilson', action: 'updated asset details', time: '5 hours ago' },
];

/* ============================================================
   3. AUDIT TRAILS
   ============================================================ */
export const MOCK_AUDIT_TRAIL = [
    { action: 'Asset value updated', user: 'admin@system.com', severity: 'high', time: '2 min ago' },
    { action: 'User role changed', user: 'manager@system.com', severity: 'medium', time: '15 min ago' },
    { action: 'Asset disposed', user: 'officer@system.com', severity: 'high', time: '1 hour ago' },
    { action: 'Maintenance logged', user: 'field@system.com', severity: 'low', time: '2 hours ago' },
    { action: 'Asset created', user: 'field@system.com', severity: 'low', time: '4 hours ago' },
    { action: 'Role permissions edited', user: 'admin@system.com', severity: 'high', time: '6 hours ago' },
];

export const MOCK_AUDIT_FEED = [
    { icon: 'FaEdit', color: 'text-blue-400', title: 'Asset value updated', user: 'john.doe', time: '2 minutes ago' },
    { icon: 'FaUserCog', color: 'text-purple-400', title: 'User role changed', user: 'admin', time: '15 minutes ago' },
    { icon: 'FaTrash', color: 'text-red-400', title: 'Asset disposed', user: 'jane.smith', time: '1 hour ago' },
    { icon: 'FaFileInvoice', color: 'text-yellow-400', title: 'Invoice approved', user: 'mike.johnson', time: '2 hours ago' },
    { icon: 'FaCheckCircle', color: 'text-green-400', title: 'Maintenance completed', user: 'sarah.wilson', time: '3 hours ago' },
    { icon: 'FaLock', color: 'text-red-400', title: 'Login blocked', user: 'system', time: '4 hours ago' },
    { icon: 'FaEdit', color: 'text-blue-400', title: 'Asset details modified', user: 'robert.brown', time: '5 hours ago' },
];

/* ============================================================
   4. TRANSACTIONS — NPR
   ============================================================ */
export const MOCK_TRANSACTIONS = [
    { id: 'TXN-001', description: 'Road Construction Payment', category: 'Infrastructure', type: 'Expense', amount: '-रू 2.45 करोड', date: '2081-01-15' },
    { id: 'TXN-002', description: 'Property Tax Collection', category: 'Revenue', type: 'Income', amount: '+रू 1.80 करोड', date: '2081-01-14' },
    { id: 'TXN-003', description: 'Equipment Purchase', category: 'Equipment', type: 'Expense', amount: '-रू 89.5 लाख', date: '2081-01-13' },
    { id: 'TXN-004', description: 'Grant from Bagmati Province', category: 'Grant', type: 'Income', amount: '+रू 5.00 करोड', date: '2081-01-12' },
    { id: 'TXN-005', description: 'Office Supplies', category: 'Administrative', type: 'Expense', amount: '-रू 1.24 लाख', date: '2081-01-11' },
];

/* ============================================================
   5. FIELD TASKS
   ============================================================ */
export const MOCK_FIELD_TASKS = [
    { id: 'TSK-001', task: 'Building Inspection', location: 'Town Hall', priority: 'High', status: 'In Progress', due: '2081-01-20' },
    { id: 'TSK-002', task: 'Asset Verification', location: 'Water Plant', priority: 'Medium', status: 'Pending', due: '2081-01-21' },
    { id: 'TSK-003', task: 'Maintenance Check', location: 'Fire Station', priority: 'High', status: 'Completed', due: '2081-01-18' },
    { id: 'TSK-004', task: 'Site Survey', location: 'Community Center', priority: 'Low', status: 'Pending', due: '2081-01-22' },
    { id: 'TSK-005', task: 'Equipment Audit', location: 'Public Works', priority: 'Medium', status: 'In Progress', due: '2081-01-19' },
];

/* ============================================================
   6. TOP ACTIVE USERS
   ============================================================ */
export const MOCK_TOP_USERS = [
    { name: 'John Doe', role: 'Admin', actions: 245, trend: '+12%' },
    { name: 'Jane Smith', role: 'Asset Manager', actions: 187, trend: '+8%' },
    { name: 'Mike Johnson', role: 'Finance Officer', actions: 156, trend: '-3%' },
    { name: 'Sarah Wilson', role: 'Field Officer', actions: 134, trend: '+15%' },
    { name: 'Robert Brown', role: 'Auditor', actions: 98, trend: '+5%' },
];

/* ============================================================
   7. USERS BY ROLE
   ============================================================ */
export const MOCK_USERS_BY_ROLE = [
    { label: 'Administrators', value: '12 (8%)' },
    { label: 'Asset Managers', value: '45 (32%)' },
    { label: 'Finance Officers', value: '28 (20%)' },
    { label: 'Field Officers', value: '35 (25%)' },
    { label: 'Auditors', value: '23 (16%)' },
    { label: 'Public Users', value: '14 (10%)' },
];

/* ============================================================
   8. ACTIVITY BY ROLE
   ============================================================ */
export const MOCK_ACTIVITY_BY_ROLE = [
    { label: 'Administrators', value: 245, color: 'bg-blue-500' },
    { label: 'Asset Managers', value: 187, color: 'bg-green-500' },
    { label: 'Finance Officers', value: 156, color: 'bg-yellow-500' },
    { label: 'Field Officers', value: 134, color: 'bg-purple-500' },
    { label: 'Auditors', value: 98, color: 'bg-red-500' },
];

/* ============================================================
   9. INACTIVE USERS
   ============================================================ */
export const MOCK_INACTIVE_USERS = [
    { name: 'David Miller', role: 'Field Officer', lastActive: '45 days ago' },
    { name: 'Emily Davis', role: 'Asset Manager', lastActive: '38 days ago' },
    { name: 'Chris Wilson', role: 'Auditor', lastActive: '35 days ago' },
    { name: 'Lisa Anderson', role: 'Finance Officer', lastActive: '32 days ago' },
];

/* ============================================================
   10. FLAGGED ITEMS
   ============================================================ */
export const MOCK_FLAGGED_ITEMS = [
    { title: 'Missing documentation', count: 12, severity: 'high' },
    { title: 'Overdue valuations', count: 8, severity: 'medium' },
    { title: 'Unverified assets', count: 15, severity: 'high' },
    { title: 'Irregular changes', count: 4, severity: 'critical' },
];

/* ============================================================
   11. SUSPICIOUS ACTIVITIES
   ============================================================ */
export const MOCK_SUSPICIOUS = [
    { icon: 'FaLock', title: 'Multiple failed logins', detail: '3 accounts - 10 attempts', color: 'red' },
    { icon: 'FaUserSecret', title: 'Unusual access pattern', detail: 'admin@system.com - 2AM', color: 'yellow' },
    { icon: 'FaDatabase', title: 'Bulk data export', detail: '2,450 records exported', color: 'orange' },
];

/* ============================================================
   12. COMPLIANCE
   ============================================================ */
export const MOCK_COMPLIANCE_STATUS = [
    { label: 'Documentation', value: 92, color: 'bg-green-500' },
    { label: 'Verification', value: 88, color: 'bg-green-500' },
    { label: 'Valuation', value: 76, color: 'bg-yellow-500' },
    { label: 'Maintenance', value: 64, color: 'bg-red-500' },
];

export const MOCK_COMPLIANCE_EVENTS = [
    { title: 'Q1 Audit Completed', date: '2081-01-15' },
    { title: 'Policy Updated', date: '2080-12-02' },
    { title: 'Training Completed', date: '2080-11-25' },
    { title: 'Compliance Review', date: '2080-11-20' },
];

/* ============================================================
   13. SYSTEM ALERTS
   ============================================================ */
export const MOCK_SYSTEM_ALERTS = [
    { icon: 'FaServer', title: 'Storage 85% used', detail: '85.6 GB of 100 GB', color: 'yellow' },
    { icon: 'FaLink', title: 'Integration failed', detail: 'API timeout - 5 min ago', color: 'red' },
    { icon: 'FaLock', title: '3 locked accounts', detail: 'Multiple failed attempts', color: 'orange' },
];

/* ============================================================
   14. PUBLIC WARD BREAKDOWN
   ============================================================ */
export const MOCK_WARD_BREAKDOWN = [
    { ward: 'Ward 1', count: 186, percent: 15 },
    { ward: 'Ward 2', count: 142, percent: 11 },
    { ward: 'Ward 3', count: 168, percent: 13 },
    { ward: 'Ward 4', count: 124, percent: 10 },
    { ward: 'Ward 5', count: 156, percent: 13 },
    { ward: 'Ward 6', count: 134, percent: 11 },
    { ward: 'Ward 7', count: 118, percent: 9 },
    { ward: 'Ward 8', count: 112, percent: 9 },
    { ward: 'Ward 9', count: 107, percent: 9 },
];

/* ============================================================
   15. LATEST PUBLIC ASSETS — NPR
   ============================================================ */
export const MOCK_LATEST_PUBLIC = [
    { id: 'AST-001', name: 'Ward 3 Community Hall', category: 'Building', ward: 'Ward 3', value: 'रू 1.2 करोड', date: '2081-01-15' },
    { id: 'AST-002', name: 'Ward 1 Road Section', category: 'Road', ward: 'Ward 1', value: 'रू 8.5 लाख', date: '2081-01-14' },
    { id: 'AST-003', name: 'Ward 5 Public Park Land', category: 'Land', ward: 'Ward 5', value: 'रू 2.4 करोड', date: '2081-01-13' },
    { id: 'AST-004', name: 'Ward 2 Fire Truck', category: 'Vehicle', ward: 'Ward 2', value: 'रू 4.2 लाख', date: '2081-01-12' },
    { id: 'AST-005', name: 'Ward 7 Water Pump', category: 'Infrastructure', ward: 'Ward 7', value: 'रू 1.8 लाख', date: '2081-01-11' },
];

/* ============================================================
   16. PUBLIC NOTICES — BS dates
   ============================================================ */
export const MOCK_PUBLIC_NOTICES = [
    { title: 'System Update', detail: 'New GIS features added', date: '2081-01-15' },
    { title: 'Data Refresh', detail: 'Asset data updated', date: '2081-01-12' },
    { title: 'Public Survey', detail: 'Help us improve', date: '2081-01-05' },
];

/* ============================================================
   17. CATEGORIES
   ============================================================ */
export const MOCK_CATEGORIES = [
    { label: 'Land', count: 245 },
    { label: 'Building', count: 187 },
    { label: 'Vehicle', count: 92 },
    { label: 'Road', count: 523 },
    { label: 'Infrastructure', count: 112 },
    { label: 'Office Equipment', count: 88 },
];

/* ============================================================
   18. CHART DATA (Recharts-ready) — values in NPR करोड
   ============================================================ */

export const CHART_ASSET_DISTRIBUTION = [
    { name: 'Buildings', value: 35, color: '#3b82f6' },
    { name: 'Vehicles', value: 25, color: '#22c55e' },
    { name: 'Equipment', value: 20, color: '#eab308' },
    { name: 'Others', value: 20, color: '#a855f7' },
];

export const CHART_ASSET_VALUE_TREND = [
    { month: 'Shrawan', value: 10.2 },
    { month: 'Bhadra', value: 10.8 },
    { month: 'Ashwin', value: 11.1 },
    { month: 'Kartik', value: 11.5 },
    { month: 'Mangsir', value: 11.9 },
    { month: 'Poush', value: 12.4 },
];

export const CHART_MAINTENANCE = [
    { name: 'Upcoming', value: 7, color: '#22c55e' },
    { name: 'Overdue', value: 3, color: '#ef4444' },
];

export const CHART_BUDGET_DISTRIBUTION = [
    { name: 'Infrastructure', value: 34, color: '#3b82f6' },
    { name: 'Education', value: 25, color: '#22c55e' },
    { name: 'Healthcare', value: 20, color: '#eab308' },
    { name: 'Others', value: 21, color: '#a855f7' },
];

export const CHART_EXPENSE_TREND = [
    { month: 'Shrawan', value: 1.2 },
    { month: 'Bhadra', value: 1.4 },
    { month: 'Ashwin', value: 1.3 },
    { month: 'Kartik', value: 1.5 },
    { month: 'Mangsir', value: 1.6 },
    { month: 'Poush', value: 1.8 },
];

export const CHART_REVENUE_VS_EXPENSE = [
    { name: 'Revenue', value: 24.8, color: '#22c55e' },
    { name: 'Expense', value: 18.2, color: '#ef4444' },
];

export const CHART_INSPECTION_TREND = [
    { month: 'Shrawan', value: 72 },
    { month: 'Bhadra', value: 80 },
    { month: 'Ashwin', value: 86 },
    { month: 'Kartik', value: 78 },
    { month: 'Mangsir', value: 92 },
    { month: 'Poush', value: 88 },
];

export const CHART_ASSET_CONDITION = [
    { name: 'Excellent', value: 42, color: '#22c55e' },
    { name: 'Good', value: 35, color: '#3b82f6' },
    { name: 'Fair', value: 18, color: '#eab308' },
    { name: 'Poor', value: 5, color: '#ef4444' },
];

export const CHART_TASK_COMPLETION = [
    { name: 'Completed', value: 88.5, color: '#22c55e' },
    { name: 'Pending', value: 11.5, color: '#eab308' },
];

export const CHART_ASSET_STATUS = [
    { name: 'Active', value: 73, color: '#22c55e' },
    { name: 'Pending', value: 12, color: '#eab308' },
    { name: 'Retired', value: 10, color: '#ef4444' },
    { name: 'Cancelled', value: 5, color: '#6b7280' },
];

export const CHART_CHANGES_BY_ENTITY = [
    { name: 'Assets', value: 124, color: '#3b82f6' },
    { name: 'Users', value: 52, color: '#22c55e' },
    { name: 'Maintenance', value: 48, color: '#eab308' },
    { name: 'Approvals', value: 38, color: '#a855f7' },
    { name: 'Disposals', value: 22, color: '#ef4444' },
];

export const CHART_USER_ACTIVITY = [
    { day: 'Sun', value: 45 },
    { day: 'Mon', value: 180 },
    { day: 'Tue', value: 210 },
    { day: 'Wed', value: 247 },
    { day: 'Thu', value: 195 },
    { day: 'Fri', value: 160 },
    { day: 'Sat', value: 80 },
];

export const CHART_SYSTEM_USAGE = [
    { time: '00:00', value: 120 },
    { time: '04:00', value: 85 },
    { time: '08:00', value: 320 },
    { time: '12:00', value: 480 },
    { time: '16:00', value: 410 },
    { time: '20:00', value: 240 },
];

export const CHART_USERS_BY_ROLE = [
    { name: 'Administrators', value: 12, color: '#3b82f6' },
    { name: 'Asset Managers', value: 45, color: '#22c55e' },
    { name: 'Finance Officers', value: 28, color: '#eab308' },
    { name: 'Field Officers', value: 35, color: '#a855f7' },
    { name: 'Auditors', value: 23, color: '#ef4444' },
    { name: 'Public Users', value: 14, color: '#6b7280' },
];

export const CHART_ASSET_GROWTH = [
    { month: 'Shrawan', value: 8100 },
    { month: 'Bhadra', value: 8200 },
    { month: 'Ashwin', value: 8280 },
    { month: 'Kartik', value: 8350 },
    { month: 'Mangsir', value: 8420 },
    { month: 'Poush', value: 8492 },
];

export const CHART_DEPRECIATION_TREND = [
    { month: 'Shrawan', value: 0.4 },
    { month: 'Bhadra', value: 0.5 },
    { month: 'Ashwin', value: 0.45 },
    { month: 'Kartik', value: 0.55 },
    { month: 'Mangsir', value: 0.6 },
    { month: 'Poush', value: 0.62 },
];