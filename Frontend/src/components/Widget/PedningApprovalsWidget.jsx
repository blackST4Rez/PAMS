import { useEffect, useState } from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { MOCK_PENDING_APPROVALS } from '../mock/mockData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const PendingApprovalsWidget = () => {
    const { user, USE_MOCK } = useAuth();
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!user) return;
        if (USE_MOCK) {
            const role = user.roles?.[0];
            setItems(MOCK_PENDING_APPROVALS[role] ?? []);
            return;
        }
        const token = localStorage.getItem('token');
        fetch(`${API_BASE}/approvals/pending`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((j) => setItems(j.data ?? []))
            .catch(() => setItems([]));
    }, [user, USE_MOCK]);

    if (items.length === 0) return null; // auto-hide when empty

    return (
        <div className="bg-[#242424] rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-[#173ef0]" />
                My Pending Approvals ({items.length})
            </h3>
            <div className="space-y-2.5">
                {items.map((r) => (
                    <div key={r.requestId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{r.title}</p>
                            <p className="text-xs text-white/50 mt-0.5">
                                Level {r.currentLevel} of {r.totalLevels} • {r.entityName}
                            </p>
                        </div>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400 ml-3 shrink-0">
                            {r.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PendingApprovalsWidget;