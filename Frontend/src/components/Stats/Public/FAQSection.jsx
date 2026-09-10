import { FaChevronDown } from 'react-icons/fa';

const FAQSection = () => {
    const faqs = [
        { question: 'How often is the asset data updated?', answer: 'Data is updated every Monday at 3:00 AM.' },
        { question: 'How can I report an issue with a public asset?', answer: 'Contact the municipality office or use the contact form.' },
        { question: 'What do the different asset categories mean?', answer: 'Categories group assets by type: Land, Building, Vehicle, Road, Infrastructure, and Equipment.' },
        { question: 'Can I download asset reports?', answer: 'Yes, use the Download Asset Report link in the Useful Links section.' },
    ];

    return (
        <div className="p-6 h-full flex flex-col">
            <h3 className="text-2xl font-semibold text-sky-400 mb-4">Frequently Asked Questions</h3>
            <div className="flex-1 space-y-2">
                {faqs.map((faq, index) => (
                    <div key={index} className="py-5 px-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer">
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-medium text-white">{faq.question}</p>
                            <FaChevronDown className="w-3.5 h-3.5 text-white/40" />
                        </div>
                        <p className="text-l text-white/60 mt-1.5">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQSection;