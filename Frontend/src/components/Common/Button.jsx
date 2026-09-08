import { Link } from 'react-router-dom';

const Button = ({
    children,
    variant = 'primary',
    size = 'large',
    to,
    onClick,
    type = 'button',
    className = '',
    icon: Icon,
    iconPosition = 'left',
    disabled = false,
    fullWidth = false,
    ...props
}) => {
    // Size variants
    const sizes = {
        small: 'px-5 py-2.5 text-sm',
        medium: 'px-8 py-3 text-base',
        large: 'px-10 py-4 text-lg',
        xlarge: 'px-12 py-5 text-xl',
    };

    // Variant styles with custom colors - NO border radius, NO scale
    const variants = {
        primary: 'bg-[#002cf2] text-white hover:bg-[#001ea6]',
        secondary: 'bg-[#001ea6] text-white hover:bg-[#001a8a]',
        outline: 'bg-transparent text-[#002cf2] hover:bg-[#002cf2]/10 border-2 border-[#002cf2]',
        ghost: 'bg-transparent text-gray-700 hover:text-[#2c51f5]',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        success: 'bg-green-600 text-white hover:bg-green-700',
        white: 'bg-white text-[#002cf2] hover:bg-gray-50 border-2 border-[#002cf2]',
    };

    // Base classes - NO rounded, NO translate
    const baseClasses = `
    inline-flex items-center gap-2.5
    font-semibold
    transition-colors
    duration-200
    ${sizes[size]}
    ${variants[variant]}
    ${fullWidth ? 'w-full justify-center' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
    `;

    // If it's a link (has 'to' prop)
    if (to) {
        return (
            <Link to={to} className={baseClasses} {...props}>
                {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
                {children}
                {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
            </Link>
        );
    }

    // Otherwise it's a button
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={baseClasses}
            {...props}
        >
            {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </button>
    );
};

export default Button;