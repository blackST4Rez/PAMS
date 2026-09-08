import { BiLogIn } from "react-icons/bi"
import LogoImage from "../../assets/Logo.svg"

const Header = () => {
    return (
        <div>
            <div className="bg-[#111112]">
                <div className="flex max-w-6xl h-25 bg-[#111112] items-center justify-between mx-auto" >
                    <div className="flex gap-4">
                        <img
                            src={LogoImage}
                            alt="LogoImage"
                            className="w-15 h-15"
                        />
                        <div className="h-15 flex-row items-center">
                            <span className="font-bold text-2xl text-[#173ef0]">PMS</span>
                            <p className="text-white">Asset Management</p>
                        </div>
                    </div>
                    <button
                        className="flex w-50 h-5 my-auto gap-2 items-center bg-[#173ef0] text-white px-12 py-8 font-semibold text-xl hover:bg-[#264bee] transition-all ease-in-out duration-300 cursor-pointer">
                        <BiLogIn className="w-6 h-6 text-white" />
                        <span>Sign In</span>
                    </button>
                </div>
            </div>
        </div>
    )
    }

export default Header