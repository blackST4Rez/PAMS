import {
    BiPackage, BiWrench, BiDollar, BiCheckCircle,
    BiGridAlt, BiHistory, BiPlus,BiLockAlt, BiWorld, BiBuilding, BiPhone, BiEnvelope
} from 'react-icons/bi';

export const landingData = {
    // Header/Navigation
    header: {
        logo: 'P',
        title: 'PMS',
        subtitle: 'Asset Management',
        navLinks: [
            { label: 'Sign In', path: '/login', primary: true },
        ],
    },

    // Hero Section
    hero: {
        title: 'Manage Public Assets',
        highlight: 'Efficiently',
        description: 'A comprehensive digital asset register for rural municipalities. Track, maintain, and optimize every public asset from acquisition to disposal.',
        buttons: [
            { label: 'Get Started', path: '/login', primary: true, icon: 'login' },
            { label: 'Learn More', action: 'scroll', icon: 'chevron' },
        ],
        features: [
            { icon: BiCheckCircle, text: 'Secure & Reliable', color: 'text-green-600' },
            { icon: BiLockAlt, text: 'GDPR Compliant', color: 'text-indigo-600' },
            { icon: BiWorld, text: 'Cloud Based', color: 'text-blue-600' },
        ],
        stats: {
            assets: 1256,
            categories: 6,
            wards: 12,
            users: 45,
        },
    },

    // Features
    features: {
        badge: 'Features',
        title: 'Everything You Need to Manage Assets',
        description: 'Comprehensive features designed specifically for rural municipality asset management',
        items: [
            {
                icon: BiPackage,
                title: 'Asset Registry',
                description: 'Track every public asset from acquisition to disposal with complete lifecycle management.',
                color: 'text-indigo-600',
            },
            {
                icon: BiWrench,
                title: 'Maintenance Management',
                description: 'Schedule and log maintenance activities with automated reminders and cost tracking.',
                color: 'text-blue-600',
            },
            {
                icon: BiDollar,
                title: 'Valuation & Depreciation',
                description: 'Calculate asset depreciation and current valuation with multiple depreciation methods.',
                color: 'text-purple-600',
            },
            {
                icon: BiCheckCircle,
                title: 'Approval Workflow',
                description: 'Multi-level approval engine for asset disposal, transfers, and major changes.',
                color: 'text-green-600',
            },
            {
                icon: BiGridAlt,
                title: 'Reports & Analytics',
                description: 'Generate comprehensive reports on asset register, ward-wise breakdown, and maintenance costs.',
                color: 'text-orange-600',
            },
            {
                icon: BiHistory,
                title: 'Audit Trails',
                description: 'Complete accountability with detailed audit logs of every action in the system.',
                color: 'text-red-600',
            },
        ],
    },

    // How It Works
    howItWorks: {
        badge: 'How It Works',
        title: 'Simple Steps to Get Started',
        description: 'Start managing your public assets effectively in just a few steps',
        steps: [
            {
                step: '01',
                title: 'Register Assets',
                description: 'Add new assets with details like title, category, acquisition cost, and location.',
                icon: BiPlus,
            },
            {
                step: '02',
                title: 'Track & Maintain',
                description: 'Schedule maintenance, log activities, and monitor asset health in real-time.',
                icon: BiWrench,
            },
            {
                step: '03',
                title: 'Value & Depreciate',
                description: 'Run depreciation calculations and get accurate current asset values.',
                icon: BiDollar,
            },
            {
                step: '04',
                title: 'Approve & Transfer',
                description: 'Manage asset transfers and disposals through multi-level approval workflows.',
                icon: BiCheckCircle,
            },
        ],
    },

    // CTA
    cta: {
        title: 'Ready to Start Managing Your Assets?',
        description: 'Join Gaurishankar Rural Municipality and streamline your asset management process today.',
        buttons: [
            { label: 'Get Started Now', path: '/login', primary: true, icon: 'login' },
        ],
    },

    // Footer
    footer: {
        logo: 'P',
        title: 'PMS',
        subtitle: 'Asset Management',
        description: 'Public Assets Management System for Gaurishankar Rural Municipality, Dolakha.',
        quickLinks: [
            { label: 'Sign In', path: '/login' },
            { label: 'Get Started', path: '/login' },
            { label: 'About', path: '#' },
            { label: 'Contact', path: '#' },
        ],
        features: [
            { label: 'Asset Registry', path: '#' },
            { label: 'Maintenance', path: '#' },
            { label: 'Valuation', path: '#' },
            { label: 'Reports', path: '#' },
        ],
        contact: {
            address: 'Gaurishankar, Dolakha',
            hours: 'Mon-Fri: 9AM - 5PM',
            phone: '+977-123 456789',
        },
        socialLinks: [
            { icon: BiBuilding, path: '#' },
            { icon: BiPhone, path: '#' },
            { icon: BiEnvelope, path: '#' },
        ],
        copyright: `PMS - Gaurishankar Rural Municipality. All rights reserved.`,
    },
};