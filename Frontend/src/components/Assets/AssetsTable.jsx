import { FaEye, FaCheck } from 'react-icons/fa';
import { useAuth } from '../Context/AuthContext';
import { formatNPR } from '../Utils/formatCurrency';

/* Column header labels */
const COLUMNS = [
    { key: 'assetCode', label: 'Code', align: 'left' },
    { key: 'title',     label: 'Title', align: 'left' },
    { key: 'category',  label: 'Category', align: 'left' },
    { key: 'ward',      label: 'Ward', align: 'left' },
    { key: 'cost',      label: 'Cost', align: 'right' },
    { key: 'status',    label: 'Status', align: 'left' },
    { key: 'actions',   label: 'Actions', align: 'right' },
];

const AssetsTable = ({ assets, onRowClick }) => {
    const { hasPermission } = useAuth();

    const canApprove = hasPermission('asset.approve');

    if (assets.length === 0) {
        return (
            <div className="bg-[#242424] rounded-xl p-8">
                <p className="text-white/50 text-sm py-4 text-center">
                    No assets match the current filters.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {COLUMNS.map((col) => (
                                <th
                                    key={col.key}
                                    className={`text-${col.align} text-xs font-semibold text-white/60 uppercase tracking-wider pb-3 px-4`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((a) => (
                            <tr
                                key={a.id}
                                className="border-b border-b-[#3a3a3a] hover:bg-white/2 transition-colors cursor-pointer"
                                onClick={() => onRowClick(a.id)}
                            >
                                {/* Code */}
                                <td className="py-3 px-4">
                                    <p className="text-sm font-medium text-white">
                                        {a.assetCode}
                                    </p>
                                </td>

                                {/* Title */}
                                <td className="py-3 px-4">
                                    <p className="text-sm font-medium text-white truncate max-w-xs">
                                        {a.title}
                                    </p>
                                </td>

                                {/* Category */}
                                <td className="py-3 px-4">
                                    <p className="text-sm text-white/80">
                                        {a.categoryName}
                                    </p>
                                </td>

                                {/* Ward */}
                                <td className="py-3 px-4">
                                    <p className="text-sm text-white/80">
                                        {a.wardName}
                                    </p>
                                </td>

                                {/* Cost */}
                                <td className="py-3 px-4 text-right">
                                    <p className="text-sm text-white/80">
                                        {formatNPR(a.acquisitionCost)}
                                    </p>
                                </td>

                                {/* Status */}
                                <td className="py-3 px-4">
                                    <span
                                        className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${a.statusMeta.color}`}
                                    >
                                        {a.statusMeta.label}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td
                                    className="py-3 px-4 text-right"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => onRowClick(a.id)}
                                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                        title="View details"
                                    >
                                        <FaEye className="w-3 h-3" />
                                        View
                                    </button>

                                    {canApprove && a.status === 'AWAITING_REVIEW' && (
                                        <>
                                            <button
                                                onClick={() => onRowClick(a.id)}
                                                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 ml-2 rounded-md text-green-400 hover:bg-green-500/10 transition-colors"
                                                title="Review for approval"
                                            >
                                                <FaCheck className="w-3 h-3" />
                                                Review
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssetsTable;