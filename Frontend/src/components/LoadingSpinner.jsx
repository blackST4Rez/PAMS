
const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const spinner = (
        <div className="flex items-center justify-center">
            <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600`}></div>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default LoadingSpinner;