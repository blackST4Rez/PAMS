const Footer = () => {
    return (
        <footer className="bg-[#1a1a1a] border-t border-white/10 py-4 px-6 mt-auto">
            <p className="text-center text-sm text-white/50">
                &copy; {new Date().getFullYear()} Gaurishankar Rural Municipality. All Rights Reserved.
            </p>
        </footer>
    );
};

export default Footer;