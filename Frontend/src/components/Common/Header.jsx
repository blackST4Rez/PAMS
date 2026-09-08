import { Link } from 'react-router-dom';
import Button from './Button';
import { BiLogIn } from 'react-icons/bi';
import LogoImage from '../../assets/Logo.svg';

const Header = ({ title, subtitle, navLinks }) => {
    return (
        <header className="fixed top-0 left-0 right-0 w-full bg-[#121213] border-b border-[##002cf2] z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-8 lg:px-12">
                <div className="flex items-center justify-between h-24 lg:h-28">
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="w-14 h-14 flex items-center justify-center">
                            <img
                                src={LogoImage}
                                alt="LogoImage"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-[#002cf2]">{title}</h1>
                            <p className="text-sm text-white">{subtitle}</p>
                        </div>
                    </Link>
                    <div className="flex items-center gap-6 lg:gap-8">
                        {navLinks.map((link, index) => (
                            <Button
                                key={index}
                                to={link.path}
                                variant={link.primary ? 'primary' : 'ghost'}
                                size={link.primary ? 'large' : 'medium'}
                                icon={link.primary ? BiLogIn : null}
                                className='text-white'
                            >
                                {link.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;