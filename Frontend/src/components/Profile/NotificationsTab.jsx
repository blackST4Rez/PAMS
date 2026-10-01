import { useState } from 'react';
import { GrNotification } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import {
    FaCheck,
    FaCheckCircle,
    FaInfoCircle,
    FaExclamationTriangle,
    FaTimesCircle,
} from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';

const NOTIF_TYPE_META = {
    success: { Icon: FaCheckCircle, color: 'text-emerald-400', ring: 'bg-emerald-500/10' },
    info:    { Icon: FaInfoCircle,  color: 'text-[#7c8cff]',    ring: 'bg-[#173ef0]/10' },
    warning: { Icon: FaExclamationTriangle, color: 'text-yellow-400', ring: 'bg-yellow-500/10' },
    error:   { Icon: FaTimesCircle, color: 'text-red-400',      ring: 'bg-red-500/10' },
};

const fmtDateTime = (iso) => {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
};

const NotificationsTab = () => {
    const {
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
    } = useAuth();
    const navigate = useNavigate();

    const [filter, setFilter] = useState('all'); // 'all' | 'unread'

    const visible = filter === 'unread'
        ? notifications.filter((n) => !n.read)
        : notifications;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-l-5 border-l-[#173ef0] px-6 flex-wrap gap-3">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    Notifications
                    {unreadCount > 0 && (
                        <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                            {unreadCount} new
                        </span>
                    )}
                </h2>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllNotificationsRead}
                        className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
                    >
                        <FaCheck className="w-3.5 h-3.5" />
                        Mark all read
                    </button>
                )}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 p-0.5 bg-white/5 border border-white/10 mb-4 mx-6 max-w-xs">
                <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className={`flex-1 text-xs font-medium py-1.5 transition-colors ${
                        filter === 'all'
                            ? 'bg-white/10 text-white'
                            : 'text-white/60 hover:text-white'
                    }`}
                >
                    All
                    <span className="ml-1 text-white/40">
                        ({notifications.length})
                    </span>
                </button>
                <button
                    type="button"
                    onClick={() => setFilter('unread')}
                    className={`flex-1 text-xs font-medium py-1.5 transition-colors ${
                        filter === 'unread'
                            ? 'bg-white/10 text-white'
                            : 'text-white/60 hover:text-white'
                    }`}
                >
                    Unread
                    <span className="ml-1 text-white/40">
                        ({unreadCount})
                    </span>
                </button>
            </div>

            {/* Body */}
            {visible.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <GrNotification className="w-6 h-6 text-white/30" />
                    </div>
                    <p className="text-sm font-medium text-white/70">
                        {filter === 'unread'
                            ? 'All caught up'
                            : 'No notifications yet'}
                    </p>
                    <p className="text-xs text-white/40 mt-1.5 leading-relaxed max-w-xs">
                        {filter === 'unread'
                            ? 'You have no unread notifications.'
                            : 'Updates about your requests will appear here.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {visible.map((n) => {
                        const meta =
                            NOTIF_TYPE_META[n.type] ?? NOTIF_TYPE_META.info;
                        const { Icon, color, ring } = meta;
                        return (
                            <div
                                key={n.id}
                                onClick={() => markNotificationRead(n.id)}
                                className={`flex items-start gap-3 p-3.5 cursor-pointer transition-colors ${
                                    n.read
                                        ? 'bg-white/5 hover:bg-white/10'
                                        : 'bg-[#173ef0]/10 border border-[#173ef0]/30 hover:bg-[#173ef0]/15'
                                }`}
                            >
                                <div className={`mt-0.5 shrink-0 w-8 h-8 flex items-center justify-center rounded ${ring}`}>
                                    <Icon className={`w-4 h-4 ${color}`} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3">
                                        <p
                                            className={`text-sm leading-snug ${
                                                n.read
                                                    ? 'font-normal text-white/80'
                                                    : 'font-semibold text-white'
                                            }`}
                                        >
                                            {n.title}
                                        </p>
                                        {!n.read && (
                                            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#173ef0]" />
                                        )}
                                    </div>
                                    {n.body && (
                                        <p className="text-xs text-white/60 mt-1 leading-snug">
                                            {n.body}
                                        </p>
                                    )}
                                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider mt-1.5">
                                        {fmtDateTime(n.createdAt)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default NotificationsTab;