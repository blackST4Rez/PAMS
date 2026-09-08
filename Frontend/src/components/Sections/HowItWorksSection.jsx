import { BiCheckCircle, BiDollar, BiPlus, BiRightArrowAlt, BiWrench } from 'react-icons/bi';

const HowItWorksSection = () => {

    return (
        <section className="bg-gray-50 py-20 px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="space-y-2 mb-10">
                    <div className="w-max items-center gap-4 px-8 py-4 bg-[#002cf2] rounded-full text-lg font-semibold text-white mx-auto">
                        <span>How It Works</span>
                    </div>
                    <h2 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight text-center">
                        Simple Steps to Get
                    </h2>
                    <h2 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight text-center" >
                        Started
                    </h2>
                    <p className="text-2xl text-gray-600 leading-relaxed max-w-4xl text-center mx-auto">
                        Start managing your public assets effectively in just a few steps
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white relative hover:bg-[#f5f5f5] rounded p-8 border border-gray-200 transition-all ease-in-out duration-300 flex-1 flex flex-col cursor-pointer">
                        <div className="text-6xl font-bold text-indigo-100 mb-6">
                            01
                        </div>
                        <div className="p-4 rounded-2xl w-fit mb-6">
                            <BiPlus className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Register Assets
                        </h3>
                        <p className="text-gray-600 leading-relaxed flex-1">
                            Add new assets with details like title, category, acquisition cost, and location.
                        </p>
                        <div className="hidden lg:flex absolute -right-5 top-[40%] items-center justify-center bg-white rounded-full w-10 h-10 border border-gray-300">
                            <BiRightArrowAlt className="w-6 h-6 text-[#002cf2]" />
                        </div>

                    </div>

                    <div className="bg-white relative hover:bg-[#f5f5f5] rounded p-8 border border-gray-200 transition-all ease-in-out duration-300 flex-1 flex flex-col cursor-pointer">
                        <div className="text-6xl font-bold text-indigo-100 mb-6">
                            02
                        </div>
                        <div className="p-4 rounded-2xl w-fit mb-6">
                            <BiWrench className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Track & Maintain
                        </h3>
                        <p className="text-gray-600 leading-relaxed flex-1">
                            Schedule maintenance, log activities, and monitor asset health in real-time.
                        </p>
                        <div className="hidden lg:flex absolute -right-5 top-[40%] items-center justify-center bg-white rounded-full w-10 h-10 border border-gray-300">
                            <BiRightArrowAlt className="w-6 h-6 text-[#002cf2]" />
                        </div>
                    </div>

                    <div className="bg-white relative hover:bg-[#f5f5f5] rounded p-8 border border-gray-200 transition-all ease-in-out duration-300 flex-1 flex flex-col cursor-pointer">
                        <div className="text-6xl font-bold text-indigo-100 mb-6">
                            03
                        </div>
                        <div className="p-4 rounded-2xl w-fit mb-6">
                            <BiDollar className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Value & Depreciate
                        </h3>
                        <p className="text-gray-600 leading-relaxed flex-1">
                            Run depreciation calculations and get accurate current asset values.
                        </p>
                        <div className="hidden lg:flex absolute -right-5 top-[40%] items-center justify-center bg-white rounded-full w-10 h-10 border border-gray-300">
                            <BiRightArrowAlt className="w-6 h-6 text-[#002cf2]" />
                        </div>
                    </div>


                    <div className="bg-white relative hover:bg-[#f5f5f5] rounded p-8 border border-gray-200 transition-all ease-in-out duration-300 flex-1 flex flex-col cursor-pointer">
                        <div className="text-6xl font-bold text-indigo-100 mb-6">
                            04
                        </div>
                        <div className="p-4 rounded-2xl w-fit mb-6">
                            <BiCheckCircle className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Approve & Transfer
                        </h3>
                        <p className="text-gray-600 leading-relaxed flex-1">
                            Manage asset transfers and disposals through multi-level approval workflows.
                        </p>
                        <div className="hidden lg:flex absolute -right-5 top-[40%] items-center justify-center bg-white rounded-full w-10 h-10 border border-gray-300">
                            <BiRightArrowAlt className="w-6 h-6 text-[#002cf2]" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;