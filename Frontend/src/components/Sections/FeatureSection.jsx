import SectionHeading from '../Common/SectionHeading';

const FeaturesSection = ({ data }) => {
    const { badge, title, description, items } = data;

    return (
        <section id="features" className="py-25 px-8 lg:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <SectionHeading
                    badge={badge}
                    title={title}
                    description={description}
                    className="mb-25"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {items.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white border-l-2 border-r-2 p-12 hover:shadow-2xl transition-all ease-in-out duration-300 group"
                            >
                                <div className={`p-5 rounded-2xl ${feature.bgColor} w-fit group-hover:scale-110 transition-transform`}>
                                    <Icon className={`w-10 h-10 ${feature.color}`} />
                                </div>
                                <h3 className="text-3xl font-bold text-[#355aff] mt-8">{feature.title}</h3>
                                <p className="text-xl text-black mt-4 leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;