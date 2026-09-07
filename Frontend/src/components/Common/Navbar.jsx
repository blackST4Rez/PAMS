import LogoImage from '../../assets/Logo.svg'

const Navbar = () => {
    return (
        <div>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-start items-center h-15 bg-white border-b border-black gap-20 text-xl font-medium">
                    <img
                        src={LogoImage}
                        alt="LogoImage"
                        className='w-10 h-10'
                    />
                    <ul className="flex gap-6 font-semibold text-2xl">
                        <li className='hover:text-[#002cf2] transition-all ease-in-out duration-300 cursor-pointer'>Products</li>
                        <li className='hover:text-[#002cf2] transition-all ease-in-out duration-300 cursor-pointer'>Services</li>
                        <li className='hover:text-[#002cf2] transition-all ease-in-out duration-300 cursor-pointer'>Careers</li>
                        <li className='hover:text-[#002cf2] transition-all ease-in-out duration-300 cursor-pointer'>Contact</li>
                    </ul>
                </div>
            </div>
            <div className="w-full h-10 bg-[#002cf2] text-white">
                Nav sub-items
            </div>
        </div>
    )
}

export default Navbar