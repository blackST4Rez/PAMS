import { Link } from 'react-router-dom';
import { BiMapPin, BiCalendar, BiPhone } from 'react-icons/bi';
import LogoImage from '../../assets/Logo.svg'

const Footer = ({
    description, quickLinks, features, contact, socialLinks, copyright
}) => {
    return (
        <footer className="bg-[#121213] text-white py-24 px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 flex items-center justify-center font-bold text-2xl">
                                <img
                                    src={LogoImage}
                                    alt="LogoImage"
                                    className='w-14 h-14 obj'
                                />
                            </div>
                        </div>
                        <p className="text-white text-lg leading-relaxed">{description}</p>
                        <div className="flex gap-4 mt-8">
                            {socialLinks.map((link, index) => {
                                const Icon = link.icon;
                                return (
                                    <a key={index} href={link.path} className="p-2 bg-[#002cf2] rounded hover:bg-gray-700 transition-colors">
                                        <Icon className="w-7 h-7 text-white" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div> 
                        <h4 className="text-2xl font-semibold mb-8 text-[#3c5dee]">Quick Links</h4>
                        <ul className="space-y-4 text-lg">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.path} className="text-white hover:text-[#3c5dee] transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Features */}
                    <div>
                        <h4 className="text-2xl font-semibold mb-8 text-[#3c5dee]">Features</h4>
                        <ul className="space-y-4 text-lg">
                            {features.map((link, index) => (
                                <li key={index}>
                                    <a href={link.path} className="text-white hover:text-[#3c5dee] transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-2xl font-semibold mb-8 text-[#3c5dee]">Contact</h4>
                        <ul className="space-y-4 text-lg text-white">
                            <li className="flex items-center gap-3">
                                <BiMapPin className="w-7 h-7 shrink-0" />
                                <span>{contact.address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <BiCalendar className="w-7 h-7 shrink-0" />
                                <span>{contact.hours}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <BiPhone className="w-7 h-7 shrink-0" />
                                <span>{contact.phone}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-[#3c5dee] mt-20 pt-10 text-center text-lg text-white">
                    <p>&copy; {new Date().getFullYear()} {copyright}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;