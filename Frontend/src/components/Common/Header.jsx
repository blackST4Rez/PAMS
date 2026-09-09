import { BiLogIn } from "react-icons/bi";
import { Link } from "react-router-dom";
import LogoImage from "../../assets/Logo.svg";

const Header = () => {
    return (
        <div>
            <div className="bg-[#111112]">
                <div className="flex max-w-6xl h-25 bg-[#111112] items-center justify-between mx-auto px-4">
                    {/* Logo - Click to go to Home */}
                    <Link to="/" className="flex gap-4 items-center">
                        <img
                            src={LogoImage}
                            alt="LogoImage"
                            className="w-15 h-15"
                        />
                        <div className="h-15 flex-row items-center">
                            <span className="font-bold text-2xl text-[#173ef0]">PMS</span>
                            <p className="text-white">Asset Management</p>
                        </div>
                    </Link>
                    
                    <div className="flex items-center gap-3">
                        <Link to="/login">
                            <button
                                className="flex w-50 h-5 my-auto gap-2 rounded-4xl items-center bg-[#173ef0] text-white px-12 py-8 font-semibold text-xl hover:bg-[#0020ad] transition-colors ease-in-out duration-300 cursor-pointer"
                            >
                                <BiLogIn className="w-6 h-6 text-white" />
                                <span>Sign In</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;