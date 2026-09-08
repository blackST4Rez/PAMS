import { BiBuildingHouse, BiCalendar, BiLogoGmail, BiPhone, BiSolidNavigation } from "react-icons/bi"
import LogoImage from "../../assets/Logo.svg"

const Header = () => {
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
                        <p className="text-white text-lg">Public Assets Management</p>
                        <p className="text-white text-lg">System for Gaurishankar Rural</p>
                        <p className="text-white text-lg">Municipality, Dolakha.</p>
                        <div className="flex gap-4 mt-8">
                            <div className="flex w-10 h-10 bg-[#173ef0] hover:bg-[#0020ad] justify-center items-center rounded cursor-pointer transition-colors ease-in-out duration-300">
                                <BiBuildingHouse className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex w-10 h-10 bg-[#173ef0] hover:bg-[#0020ad] justify-center items-center rounded cursor-pointer transition-colors ease-in-out duration-300 ">
                                <BiPhone className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex w-10 h-10 bg-[#173ef0] hover:bg-[#0020ad] justify-center items-center rounded cursor-pointer transition-colors ease-in-out duration-300">
                                <BiLogoGmail className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-2xl font-semibold mb-8 text-[#3c5dee]">Quick Links</h4>
                        <ul className="space-y-4 text-lg">
                            <li className="hover:text-[#3c5dee] transition-colors ease-in-out duration-300">Sign In</li>
                            <li className="hover:text-[#3c5dee] transition-colors ease-in-out duration-300" >Get Started</li>
                            <li className="hover:text-[#3c5dee] transition-colors ease-in-out duration-300" >About</li>
                            <li className="hover:text-[#3c5dee] transition-colors ease-in-out duration-300" >Contact</li>
                        </ul>
                    </div>

                    {/* Features */}
                    <div>
                        <h4 className="text-2xl font-semibold mb-8 text-[#3c5dee]">Features</h4>
                        <ul className="space-y-4 text-lg">
                            <li className="hover:text-[#3c5dee] transition-colors ease-in-out duration-300" >Asset Registry</li>
                            <li className="hover:text-[#3c5dee] transition-colors ease-in-out duration-300" >Maintainence</li>
                            <li className="hover:text-[#3c5dee] transition-colors ease-in-out duration-300" >Valuation</li>
                            <li className="hover:text-[#3c5dee] transition-colors ease-in-out duration-300" >Reports</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-2xl font-semibold mb-8 text-[#3c5dee]">Contact</h4>
                        <ul className="space-y-4 text-lg text-white">
                            <li className="flex items-center gap-3">
                                <BiSolidNavigation className="w-7 h-7 shrink-0" />
                                <span>Gaurishankar, Dolakha</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <BiCalendar className="w-7 h-7 shrink-0" />
                                <span>9 AM to 5 PM</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <BiPhone className="w-7 h-7 shrink-0" />
                                <span>+977 123 456789</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-[#3c5dee] mt-20 pt-10 text-center text-lg text-white">
                    <p>&copy; {new Date().getFullYear()} Gaurishankar Rural Municipality. All Rights Resserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Header