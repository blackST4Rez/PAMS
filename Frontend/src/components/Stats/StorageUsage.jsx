const StorageUsage = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Storage Usage</h3>
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">85.6 GB used</span>
                    <span className="text-gray-600">100 GB total</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85.6%' }}></div>
                </div>
            </div>
        </div>
    );
};

export default StorageUsage;