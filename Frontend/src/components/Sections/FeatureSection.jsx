import { BiBarChartAlt, BiCheckCircle, BiShield, BiSolidCube, BiTrendingUp, BiWrench } from "react-icons/bi";

const FeaturesSection = () => {
    return (
        <section className="py-25 px-8 lg:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="space-y-2">
                    <div className="w-max items-center gap-4 px-8 py-4 bg-[#002cf2] rounded-full text-lg font-semibold text-white mx-auto">
                        <span>Features</span>
                    </div>
                    <h2 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight text-center">
                        Everything You Need to
                    </h2>
                    <h2 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight text-center" >
                        Manage Assets
                    </h2>
                    <p className="text-2xl text-gray-600 leading-relaxed max-w-4xl text-center mx-auto">
                        Comprehensive features designed specifically for rural municipality asset management
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                    {/* Asset Registry */}
                    <div className="bg-white hover:shadow-md transition-all ease-in-out duration-300 p-10 border-l-2 border-r-2">
                        <div className="text-blue-600 mb-4">
                            <BiSolidCube className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-5">
                            Asset Registry
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Track every public asset from acquisition to disposal with complete
                            lifecycle management.
                        </p>
                    </div>

                    {/* Maintenance Management */}
                    <div className="bg-white hover:shadow-md transition-all ease-in-out duration-300 p-10 border-l-2 border-r-2">
                        <div className="text-blue-600 mb-4">
                            <BiWrench className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-5">
                            Maintenance Management
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Schedule and log maintenance activities with automated reminders
                            and cost tracking.
                        </p>
                    </div>

                    {/* Valuation & Depreciation */}
                    <div className="bg-white hover:shadow-md transition-all ease-in-out duration-300 p-10 border-l-2 border-r-2">
                        <div className="text-blue-600 mb-4">
                            <BiTrendingUp className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-5">
                            Valuation & Depreciation
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Calculate asset depreciation and current valuation with multiple
                            depreciation methods.
                        </p>
                    </div>

                    {/* Approval Workflow */}
                    <div className="bg-white hover:shadow-md transition-all ease-in-out duration-300 p-10 border-l-2 border-r-2">
                        <div className="text-blue-600 mb-4">
                            <BiCheckCircle className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-5">
                            Approval Workflow
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Multi-level approval engine for asset disposal, transfers, and
                            major changes.
                        </p>
                    </div>

                    {/* Reports & Analytics */}
                    <div className="bg-white hover:shadow-md transition-all ease-in-out duration-300 p-10 border-l-2 border-r-2">
                        <div className="text-blue-600 mb-4">
                            <BiBarChartAlt className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-5">
                            Reports & Analytics
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Generate comprehensive reports on asset register, real-time
                            breakdown, and maintenance costs.
                        </p>
                    </div>

                    {/* Audit Trails */}
                    <div className="bg-white hover:shadow-md transition-all ease-in-out duration-300 p-10 border-l-2 border-r-2">
                        <div className="text-blue-600 mb-4">
                            <BiShield className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-5">
                            Audit Trails
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Complete accountability with detailed audit logs of every action
                            in the system.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;