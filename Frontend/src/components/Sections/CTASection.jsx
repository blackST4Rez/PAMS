import Button from '../Common/Button';
import { BiRightArrowAlt} from 'react-icons/bi';

const CTASection = ({ data }) => {
    const { title, description, buttons } = data;

    return (
        <section className="py-25 px-8 lg:px-12 bg-white">
            <div className="max-w-5xl mx-auto text-center">
                <div className="bg-linear-to-br from-indigo-50 to-blue-50 rounded-3xl p-20 border border-indigo-100">
                    <h2 className="text-6xl lg:text-7xl font-bold text-gray-900">{title}</h2>
                    <p className="text-2xl text-gray-600 mt-8 max-w-2xl mx-auto leading-relaxed">{description}</p>
                    <div className="flex flex-wrap justify-center gap-6 mt-12">
                        {buttons.map((btn, index) => (
                            <Button
                                key={index}
                                to={btn.path}
                                variant={btn.primary ? 'primary' : 'secondary'}
                                size="xlarge"
                                iconPosition="left"
                            >
                                {btn.label}
                                {btn.primary && <BiRightArrowAlt className="w-7 h-7" />}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;