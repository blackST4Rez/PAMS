import { BiArrowFromLeft } from "react-icons/bi";

const CTASection = () => {

    return (
        <section className="py-25 px-8 lg:px-12 bg-white">
            <div className="max-w-5xl mx-auto text-center">
                <div className="bg-linear-to-br from-indigo-50 to-blue-50 rounded-3xl p-20 border border-indigo-100">
                    <h2 className="text-6xl lg:text-7xl font-bold text-gray-900">Ready to Start Managing </h2>
                    <h2 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-5">Your Assets ?</h2>
                    <span className="text-2xl text-gray-600 mt-8 max-w-2xl mx-auto leading-relaxed">Join Gaurishankar Rural Municipality and streamline your</span>
                    <span className="text-2xl text-gray-600 mt-8 max-w-2xl mx-auto leading-relaxed">asset management process today.</span>
                    <div className="flex flex-wrap justify-center gap-6 mt-12">
                        <button
                            className="flex w-60 h-5 my-auto gap-2 items-center bg-[#173ef0] text-white px-12 py-8 font-semibold text-xl hover:bg-[#0020ad] transition-colors ease-in-out duration-300 cursor-pointer">
                            <span>Get Started</span>
                            <BiArrowFromLeft className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;